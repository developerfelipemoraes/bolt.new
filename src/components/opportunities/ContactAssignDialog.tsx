import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { mockContactService, ContactSearchResult } from '@/services/mockContactService';
import { Search, Loader2, User, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ContactAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSelected: (contactId: string, contactData: ContactSearchResult) => void;
}

export function ContactAssignDialog({
  open,
  onOpenChange,
  onContactSelected
}: ContactAssignDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ContactSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setSearched(true);
      const data = await mockContactService.search(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (contact: ContactSearchResult) => {
    onContactSelected(contact.contact_id, contact);
  };

  const handleCreateContact = async () => {
    if (!newContactName.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      setCreating(true);
      const response = await mockContactService.create({
        full_name: newContactName,
        email: newContactEmail,
        phone_number: newContactPhone
      });

      const newContact = await mockContactService.getById(response.contact_id);
      if (newContact) {
        onContactSelected(response.contact_id, newContact);
      }

      toast.success('Contato criado com sucesso');
    } catch (error) {
      toast.error('Erro ao criar contato');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Buscar ou Criar Contato</DialogTitle>
          <DialogDescription>
            Pesquise na base de contatos existente ou crie um novo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite nome, email, telefone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showCreateForm ? 'Cancelar Criação' : 'Criar Novo Contato'}
          </Button>

          {showCreateForm && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newName">Nome Completo *</Label>
                  <Input
                    id="newName"
                    value={newContactName}
                    onChange={e => setNewContactName(e.target.value)}
                    placeholder="Nome do contato"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newEmail">Email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newContactEmail}
                    onChange={e => setNewContactEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPhone">Telefone</Label>
                  <Input
                    id="newPhone"
                    value={newContactPhone}
                    onChange={e => setNewContactPhone(e.target.value)}
                    placeholder="+55 (11) 98765-4321"
                  />
                </div>

                <Button
                  onClick={handleCreateContact}
                  disabled={creating}
                  className="w-full"
                >
                  {creating ? 'Criando...' : 'Criar e Vincular Contato'}
                </Button>
              </CardContent>
            </Card>
          )}

          <Separator />

          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searched
                  ? 'Nenhum contato encontrado'
                  : 'Digite algo e clique em buscar para ver os resultados'}
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(contact => (
                  <Card
                    key={contact.contact_id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleSelect(contact)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold">{contact.full_name}</h4>
                          {contact.email && (
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                          )}
                          {contact.phone_number && (
                            <p className="text-sm text-muted-foreground">
                              {contact.phone_number}
                            </p>
                          )}
                          {contact.company && (
                            <Badge variant="secondary" className="mt-2">
                              {contact.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
