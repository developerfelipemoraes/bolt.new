import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search, Edit, Eye, Trash2, Mail, Phone, MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { apiService } from '@/services/companyService';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth';
import { PermissionGuard } from '@/components/ui/permission-guard';

interface Contact {
  _id: string;
  personalInfo: {
    fullName: string;
    cpf: string;
    rg?: string;
    birthDate: string;
    gender?: string;
    maritalStatus: string;
    nationality?: string;
  };
  contact: {
    email: string;
    phone: string;
    mobile?: string;
  };
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  professional?: {
    occupation?: string;
    company?: string;
    monthlyIncome?: number;
    workPhone?: string;
  };
  financial?: {
    creditScore?: number;
    bankAccount?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ContactListProps {
  onBack: () => void;
  onEdit: (contact: Contact) => void;
  onView: (contact: Contact) => void;
  onNew: () => void;
}

export default function ContactListReal({ onBack, onEdit, onView, onNew }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      
      setLoading(true);
      
      const response = await apiService.getContacts();
      
      console.log('Contatos carregados:', response);

      setContacts(Array.isArray(response) ? (response as unknown as Contact[]) : []);

    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      toast.error('Erro de conexão - Verifique se o servidor backend está rodando em http://localhost:3001');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para normalizar string (remover acentos e converter para minúsculas)
  const normalize = (str: string): string => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar contatos com base no termo de busca
  const filteredContacts = (contacts || []).filter(contact => {
    const searchNorm = normalize(searchTerm);
    return (
      normalize(contact.personalInfo?.fullName || '').includes(searchNorm) ||
      normalize(contact.contact?.email || '').includes(searchNorm) ||
      normalize(contact.personalInfo?.cpf || '').includes(searchNorm) ||
      normalize(contact.contact?.phone || '').includes(searchNorm) ||
      normalize(contact.professional?.company || '').includes(searchNorm) ||
      normalize(contact.professional?.occupation || '').includes(searchNorm) ||
      normalize(contact.address?.city || '').includes(searchNorm)
    );
  });

  // Calcular score KYC (simulado)
  const calculateKYCScore = (contact: Contact): number => {
    let score = 0;

    // Dados pessoais (peso 25%)
    const pessoaisFields = [
      contact.personalInfo?.fullName,
      contact.personalInfo?.cpf,
      contact.personalInfo?.rg,
      contact.contact?.email,
      contact.contact?.phone,
      contact.personalInfo?.birthDate
    ];
    const pessoaisCompletos = pessoaisFields.filter(Boolean).length;
    score += (pessoaisCompletos / pessoaisFields.length) * 25;

    // Endereço (peso 15%)
    const enderecoFields = [
      contact.address?.zipCode,
      contact.address?.street,
      contact.address?.city,
      contact.address?.state
    ];
    const enderecoCompletos = enderecoFields.filter(Boolean).length;
    score += (enderecoCompletos / enderecoFields.length) * 15;

    // Profissional (peso 30%)
    const profissionalFields = [
      contact.professional?.company,
      contact.professional?.occupation,
      contact.professional?.monthlyIncome,
      contact.professional?.workPhone
    ];
    const profissionalCompletos = profissionalFields.filter(Boolean).length;
    score += (profissionalCompletos / profissionalFields.length) * 30;

    // Financeiro (peso 30%)
    const financeiroFields = [
      contact.financial?.creditScore,
      contact.financial?.bankAccount
    ];
    const financeiroCompletos = financeiroFields.filter(Boolean).length;
    score += (financeiroCompletos / financeiroFields.length) * 30;

    return Math.round(score);
  };

  // Função para obter cor do score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  // Função para remover contato
  const handleDelete = async (contactId: string) => {
    if (!hasPermission('contacts', 'delete')) {
      toast.error('Você não tem permissão para excluir contatos');
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir este contato?')) {
      return;
    }

    try {
      const response = await apiService.deleteContact(contactId);
      
      if (response.Error) {
        toast.error('Erro ao excluir contato');
      } else {
        toast.success('Contato excluído com sucesso');
        loadContacts(); // Recarregar lista
      }
    } catch (error) {
      toast.error('Erro inesperado ao excluir contato');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando contatos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Contatos</h1>
              <p className="text-gray-600">
                {filteredContacts.length} contatos encontrados
              </p>
            </div>
          </div>
          <PermissionGuard resource="contacts" action="create" showFallback={false}>
            <Button onClick={onNew} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contato
            </Button>
          </PermissionGuard>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, CPF, e-mail, empresa, cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{filteredContacts.length}</div>
                <div className="text-sm text-gray-500">contatos encontrados</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{contacts.length}</div>
                <div className="text-sm text-gray-500">total no sistema</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Score Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(filteredContacts.reduce((acc, contact) => 
                    acc + calculateKYCScore(contact), 0) / filteredContacts.length || 0)}
                </div>
                <div className="text-sm text-gray-500">KYC score</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhum contato encontrado' : 'Nenhum contato cadastrado'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca.' 
                  : 'Comece criando seu primeiro contato no sistema.'
                }
              </p>
              {!searchTerm && (
                <PermissionGuard resource="contacts" action="create" showFallback={false}>
                  <Button onClick={onNew} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Contato
                  </Button>
                </PermissionGuard>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => {
              const kycScore = calculateKYCScore(contact);
              
              return (
                <Card key={contact._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {contact.personalInfo?.fullName || 'Nome não informado'}
                        </CardTitle>
                        {contact.professional?.company && (
                          <CardDescription className="text-sm">
                            {contact.professional?.occupation} - {contact.professional?.company}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={`${getScoreColor(kycScore)} font-semibold`}>
                        KYC: {kycScore}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* CPF */}
                    {contact.personalInfo?.cpf && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">CPF:</span>
                        <span>{contact.personalInfo.cpf}</span>
                      </div>
                    )}

                    {/* E-mail */}
                    {contact.contact?.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {contact.contact.email}
                        </span>
                      </div>
                    )}

                    {/* Telefone */}
                    {contact.contact?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{contact.contact.phone}</span>
                      </div>
                    )}

                    {/* Localização */}
                    {contact.address?.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{contact.address.city} - {contact.address.state}</span>
                      </div>
                    )}

                    {/* Empresa */}
                    {contact.professional?.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span>{contact.professional.company}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => onView(contact)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <PermissionGuard resource="contacts" action="update" showFallback={false}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => onEdit(contact)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </PermissionGuard>
                      <PermissionGuard resource="contacts" action="delete" showFallback={false}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}