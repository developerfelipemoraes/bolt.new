import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building, Users, Search, Plus, Download, Upload, Link, Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
interface PJ {
  id: string;
  cnpj: string;
  razao: string;
  fantasia?: string;
  site?: string;
  dominio?: string;
  cidade?: string;
  uf?: string;
}

interface PF {
  id: string;
  nome: string;
  email?: string;
  tel?: string;
  empresa_hint?: string;
  cargo?: string;
}

interface Link {
  pfId: string;
  role: string;
  primary: boolean;
  notes?: string;
}

type LinksMap = { [pjId: string]: Link[] };

interface MatchingSystemProps {
  onBack: () => void;
}

const roleOptions = [
  'Responsável legal', 'Procurador', 'Sócio', 'Compras', 'Comercial',
  'Financeiro', 'Fiscal', 'Logística', 'Operações', 'Jurídico', 'Outros'
];

export default function MatchingSystem({ onBack }: MatchingSystemProps) {
  const [PJs, setPJs] = useState<PJ[]>([]);
  const [PFs, setPFs] = useState<PF[]>([]);
  const [Links, setLinks] = useState<LinksMap>({});
  const [selectedPJId, setSelectedPJId] = useState<string | null>(null);
  const [searchPJ, setSearchPJ] = useState('');
  const [searchPF, setSearchPF] = useState('');
  const { toast } = useToast();

  // Utility Functions
  const norm = (s: string): string => {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const domain = (email: string): string => {
    return (email || '').split('@')[1] || '';
  };

  const sim = (a: string, b: string): number => {
    const normA = norm(a);
    const normB = norm(b);
    if (!normA || !normB) return 0;
    if (normA === normB) return 1.0;
    if (normA.includes(normB) || normB.includes(normA)) return 0.8;
    return 0.3;
  };

  const scoreMatch = (pj: PJ, pf: PF): number => {
    let sc = 0;
    const dEmail = domain(pf.email || '');
    const genericDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'uol.com.br', 'terra.com.br'];
    
    if (dEmail && pj.dominio && dEmail === pj.dominio && !genericDomains.includes(dEmail)) {
      sc += 60;
    }

    const s1 = sim(pf.empresa_hint || '', pj.razao);
    const s2 = sim(pf.empresa_hint || '', pj.fantasia || '');
    sc += 25 * Math.max(s1, s2);

    if ((pf.cargo || '').toLowerCase().match(/finan|fiscal|log|compr|compras|jur|legal|dpo|rh|comer/)) {
      sc += 10;
    }

    return Math.min(100, Math.round(sc));
  };

  // Initialize Mock Data
  const initMockData = () => {
    const mockPJs: PJ[] = [
      {
        id: 'pj1',
        cnpj: '12.345.678/0001-90',
        razao: 'Aurovel Logística e Transportes Ltda',
        fantasia: 'Aurovel',
        site: 'https://aurovel.com.br',
        dominio: 'aurovel.com.br',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      {
        id: 'pj2',
        cnpj: '98.765.432/0001-10',
        razao: 'Translog Brasil Transportes S.A.',
        fantasia: 'Translog',
        site: 'https://translog.com.br',
        dominio: 'translog.com.br',
        cidade: 'Rio de Janeiro',
        uf: 'RJ'
      },
      {
        id: 'pj3',
        cnpj: '11.222.333/0001-44',
        razao: 'Inovacorp Tecnologia Ltda',
        fantasia: 'InovaCorp',
        site: 'https://inovacorp.com.br',
        dominio: 'inovacorp.com.br',
        cidade: 'Belo Horizonte',
        uf: 'MG'
      }
    ];

    const mockPFs: PF[] = [
      {
        id: 'pf1',
        nome: 'Ana Carolina Silva',
        email: 'ana.silva@aurovel.com.br',
        tel: '(11) 99999-1234',
        empresa_hint: 'Aurovel',
        cargo: 'Financeiro'
      },
      {
        id: 'pf2',
        nome: 'Roberto Santos Lima',
        email: 'roberto@translog.com.br',
        tel: '(21) 98888-5678',
        empresa_hint: 'Translog Brasil',
        cargo: 'Comercial'
      },
      {
        id: 'pf3',
        nome: 'Maria José Oliveira',
        email: 'maria.oliveira@gmail.com',
        tel: '(11) 97777-9012',
        empresa_hint: 'Aurovel Logística',
        cargo: 'Fiscal'
      },
      {
        id: 'pf4',
        nome: 'João Pedro Costa',
        email: 'joao@inovacorp.com.br',
        tel: '(31) 96666-3456',
        empresa_hint: 'InovaCorp',
        cargo: 'Jurídico'
      },
      {
        id: 'pf5',
        nome: 'Fernanda Rodrigues',
        email: 'fernanda.rodrigues@outlook.com',
        tel: '(11) 95555-7890',
        empresa_hint: 'Transportes Aurovel',
        cargo: 'Compras'
      },
      {
        id: 'pf6',
        nome: 'Carlos Eduardo Almeida',
        email: 'carlos@translog.com.br',
        tel: '(21) 94444-1122',
        empresa_hint: 'Translog',
        cargo: 'Logística'
      }
    ];

    const mockLinks: LinksMap = {
      'pj1': [
        { pfId: 'pf1', role: 'Financeiro', primary: true, notes: 'Contato principal para cobrança e questões financeiras' }
      ],
      'pj2': [
        { pfId: 'pf2', role: 'Comercial', primary: true, notes: 'Responsável por novos negócios' },
        { pfId: 'pf6', role: 'Logística', primary: false, notes: 'Coordenação operacional' }
      ]
    };

    setPJs(mockPJs);
    setPFs(mockPFs);
    setLinks(mockLinks);
  };

  useEffect(() => {
    initMockData();
  }, []);

  // Filter functions
  const getFilteredPJs = () => {
    return PJs.filter(pj => {
      const search = norm(searchPJ);
      return norm(pj.razao).includes(search) ||
             norm(pj.fantasia || '').includes(search) ||
             norm(pj.cnpj).includes(search) ||
             norm(pj.dominio || '').includes(search);
    });
  };

  const getFilteredPFs = () => {
    return PFs.filter(pf => {
      const search = norm(searchPF);
      return norm(pf.nome).includes(search) ||
             norm(pf.email || '').includes(search) ||
             norm(pf.tel || '').includes(search);
    });
  };

  const getSuggestions = () => {
    if (!selectedPJId) return [];
    
    const pj = PJs.find(p => p.id === selectedPJId);
    if (!pj) return [];

    const currentLinks = Links[selectedPJId] || [];
    const linkedPFIds = currentLinks.map(l => l.pfId);
    
    return PFs
      .filter(pf => !linkedPFIds.includes(pf.id))
      .map(pf => ({
        ...pf,
        score: scoreMatch(pj, pf)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  };

  const getLinkedContacts = () => {
    if (!selectedPJId) return [];
    
    const currentLinks = Links[selectedPJId] || [];
    return currentLinks.map(link => {
      const pf = PFs.find(p => p.id === link.pfId);
      return { ...link, pf };
    }).filter(item => item.pf);
  };

  // Actions
  const selectPJ = (pjId: string) => {
    setSelectedPJId(pjId);
  };

  const linkPF = (pfId: string, role: string, primary: boolean) => {
    if (!selectedPJId) return;

    const newLinks = { ...Links };
    if (!newLinks[selectedPJId]) {
      newLinks[selectedPJId] = [];
    }

    // If setting as primary, unset others
    if (primary) {
      newLinks[selectedPJId] = newLinks[selectedPJId].map(link => ({
        ...link,
        primary: false
      }));
    }

    // Add new link
    newLinks[selectedPJId].push({
      pfId,
      role,
      primary,
      notes: ''
    });

    setLinks(newLinks);
    
    const pf = PFs.find(p => p.id === pfId);
    toast({
      title: "Vínculo criado!",
      description: `${pf?.nome} vinculado como ${role}`,
    });
  };

  const unlinkPF = (pfId: string) => {
    if (!selectedPJId) return;

    const newLinks = { ...Links };
    newLinks[selectedPJId] = (newLinks[selectedPJId] || []).filter(link => link.pfId !== pfId);
    
    setLinks(newLinks);
    
    const pf = PFs.find(p => p.id === pfId);
    toast({
      title: "Vínculo removido!",
      description: `${pf?.nome} desvinculado`,
    });
  };

  const togglePrimary = (pfId: string) => {
    if (!selectedPJId) return;

    const newLinks = { ...Links };
    const currentLinks = newLinks[selectedPJId] || [];
    
    newLinks[selectedPJId] = currentLinks.map(link => ({
      ...link,
      primary: link.pfId === pfId ? !link.primary : false
    }));

    setLinks(newLinks);
  };

  const updateNotes = (pfId: string, notes: string) => {
    if (!selectedPJId) return;

    const newLinks = { ...Links };
    const linkIndex = (newLinks[selectedPJId] || []).findIndex(link => link.pfId === pfId);
    
    if (linkIndex >= 0) {
      newLinks[selectedPJId][linkIndex].notes = notes;
      setLinks(newLinks);
    }
  };

  const exportLinks = () => {
    const dataStr = JSON.stringify(Links, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vinculos_pj_pf.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportado!",
      description: "Vínculos exportados com sucesso",
    });
  };

  const selectedPJ = selectedPJId ? PJs.find(p => p.id === selectedPJId) : null;
  const filteredPJs = getFilteredPJs();
  const filteredPFs = getFilteredPFs();
  const suggestions = getSuggestions();
  const linkedContacts = getLinkedContacts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
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
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              Matching PJ × Contatos • CRM
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistema para relacionar Empresas (PJ) com Contatos (PF) usando algoritmo de matching inteligente
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Empresas (PJ)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="Buscar por razão, fantasia, CNPJ, domínio..."
                  value={searchPJ}
                  onChange={(e) => setSearchPJ(e.target.value)}
                  className="flex-1"
                />
                <Badge variant="secondary">{filteredPJs.length} empresas</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contatos (PF)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="Buscar por nome, e-mail, telefone..."
                  value={searchPF}
                  onChange={(e) => setSearchPF(e.target.value)}
                  className="flex-1"
                />
                <Badge variant="secondary">{filteredPFs.length} contatos</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Empresas (PJ)</CardTitle>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredPJs.length}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedPJId ? (Links[selectedPJId] || []).length : 0}
                  </div>
                  <div className="text-xs text-gray-500">Vínculos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{suggestions.length}</div>
                  <div className="text-xs text-gray-500">Sugestões</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPJs.map(pj => (
                  <div
                    key={pj.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPJId === pj.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => selectPJ(pj.id)}
                  >
                    <div className="font-semibold">{pj.fantasia || pj.razao}</div>
                    {pj.fantasia && <div className="text-sm text-gray-600">{pj.razao}</div>}
                    <div className="text-xs text-gray-500 mt-2">
                      <div>CNPJ: {pj.cnpj}</div>
                      {pj.cidade && pj.uf && <div>{pj.cidade} - {pj.uf}</div>}
                      {pj.dominio && <div>🌐 {pj.dominio}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Column 2: Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedPJ ? `Sugestões para: ${selectedPJ.fantasia || selectedPJ.razao}` : 'Sugestões de Contatos'}
              </CardTitle>
              <CardDescription>
                Critérios: domínio do e-mail (~60), referência à empresa (até 25), cargo (~10)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedPJId ? (
                <div className="text-center text-gray-500 py-8">
                  Selecione uma empresa para ver sugestões
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">🎯 Sugestões Automáticas</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {suggestions.map(pf => (
                        <SuggestionCard
                          key={pf.id}
                          pf={pf}
                          score={pf.score}
                          onLink={linkPF}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">🔍 Todos os Contatos</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {filteredPFs
                        .filter(pf => !suggestions.find(s => s.id === pf.id))
                        .map(pf => (
                          <SuggestionCard
                            key={pf.id}
                            pf={pf}
                            score={0}
                            onLink={linkPF}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Column 3: Linked Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedPJ ? `Contatos de ${selectedPJ.fantasia || selectedPJ.razao}` : 'Contatos Vinculados'}
              </CardTitle>
              <CardDescription>
                {selectedPJ ? 'Gerencie os vínculos da empresa' : 'Selecione uma empresa para ver os vínculos'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedPJId ? (
                <div className="text-center text-gray-500 py-8">
                  Selecione uma empresa para ver os vínculos
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {linkedContacts.map(item => (
                      <LinkedContactCard
                        key={item.pfId}
                        link={item}
                        pf={item.pf!}
                        onUnlink={unlinkPF}
                        onTogglePrimary={togglePrimary}
                        onUpdateNotes={updateNotes}
                      />
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">📄 Exportar/Importar</h4>
                    <Textarea
                      value={JSON.stringify(selectedPJId ? { [selectedPJId]: Links[selectedPJId] || [] } : {}, null, 2)}
                      readOnly
                      className="h-20 text-xs font-mono mb-3"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={exportLinks}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface SuggestionCardProps {
  pf: PF & { score?: number };
  score: number;
  onLink: (pfId: string, role: string, primary: boolean) => void;
}

function SuggestionCard({ pf, score, onLink }: SuggestionCardProps) {
  const [selectedRole, setSelectedRole] = useState(pf.cargo || roleOptions[0]);
  const [isPrimary, setIsPrimary] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{pf.nome}</div>
          {pf.cargo && <div className="text-sm text-gray-600">{pf.cargo}</div>}
          <div className="text-xs text-gray-500">
            {pf.email && <div>📧 {pf.email}</div>}
            {pf.tel && <div>📱 {pf.tel}</div>}
            {pf.empresa_hint && <div>🏢 {pf.empresa_hint}</div>}
          </div>
        </div>
        {score > 0 && (
          <Badge className={getScoreColor(score)}>
            Score: {score}
          </Badge>
        )}
      </div>
      
      <div className="flex gap-2 items-center">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
          />
          Principal
        </label>
        
        <Button size="sm" onClick={() => onLink(pf.id, selectedRole, isPrimary)}>
          <Link className="w-3 h-3 mr-1" />
          Vincular
        </Button>
      </div>
    </div>
  );
}

interface LinkedContactCardProps {
  link: Link;
  pf: PF;
  onUnlink: (pfId: string) => void;
  onTogglePrimary: (pfId: string) => void;
  onUpdateNotes: (pfId: string, notes: string) => void;
}

function LinkedContactCard({ link, pf, onUnlink, onTogglePrimary, onUpdateNotes }: LinkedContactCardProps) {
  return (
    <div className={`border rounded-lg p-3 ${link.primary ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}>
      {link.primary && (
        <Badge className="absolute top-2 right-2 bg-green-600">
          Principal
        </Badge>
      )}
      
      <div className="font-medium">{pf.nome}</div>
      <Badge variant="outline" className="text-xs mt-1">
        {link.role}
      </Badge>
      
      <div className="text-xs text-gray-500 mt-2">
        {pf.email && <div>📧 {pf.email}</div>}
        {pf.tel && <div>📱 {pf.tel}</div>}
      </div>
      
      <Textarea
        placeholder="Notas sobre o contato..."
        value={link.notes || ''}
        onChange={(e) => onUpdateNotes(link.pfId, e.target.value)}
        className="text-xs mt-2 min-h-[60px]"
      />
      
      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          variant={link.primary ? "outline" : "default"}
          onClick={() => onTogglePrimary(link.pfId)}
        >
          <Star className="w-3 h-3 mr-1" />
          {link.primary ? 'Remover Principal' : 'Tornar Principal'}
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onUnlink(link.pfId)}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Excluir
        </Button>
      </div>
    </div>
  );
}