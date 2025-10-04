import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building, 
  Users, 
  ArrowLeft, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Target,
  Eye,
  UserPlus,
  ExternalLink
} from 'lucide-react';
// Mock data removed - using empty initial state
// Mock data removed - using empty initial state
import { CompanyData } from '@/types/company';
import { ContactData } from '@/types/contact';

interface CompanyContactMatchingProps {
  onBack: () => void;
}

export default function CompanyContactMatching({ onBack }: CompanyContactMatchingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Função para calcular similaridade entre textos
  const calculateTextSimilarity = (str1: string, str2: string): number => {
    const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const s1 = normalize(str1);
    const s2 = normalize(str2);
    
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(word => words2.some(w => w.includes(word) || word.includes(w)));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  };
  
  // Mock data - empresas
  const companies = [
    {},
    {
      ...{},
      id: '2',
      identificacao: {
        ...{}.identificacao,
        cnpj: '98.765.432/0001-10',
        razaoSocial: 'Translog Brasil Transportes S.A.',
        nomeFantasia: 'Translog',
      },
      contatos: {
        ...{}.contatos,
        email: 'contato@translog.com.br',
      }
    },
    {
      ...{},
      id: '3',
      identificacao: {
        ...{}.identificacao,
        cnpj: '11.222.333/0001-44',
        razaoSocial: 'InovaCorp Tecnologia Ltda',
        nomeFantasia: 'InovaCorp',
      },
      contatos: {
        ...{}.contatos,
        email: 'contato@inovacorp.com.br',
      }
    }
  ];

  // Mock data - contatos
  const contacts = [
    {},
    {
      ...{},
      id: '2',
      dadosPessoais: {
        ...{}.dadosPessoais,
        nomeCompleto: 'Maria Silva Santos',
        cpf: '987.654.321-00',
        email: 'maria.santos@translog.com.br'
      },
      profissional: {
        ...{}.profissional,
        empresa: 'Translog Brasil S.A.',
        cargo: 'Gerente Comercial',
      }
    },
    {
      ...{},
      id: '3',
      dadosPessoais: {
        ...{}.dadosPessoais,
        nomeCompleto: 'Carlos Eduardo Oliveira',
        cpf: '456.789.123-44',
        email: 'carlos.oliveira@translog.com.br'
      },
      profissional: {
        ...{}.profissional,
        empresa: 'Translog Brasil S.A.',
        cargo: 'Diretor Operacional',
      }
    },
    {
      ...{},
      id: '4',
      dadosPessoais: {
        ...{}.dadosPessoais,
        nomeCompleto: 'Ana Paula Costa',
        cpf: '321.654.987-11',
        email: 'ana.costa@inovacorp.com.br'
      },
      profissional: {
        ...{}.profissional,
        empresa: 'InovaCorp Tecnologia',
        cargo: 'Diretora Financeira',
      }
    }
  ];

  // Função de matching inteligente
  const getCompanyMatches = useMemo(() => {
    return companies.map(company => {
      const companyDomain = company.contatos?.email?.split('@')[1]?.toLowerCase() || '';
      const companyName = company.identificacao?.nomeFantasia?.toLowerCase() || company.identificacao?.razaoSocial?.toLowerCase() || '';
      
      const matchedContacts = contacts.map(contact => {
        const contactEmail = contact.dadosPessoais?.email?.toLowerCase() || '';
        const contactCompany = contact.profissional?.empresa?.toLowerCase() || '';
        const contactDomain = contactEmail.split('@')[1] || '';
        
        let score = 0;
        const matchReasons: string[] = [];
        
        // 60 pontos - Domínio do email igual
        if (companyDomain && contactDomain === companyDomain) {
          score += 60;
          matchReasons.push('Mesmo domínio de email');
        }
        
        // 30 pontos - Nome da empresa similar
        if (companyName && contactCompany) {
          const similarity = calculateTextSimilarity(companyName, contactCompany);
          if (similarity > 0.7) {
            score += Math.round(similarity * 30);
            matchReasons.push('Nome da empresa similar');
          }
        }
        
        // 10 pontos - Email corporativo detectado
        if (contactEmail.includes(companyName.split(' ')[0]) || 
            contactEmail.includes('comercial') || 
            contactEmail.includes('contato')) {
          score += 10;
          matchReasons.push('Email corporativo');
        }
        
        return {
          contact,
          score,
          matchReasons,
          isMatched: score >= 50 // Consideramos match se score >= 50
        };
      }).filter(match => match.isMatched)
        .sort((a, b) => b.score - a.score);

      return {
        company,
        matches: matchedContacts,
        totalMatches: matchedContacts.length,
        averageScore: matchedContacts.length > 0 
          ? Math.round(matchedContacts.reduce((acc, match) => acc + match.score, 0) / matchedContacts.length)
          : 0
      };
    });
  }, []);

  // Filtrar por busca
  const filteredMatches = getCompanyMatches.filter(match => {
    const searchNorm = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const companyName = (match.company.identificacao?.nomeFantasia || match.company.identificacao?.razaoSocial || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cnpj = match.company.identificacao?.cnpj || '';
    
    return companyName.includes(searchNorm) || cnpj.includes(searchNorm);
  });

  // Obter cor do score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const totalMatches = filteredMatches.reduce((acc, match) => acc + match.totalMatches, 0);
  const averageScore = filteredMatches.length > 0 
    ? Math.round(filteredMatches.reduce((acc, match) => acc + match.averageScore, 0) / filteredMatches.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao CRM
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                Matching Inteligente: Empresa × Contatos
              </h1>
              <p className="text-gray-600">
                Visualize os contatos vinculados a cada empresa através de algoritmo inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Pesquisar por nome da empresa ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Total Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{totalMatches}</div>
                <div className="text-sm text-gray-500">vínculos encontrados</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Score Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{averageScore}</div>
                <div className="text-sm text-gray-500">matching score</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Matches */}
        <div className="space-y-6">
          {filteredMatches.map((companyMatch) => (
            <Card key={companyMatch.company.id} className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {companyMatch.company.identificacao?.nomeFantasia || companyMatch.company.identificacao?.razaoSocial}
                      </CardTitle>
                      <CardDescription>
                        CNPJ: {companyMatch.company.identificacao?.cnpj} • 
                        {companyMatch.totalMatches} contatos vinculados
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      Score Médio: {companyMatch.averageScore}
                    </Badge>
                    <Badge variant="outline">
                      {companyMatch.totalMatches} matches
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {companyMatch.matches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companyMatch.matches.map(({ contact, score, matchReasons }) => (
                      <Card key={contact.id} className="border hover:shadow-md transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {contact.dadosPessoais?.nomeCompleto}
                            </CardTitle>
                            <Badge className={`${getScoreColor(score)} font-semibold border`}>
                              {score}
                            </Badge>
                          </div>
                          <CardDescription>
                            {contact.profissional?.cargo}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 pt-0">
                          {/* Email */}
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-500" />
                            <span className="text-blue-600">{contact.dadosPessoais?.email}</span>
                          </div>

                          {/* Telefone */}
                          {contact.dadosPessoais?.telefone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-gray-500" />
                              <span>{contact.dadosPessoais?.telefone}</span>
                            </div>
                          )}

                          {/* Empresa */}
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-3 h-3 text-gray-500" />
                            <span>{contact.profissional?.empresa}</span>
                          </div>

                          {/* Match Reasons */}
                          <div className="pt-2 border-t">
                            <div className="flex items-center gap-1 mb-1">
                              <Target className="w-3 h-3 text-purple-500" />
                              <span className="text-xs font-medium text-purple-700">Critérios de Match:</span>
                            </div>
                            {matchReasons.map((reason, index) => (
                              <p key={index} className="text-xs text-purple-600">• {reason}</p>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Perfil
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      Nenhum contato encontrado
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Nenhum contato foi vinculado automaticamente a esta empresa
                    </p>
                    <Button size="sm" variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar Contato Manualmente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-gray-400 mb-4">
              Tente ajustar os filtros de busca ou adicione mais empresas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}