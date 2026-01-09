import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchUserProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
      } else {
        // Create a basic profile if none exists
        setUser({
          id: userId,
          name: email.split('@')[0],
          email: email,
          role: 'user',
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || '');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha inválidos');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor, confirme seu email antes de fazer login');
        } else {
          toast.error(error.message);
        }
        return false;
      }

      if (data.session) {
        toast.success('Login realizado com sucesso!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Erro inesperado ao fazer login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        console.error('Register error:', error);
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error(error.message);
        }
        return false;
      }

      if (data.user) {
        // Create profile for the new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            name: name,
            role: 'user',
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        if (data.session) {
          toast.success('Conta criada com sucesso!');
        } else {
          toast.success('Conta criada! Verifique seu email para confirmar.');
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected register error:', error);
      toast.error('Erro inesperado ao criar conta');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Erro ao fazer logout');
        return;
      }

      setUser(null);
      setSession(null);

      // Clear any local storage items related to the old auth
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('crm_clients');

      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Erro inesperado ao fazer logout');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        user,
        session,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
