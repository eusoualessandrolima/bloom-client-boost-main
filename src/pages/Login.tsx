import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (mode === 'register') {
      if (!name) {
        setError('Por favor, informe seu nome');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não conferem');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }

    setIsLoading(true);

    try {
      let success = false;

      if (mode === 'login') {
        success = await login(email, password, rememberMe);
      } else {
        success = await register(email, password, name);
        if (success) {
          // After successful registration, try to login
          success = await login(email, password, rememberMe);
        }
      }

      if (success) {
        navigate('/dashboard');
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        if (mode === 'login') {
          setError('Email ou senha incorretos');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setName('');
    setPassword('');
    setConfirmPassword('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#1a1f3a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#00FF94] animate-spin" />
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#1a1f3a] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00FF94]/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00FF94]/10 rounded-full blur-[100px]" />
      </div>

      {/* Login/Register Card */}
      <div
        className={cn(
          'relative w-full max-w-[420px] bg-white rounded-2xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-fade-in',
          shake && 'animate-shake'
        )}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FF94] to-[#00e085] flex items-center justify-center shadow-lg shadow-[#00FF94]/30">
            <MessageSquare className="w-8 h-8 text-black" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar nova conta'}
          </h1>
          <p className="text-gray-500">
            {mode === 'login' ? 'Faça login para continuar' : 'Preencha os dados para se cadastrar'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field (only for register) */}
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nome
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-12 pr-4 py-3.5 h-auto bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#00FF94] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-12 pr-4 py-3.5 h-auto bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#00FF94] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Senha
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-12 pr-12 py-3.5 h-auto bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#00FF94] focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (only for register) */}
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirmar Senha
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-12 pr-4 py-3.5 h-auto bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#00FF94] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Remember Me & Forgot Password (only for login) */}
          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                  className="border-gray-300 data-[state=checked]:bg-[#00FF94] data-[state=checked]:border-[#00FF94]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Lembrar-me
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-[#00FF94] hover:text-[#00e085] font-medium transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-[#00FF94] to-[#00e085] hover:from-[#00e085] hover:to-[#00cc75] text-black font-bold text-base rounded-xl shadow-lg shadow-[#00FF94]/30 hover:shadow-[#00FF94]/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
              </span>
            ) : (
              mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-400 text-sm">ou</span>
          </div>
        </div>

        {/* Toggle Mode Link */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#00FF94] hover:text-[#00e085] font-semibold transition-colors"
            >
              {mode === 'login' ? 'Criar conta gratuita' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
