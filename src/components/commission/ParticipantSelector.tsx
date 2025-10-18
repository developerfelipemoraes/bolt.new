import { useState, useEffect } from 'react';
import { Search, Building2, User, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CommissionParticipant, ParticipantRole, PARTICIPANT_ROLE_LABELS } from '@/types/commission';
import { ContactDialog } from './ContactDialog';

interface ParticipantSelectorProps {
  participants: CommissionParticipant[];
  onChange: (participants: CommissionParticipant[]) => void;
}

interface SearchResult {
  id: string;
  name: string;
  type: 'company' | 'contact';
  document: string;
  phone?: string;
  email?: string;
}

export function ParticipantSelector({ participants, onChange }: ParticipantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const totalPercent = participants.reduce((sum, p) => sum + p.percent, 0);
  const isValidTotal = Math.abs(totalPercent - 100) < 0.01;

  useEffect(() => {
    if (searchTerm.length >= 2) {
      performSearch(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const performSearch = async (term: string) => {
    const searchLower = term.toLowerCase();

    const mockResults: SearchResult[] = [
      { id: 'comp_1', name: 'Aurovel Transportes', type: 'company', document: '12.345.678/0001-90', email: 'contato@aurovel.com', phone: '(11) 98765-4321' },
      { id: 'cont_1', name: 'Carlos Corretor', type: 'contact', document: '123.456.789-00', email: 'carlos@email.com', phone: '(11) 99999-8888' },
      { id: 'cont_2', name: 'Ana Indicadora', type: 'contact', document: '987.654.321-00', email: 'ana@email.com', phone: '(21) 98888-7777' }
    ];

    const filtered = mockResults.filter(r =>
      r.name.toLowerCase().includes(searchLower) ||
      r.document.includes(term) ||
      r.email?.toLowerCase().includes(searchLower) ||
      r.phone?.includes(term)
    );

    setResults(filtered);
  };

  const handleAddParticipant = (result: SearchResult) => {
    const exists = participants.some(p =>
      (p.companyId === result.id && result.type === 'company') ||
      (p.contactId === result.id && result.type === 'contact')
    );

    if (exists) {
      alert('Este participante já foi adicionado');
      return;
    }

    const newParticipant: CommissionParticipant = {
      id: `part_${Date.now()}`,
      name: result.name,
      role: result.name.toLowerCase().includes('aurovel') ? 'Aurovel' : 'Corretor',
      percent: 0,
      ...(result.type === 'company' ? { companyId: result.id } : { contactId: result.id }),
      commission_gross: 0,
      tax: 0,
      commission_net: 0
    };

    onChange([...participants, newParticipant]);
    setOpen(false);
    setSearchTerm('');
    setResults([]);
  };

  const handleCreateNew = () => {
    setOpen(false);
    setCreateDialogOpen(true);
  };

  const handleSaveNew = (contact: SearchResult) => {
    handleAddParticipant(contact);
    setCreateDialogOpen(false);
  };

  const handleRemoveParticipant = (id: string) => {
    onChange(participants.filter(p => p.id !== id));
  };

  const handleUpdateParticipant = (id: string, field: keyof CommissionParticipant, value: string | number) => {
    onChange(
      participants.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const highlightTerm = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Participantes da Comissão</Label>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Participante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Participante</DialogTitle>
              <DialogDescription>
                Busque por nome, CNPJ/CPF, email ou telefone nas Contas ou Contatos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Buscar em Contas e Contatos</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite nome, CNPJ/CPF, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {searchTerm.length >= 2 && (
                <div className="space-y-2">
                  {results.length > 0 ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {results.length} resultado(s) encontrado(s)
                      </p>
                      {results.map((result) => (
                        <Card
                          key={result.id}
                          className="p-3 hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => handleAddParticipant(result)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              {result.type === 'company' ? (
                                <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                              ) : (
                                <User className="h-5 w-5 text-green-600 mt-0.5" />
                              )}
                              <div>
                                <p className="font-medium">{highlightTerm(result.name)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {highlightTerm(result.document)}
                                </p>
                                {result.email && (
                                  <p className="text-xs text-muted-foreground">
                                    {highlightTerm(result.email)}
                                  </p>
                                )}
                                {result.phone && (
                                  <p className="text-xs text-muted-foreground">
                                    {highlightTerm(result.phone)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge variant="secondary">Adicionar</Badge>
                          </div>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Nenhum resultado encontrado
                      </p>
                      <Button variant="outline" size="sm" onClick={handleCreateNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        Cadastrar Novo Contato
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {searchTerm.length < 2 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Digite ao menos 2 caracteres para buscar
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!isValidTotal && participants.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            A soma dos percentuais deve ser 100%. Atual: {totalPercent.toFixed(2)}%
          </AlertDescription>
        </Alert>
      )}

      {participants.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>Nenhum participante adicionado</p>
          <p className="text-sm mt-1">Clique em "Adicionar Participante" para começar</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {participants.map((participant, index) => (
            <Card key={participant.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {participant.companyId ? (
                      <Building2 className="h-4 w-4 text-blue-600" />
                    ) : (
                      <User className="h-4 w-4 text-green-600" />
                    )}
                    <h4 className="font-medium text-sm">
                      {participant.name}
                      {participant.role === 'Aurovel' && (
                        <Badge variant="default" className="ml-2">Aurovel</Badge>
                      )}
                    </h4>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveParticipant(participant.id)}
                    disabled={participant.role === 'Aurovel' && participants.filter(p => p.role === 'Aurovel').length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`role_${participant.id}`}>Função</Label>
                    <Select
                      value={participant.role}
                      onValueChange={(value: ParticipantRole) =>
                        handleUpdateParticipant(participant.id, 'role', value)
                      }
                    >
                      <SelectTrigger id={`role_${participant.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PARTICIPANT_ROLE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`percent_${participant.id}`}>Percentual (%)</Label>
                    <Input
                      id={`percent_${participant.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={participant.percent}
                      onChange={(e) =>
                        handleUpdateParticipant(participant.id, 'percent', parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {participants.length > 0 && (
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="font-medium">Total:</span>
          <span className={`text-lg font-bold ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
            {totalPercent.toFixed(2)}%
          </span>
        </div>
      )}

      <ContactDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleSaveNew}
      />
    </div>
  );
}
