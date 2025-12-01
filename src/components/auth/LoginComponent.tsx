import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield,
  Users,
  Crown,
  Mail,
  Eye,
  EyeOff
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

  const fillDemoCredentials = (userType: string) => {
    const credentials: { [key: string]: { email: string; password: string } } = {
      'aurovel-admin': { email: 'admin@aurovel.com', password: 'password' }, // Assuming these might be available in DB or just placeholders
      'client-admin': { email: 'admin@client.com', password: 'password' },
    };

    const cred = credentials[userType];
    if (cred) {
      setLoginData({ ...loginData, email: cred.email, password: cred.password });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <Label htmlFor="password">Senha</Label>
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

        {/* Demo Credentials Hint - Simplified */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Ambiente de Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-muted/50">
              <Crown className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Utilize as credenciais fornecidas pelo administrador do sistema ou tente:<br/>
                <strong>Email:</strong> admin@aurovel.com<br/>
                <strong>Senha:</strong> password
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginComponent;
