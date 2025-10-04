import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Building2, User, MapPin, Phone, Mail, Globe, Users, TrendingUp } from 'lucide-react';
import { ContactData } from './ContactWizardComponent';
import { CompanyData } from './CompanyWizardComponent';

interface MatchResult {
  contactId: string;
  companyId: string;
  score: number;
  reasons: string[];
  contact: ContactData;
  company: CompanyData;
}

interface SmartMatchingProps {
  contacts?: ContactData[];
  companies?: CompanyData[];
  onMatchConfirm?: (matches: MatchResult[]) => void;
  onMatchReject?: (match: MatchResult) => void;
  className?: string;
  autoMatch?: boolean;
}

export const SmartMatchingComponent: React.FC<SmartMatchingProps> = ({
  contacts = [],
  companies = [],
  onMatchConfirm,
  onMatchReject,
  className = "",
  autoMatch = false
}) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set());

  const calculateSimilarity = (str1: string, str2: string): number => {
    if (!str1 || !str2) return 0;
    
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    if (s1 === s2) return 100;
    
    // Jaccard similarity for words
    const words1 = new Set(s1.split(/\s+/));
    const words2 = new Set(s2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return (intersection.size / union.size) * 100;
  };

  const normalizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  const calculateMatchScore = (contact: ContactData, company: CompanyData): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // Company name matching (highest weight)
    if (contact.empresa && company.nomeFantasia) {
      const companySimilarity = calculateSimilarity(contact.empresa, company.nomeFantasia);
      if (companySimilarity > 70) {
        score += companySimilarity * 0.4; // 40% weight
        reasons.push(`Nome da empresa similar (${companySimilarity.toFixed(0)}%)`);
      }
    }

    if (contact.empresa && company.razaoSocial) {
      const razaoSimilarity = calculateSimilarity(contact.empresa, company.razaoSocial);
      if (razaoSimilarity > 70) {
        score += razaoSimilarity * 0.4;
        reasons.push(`Razão social similar (${razaoSimilarity.toFixed(0)}%)`);
      }
    }

    // Email domain matching (high weight)
    if (contact.email && company.email) {
      const contactDomain = contact.email.split('@')[1]?.toLowerCase();
      const companyDomain = company.email.split('@')[1]?.toLowerCase();
      
      if (contactDomain && companyDomain && contactDomain === companyDomain) {
        score += 30;
        reasons.push('Mesmo domínio de email');
      }
    }

    // Website domain matching
    if (contact.email && company.website) {
      const contactDomain = contact.email.split('@')[1]?.toLowerCase();
      const websiteDomain = company.website.replace(/https?:\/\/(www\.)?/, '').split('/')[0].toLowerCase();
      
      if (contactDomain && websiteDomain && contactDomain === websiteDomain) {
        score += 25;
        reasons.push('Email compatível com website');
      }
    }

    // Phone matching (medium weight)
    const contactPhones = [contact.telefone, contact.celular].filter(Boolean).map(normalizePhone);
    const companyPhones = [company.telefone, company.celular].filter(Boolean).map(normalizePhone);
    
    for (const contactPhone of contactPhones) {
      for (const companyPhone of companyPhones) {
        if (contactPhone && companyPhone) {
          if (contactPhone === companyPhone) {
            score += 20;
            reasons.push('Telefone idêntico');
          } else if (contactPhone.substring(0, 8) === companyPhone.substring(0, 8)) {
            score += 10;
            reasons.push('Telefone similar (mesmo DDD e prefixo)');
          }
        }
      }
    }

    // Location matching (low weight)
    if (contact.cidade && company.cidade) {
      const citySimilarity = calculateSimilarity(contact.cidade, company.cidade);
      if (citySimilarity > 80) {
        score += citySimilarity * 0.1;
        reasons.push(`Mesma cidade (${citySimilarity.toFixed(0)}%)`);
      }
    }

    if (contact.estado && company.estado && contact.estado === company.estado) {
      score += 5;
      reasons.push('Mesmo estado');
    }

    // Executive position bonus
    if (contact.cargo) {
      const executiveKeywords = ['diretor', 'gerente', 'coordenador', 'supervisor', 'ceo', 'cto', 'cfo', 'presidente'];
      const hasExecutiveRole = executiveKeywords.some(keyword => 
        contact.cargo.toLowerCase().includes(keyword)
      );
      
      if (hasExecutiveRole) {
        score += 5;
        reasons.push('Cargo executivo identificado');
      }
    }

    return { score: Math.min(score, 100), reasons };
  };

  const performMatching = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const newMatches: MatchResult[] = [];
      
      contacts.forEach(contact => {
        companies.forEach(company => {
          const { score, reasons } = calculateMatchScore(contact, company);
          
          if (score >= 60) { // Minimum threshold for matching
            newMatches.push({
              contactId: contact.id!,
              companyId: company.id!,
              score,
              reasons,
              contact,
              company
            });
          }
        });
      });

      // Sort by score descending
      newMatches.sort((a, b) => b.score - a.score);
      
      // Remove duplicate contacts (keep highest score)
      const uniqueMatches: MatchResult[] = [];
      const usedContacts = new Set<string>();
      
      newMatches.forEach(match => {
        if (!usedContacts.has(match.contactId)) {
          uniqueMatches.push(match);
          usedContacts.add(match.contactId);
        }
      });

      setMatches(uniqueMatches);
      setIsProcessing(false);
      
      if (uniqueMatches.length > 0) {
        toast.success(`${uniqueMatches.length} correspondências encontradas!`);
      } else {
        toast.info('Nenhuma correspondência encontrada com score acima de 60%');
      }
    }, 1500);
  };

  const toggleMatchSelection = (matchId: string) => {
    const newSelected = new Set(selectedMatches);
    if (newSelected.has(matchId)) {
      newSelected.delete(matchId);
    } else {
      newSelected.add(matchId);
    }
    setSelectedMatches(newSelected);
  };

  const confirmSelectedMatches = () => {
    const confirmedMatches = matches.filter(match => 
      selectedMatches.has(`${match.contactId}-${match.companyId}`)
    );
    
    if (onMatchConfirm) {
      onMatchConfirm(confirmedMatches);
    }
    
    toast.success(`${confirmedMatches.length} correspondências confirmadas!`);
  };

  const rejectMatch = (match: MatchResult) => {
    setMatches(prev => prev.filter(m => 
      !(m.contactId === match.contactId && m.companyId === match.companyId)
    ));
    
    if (onMatchReject) {
      onMatchReject(match);
    }
    
    toast.info('Correspondência rejeitada');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muito Boa';
    if (score >= 70) return 'Boa';
    return 'Moderada';
  };

  useEffect(() => {
    if (autoMatch && contacts.length > 0 && companies.length > 0) {
      performMatching();
    }
  }, [contacts, companies, autoMatch]);

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Correspondência Inteligente
        </CardTitle>
        <div className="text-center text-muted-foreground">
          <p>Conecte automaticamente contatos às suas empresas usando IA</p>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {contacts.length} Contatos
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {companies.length} Empresas
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Control Panel */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Button 
            onClick={performMatching} 
            disabled={isProcessing || contacts.length === 0 || companies.length === 0}
            className="w-full sm:w-auto"
          >
            {isProcessing ? 'Processando...' : 'Iniciar Correspondência'}
          </Button>
          
          {matches.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setSelectedMatches(new Set(matches.map(m => `${m.contactId}-${m.companyId}`)))}
              >
                Selecionar Todos
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedMatches(new Set())}
              >
                Limpar Seleção
              </Button>
              {selectedMatches.size > 0 && (
                <Button onClick={confirmSelectedMatches}>
                  Confirmar ({selectedMatches.size})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium">Analisando correspondências...</p>
              <p className="text-muted-foreground">Comparando dados de contatos e empresas</p>
            </div>
            <Progress value={75} className="w-full" />
          </div>
        )}

        {/* Results */}
        {matches.length > 0 && !isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Correspondências Encontradas ({matches.length})
              </h3>
              <div className="text-sm text-muted-foreground">
                Score mínimo: 60% | Ordenado por relevância
              </div>
            </div>

            <div className="grid gap-4">
              {matches.map((match) => {
                const matchId = `${match.contactId}-${match.companyId}`;
                const isSelected = selectedMatches.has(matchId);
                
                return (
                  <Card 
                    key={matchId} 
                    className={`transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMatchSelection(matchId)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Badge className={`${getScoreColor(match.score)} text-white`}>
                            {match.score.toFixed(0)}% - {getScoreLabel(match.score)}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => rejectMatch(match)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Rejeitar
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Contact Info */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold text-lg">{match.contact.nome}</h4>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            {match.contact.cargo && (
                              <p className="flex items-center gap-2">
                                <Badge variant="secondary">{match.contact.cargo}</Badge>
                                {match.contact.departamento && (
                                  <span className="text-muted-foreground">• {match.contact.departamento}</span>
                                )}
                              </p>
                            )}
                            
                            {match.contact.empresa && (
                              <p className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {match.contact.empresa}
                              </p>
                            )}
                            
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {match.contact.email}
                            </p>
                            
                            {(match.contact.celular || match.contact.telefone) && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {match.contact.celular || match.contact.telefone}
                              </p>
                            )}
                            
                            {(match.contact.cidade || match.contact.estado) && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {[match.contact.cidade, match.contact.estado].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Company Info */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-lg">{match.company.nomeFantasia}</h4>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            {match.company.razaoSocial !== match.company.nomeFantasia && (
                              <p className="text-muted-foreground">{match.company.razaoSocial}</p>
                            )}
                            
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {match.company.email}
                            </p>
                            
                            {(match.company.celular || match.company.telefone) && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {match.company.celular || match.company.telefone}
                              </p>
                            )}
                            
                            {match.company.website && (
                              <p className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                {match.company.website}
                              </p>
                            )}
                            
                            {(match.company.cidade || match.company.estado) && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {[match.company.cidade, match.company.estado].filter(Boolean).join(', ')}
                              </p>
                            )}
                            
                            {(match.company.segmento || match.company.porte) && (
                              <div className="flex gap-2">
                                {match.company.segmento && (
                                  <Badge variant="outline">{match.company.segmento}</Badge>
                                )}
                                {match.company.porte && (
                                  <Badge variant="outline">{match.company.porte}</Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Match Reasons */}
                      <div>
                        <h5 className="font-medium mb-2">Motivos da Correspondência:</h5>
                        <div className="flex flex-wrap gap-2">
                          {match.reasons.map((reason, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {matches.length === 0 && !isProcessing && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma correspondência encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {contacts.length === 0 || companies.length === 0
                ? 'Adicione contatos e empresas para começar a análise'
                : 'Clique em "Iniciar Correspondência" para encontrar conexões inteligentes'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartMatchingComponent;