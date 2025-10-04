import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { User, Search, Filter, Edit, Trash2, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { ContactData } from './ContactWizardComponent';

interface ContactListProps {
  contacts?: ContactData[];
  onEdit?: (contact: ContactData) => void;
  onDelete?: (contactId: string) => void;
  className?: string;
}

export const ContactListComponent: React.FC<ContactListProps> = ({
  contacts = [],
  onEdit,
  onDelete,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.cargo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterState === '' || contact.estado === filterState;
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (contactId: string, contactName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o contato "${contactName}"?`)) {
      if (onDelete) {
        onDelete(contactId);
      }
      toast.success('Contato excluído com sucesso!');
    }
  };

  const states = [...new Set(contacts.map(c => c.estado).filter(Boolean))].sort();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Lista de Contatos ({contacts.length})
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, empresa ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Todos os estados</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {contacts.length === 0 ? 'Nenhum contato cadastrado' : 'Nenhum contato encontrado'}
            </h3>
            <p className="text-muted-foreground">
              {contacts.length === 0 
                ? 'Comece cadastrando seu primeiro contato'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{contact.nome}</h3>
                        {contact.cargo && (
                          <Badge variant="secondary">{contact.cargo}</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {contact.email}
                        </div>
                        
                        {contact.celular && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {contact.celular}
                          </div>
                        )}
                        
                        {contact.empresa && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {contact.empresa}
                          </div>
                        )}
                        
                        {(contact.cidade || contact.estado) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {[contact.cidade, contact.estado].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedContact(contact)}
                          >
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Contato</DialogTitle>
                          </DialogHeader>
                          {selectedContact && (
                            <div className="space-y-6">
                              {/* Dados Pessoais */}
                              <div>
                                <h4 className="font-semibold mb-3 border-b pb-2">Dados Pessoais</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Nome:</span>
                                    <p>{selectedContact.nome}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">CPF:</span>
                                    <p>{selectedContact.cpf}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Contato */}
                              <div>
                                <h4 className="font-semibold mb-3 border-b pb-2">Contato</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Email:</span>
                                    <p>{selectedContact.email}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Celular:</span>
                                    <p>{selectedContact.celular}</p>
                                  </div>
                                  {selectedContact.telefone && (
                                    <div>
                                      <span className="font-medium">Telefone:</span>
                                      <p>{selectedContact.telefone}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Endereço */}
                              <div>
                                <h4 className="font-semibold mb-3 border-b pb-2">Endereço</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">CEP:</span>
                                    <p>{selectedContact.cep}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Cidade:</span>
                                    <p>{selectedContact.cidade}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Estado:</span>
                                    <p>{selectedContact.estado}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium">Endereço:</span>
                                    <p>{selectedContact.endereco}, {selectedContact.numero}</p>
                                    {selectedContact.complemento && <p>{selectedContact.complemento}</p>}
                                    {selectedContact.bairro && <p>{selectedContact.bairro}</p>}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Dados Profissionais */}
                              {(selectedContact.cargo || selectedContact.empresa || selectedContact.departamento) && (
                                <div>
                                  <h4 className="font-semibold mb-3 border-b pb-2">Dados Profissionais</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {selectedContact.cargo && (
                                      <div>
                                        <span className="font-medium">Cargo:</span>
                                        <p>{selectedContact.cargo}</p>
                                      </div>
                                    )}
                                    {selectedContact.departamento && (
                                      <div>
                                        <span className="font-medium">Departamento:</span>
                                        <p>{selectedContact.departamento}</p>
                                      </div>
                                    )}
                                    {selectedContact.empresa && (
                                      <div className="col-span-2">
                                        <span className="font-medium">Empresa:</span>
                                        <p>{selectedContact.empresa}</p>
                                      </div>
                                    )}
                                    {selectedContact.linkedin && (
                                      <div className="col-span-2">
                                        <span className="font-medium">LinkedIn:</span>
                                        <p>{selectedContact.linkedin}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Observações */}
                              {selectedContact.observacoes && (
                                <div>
                                  <h4 className="font-semibold mb-3 border-b pb-2">Observações</h4>
                                  <p className="text-sm">{selectedContact.observacoes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(contact)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contact.id!, contact.nome)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactListComponent;