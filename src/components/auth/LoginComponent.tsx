import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Shield,
  Mail,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { toast } from 'sonner';
import { User, Company } from '@/types/auth';
import { userService } from '@/services/userService';

interface LoginData {
  email: string;
  password: string;
}

interface LoginComponentProps {
  onLogin: (userData: User, companyData: Company) => void;
  className?: string;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin, className = "" }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authResult = await userService.authenticate(loginData.email, loginData.password);

      if (!authResult) {
        setError('Email ou senha incorretos.');
        toast.error('Falha no login', {
          description: 'Verifique suas credenciais e tente novamente.'
        });
        return;
      }

      const { user: userData, company: companyData } = authResult;

      toast.success('Login realizado com sucesso!', {
        description: `Bem-vindo, ${userData.name}`
      });

      onLogin(userData, companyData);

    } catch (err) {
      setError('Erro interno ao processar login.');
      toast.error('Erro no login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast.error('Email inválido', {
        description: 'Por favor, insira um email válido.'
      });
      return;
    }

    setResetLoading(true);
    try {
      const success = await userService.resetPassword(resetEmail);

      if (success) {
        toast.success('Email enviado!', {
          description: 'Verifique sua caixa de entrada para redefinir sua senha.'
        });
        setShowResetDialog(false);
        setResetEmail('');
      } else {
        toast.error('Erro ao enviar email', {
          description: 'Não foi possível enviar o email de recuperação. Verifique se o email está cadastrado.'
        });
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação');
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50 p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Login</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Fazer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password">Senha</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(loginData.email);
                      setShowResetDialog(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Dialog de Reset de Senha */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-blue-600" />
                Redefinir Senha
              </DialogTitle>
              <DialogDescription>
                Digite seu email cadastrado. Você receberá um link para redefinir sua senha.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowResetDialog(false);
                  setResetEmail('');
                }}
                disabled={resetLoading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? 'Enviando...' : 'Enviar Link'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoginComponent;
