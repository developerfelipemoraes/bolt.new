import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, TrendingUp } from 'lucide-react';

interface Company {
  _id: string;
  basicInfo: {
    legalName: string;
    tradeName?: string;
  };
  contact: {
    email: string;
  };
}

interface Contact {
  _id: string;
  personalInfo: {
    fullName: string;
  };
  contact: {
    email: string;
  };
  professional?: {
    company?: string;
    occupation?: string;
  };
}

interface Match {
  company: Company;
  contact: Contact;
  score: number;
  reasons: string[];
}

interface MatchingSystemProps {
  matches: Match[];
  companies: Company[];
  contacts: Contact[];
  onUpdate: () => void;
}

export default function MatchingSystemReal({ matches, companies, contacts, onUpdate }: MatchingSystemProps) {
  
  // Calcular matches baseado em domínio de email
  const calculateMatches = (): Match[] => {
    const calculatedMatches: Match[] = [];
    
    companies.forEach(company => {
      const companyDomain = company.contact.email.split('@')[1];
      
      contacts.forEach(contact => {
        const contactDomain = contact.contact.email.split('@')[1];
        let score = 0;
        const reasons: string[] = [];
        
        // Match por domínio de email (60 pontos)
        if (companyDomain === contactDomain && !['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'].includes(companyDomain)) {
          score += 60;
          reasons.push(`Mesmo domínio de email (${companyDomain})`);
        }
        
        // Match por nome da empresa no campo profissional (30 pontos)
        if (contact.professional?.company) {
          const companyName = company.basicInfo.tradeName || company.basicInfo.legalName;
          const professionalCompany = contact.professional.company;
          
          if (professionalCompany.toLowerCase().includes(companyName.toLowerCase()) || 
              companyName.toLowerCase().includes(professionalCompany.toLowerCase())) {
            score += 30;
            reasons.push(`Nome da empresa coincide`);
          }
        }
        
        // Cargo corporativo (10 pontos)
        if (contact.professional?.occupation) {
          const corporateRoles = ['gerente', 'diretor', 'financeiro', 'comercial', 'vendas'];
          const occupation = contact.professional.occupation.toLowerCase();
          
          if (corporateRoles.some(role => occupation.includes(role))) {
            score += 10;
            reasons.push(`Cargo corporativo: ${contact.professional.occupation}`);
          }
        }
        
        if (score > 40) { // Só incluir matches com score significativo
          calculatedMatches.push({
            company,
            contact,
            score,
            reasons
          });
        }
      });
    });
    
    return calculatedMatches.sort((a, b) => b.score - a.score);
  };

  const calculatedMatches = calculateMatches();
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">
              Total cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Total cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedMatches.length}</div>
            <p className="text-xs text-muted-foreground">
              Correspondências encontradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Matches List */}
      <Card>
        <CardHeader>
          <CardTitle>Correspondências Inteligentes</CardTitle>
          <CardDescription>
            Algoritmo de matching baseado em domínio de email, nome da empresa e cargo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calculatedMatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma correspondência encontrada
                </h3>
                <p>
                  Adicione mais empresas e contatos para encontrar correspondências
                </p>
              </div>
            ) : (
              calculatedMatches.map((match, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-600">
                          {match.company.basicInfo.tradeName || match.company.basicInfo.legalName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {match.contact.personalInfo.fullName}
                        </span>
                      </div>
                    </div>
                    <Badge className={`${getScoreColor(match.score)} font-semibold`}>
                      Score: {match.score}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Empresa:</strong> {match.company.contact.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Contato:</strong> {match.contact.contact.email}
                      {match.contact.professional?.occupation && (
                        <span> • {match.contact.professional.occupation}</span>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <strong className="text-sm">Motivos da correspondência:</strong>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {match.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}