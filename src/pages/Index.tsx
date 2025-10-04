import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, TrendingUp, TestTube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center">
      <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Componentes CRM
        </h1>

        <p className="text-lg text-muted-foreground animate-in fade-in delay-300 duration-700">
          Sistema completo de cadastro e correspondência inteligente
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Cadastro de Contatos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Formulário completo com validação de CPF, email e CEP
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Cadastro de Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Formulário completo com validação de CNPJ e dados comerciais
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Smart Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                IA para correspondência automática entre contatos e empresas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8">
          <Link to="/test">
            <Button size="lg" className="animate-in fade-in delay-500 duration-700">
              <TestTube className="h-5 w-5 mr-2" />
              Testar Componentes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}