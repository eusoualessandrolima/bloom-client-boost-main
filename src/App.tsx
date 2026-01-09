import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientProvider } from "@/contexts/ClientContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <ClientProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                <Route 
                  path="/clientes" 
                  element={
                    <ProtectedRoute>
                      <Clientes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ClientProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
