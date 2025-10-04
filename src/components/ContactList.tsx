import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, ArrowLeft, Plus, Search, Edit, Eye, Trash2, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
// Mock data removed - using empty initial state
import { ContactData } from '@/types/contact';

interface ContactListProps {
  onBack: () => void;
  onEdit: (contact: ContactData) => void;
  onView: (contact: ContactData) => void;
  onNew: () => void;
}

export default function ContactList({ onBack, onEdit, onView, onNew }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<ContactData[]>([
    {},
    {
      ...{},
      id: '2',
      dadosPessoais: {
        ...{}.dadosPessoais,
        nomeCompleto: 'Maria Silva Santos',
        cpf: '987.654.321-00',
        email: 'maria.santos@email.com'
      },
      endereco: {
        ...{}.endereco,
        cep: '22071-001',
        logradouro: 'Av. Copacabana, 1256',
        cidade: 'Rio de Janeiro',
        uf: 'RJ'
      },
      profissional: {
        ...{}.profissional,
        empresa: 'Translog Brasil S.A.',
        cargo: 'Gerente Comercial',
        telefoneComercial: '(21) 3333-4444'
      }
    },
    {
      ...{},
      id: '3',
      dadosPessoais: {
        ...{}.dadosPessoais,
        nomeCompleto: 'Carlos Eduardo Oliveira',
        cpf: '456.789.123-44',
        email: 'carlos.oliveira@gmail.com'
      },
      endereco: {
        ...{}.endereco,
        cep: '30130-000',
        logradouro: 'Rua dos Carijós, 789',
        cidade: 'Belo Horizonte',
        uf: 'MG'
      },
      profissional: {
        ...{}.profissional,
        empresa: 'InovaCorp Tecnologia',
        cargo: 'Diretor Financeiro',
        telefoneComercial: '(31) 2222-3333'
      }
    }
  ]);

  // Função para normalizar string (remover acentos e converter para minúsculas)
  const normalize = (str: string): string => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar contatos com base no termo de busca
  const filteredContacts = contacts.filter(contact => {
    const searchNorm = normalize(searchTerm);
    return (
      normalize(contact.dadosPessoais?.nomeCompleto || '').includes(searchNorm) ||
      normalize(contact.dadosPessoais?.email || '').includes(searchNorm) ||
      normalize(contact.dadosPessoais?.cpf || '').includes(searchNorm) ||
      normalize(contact.dadosPessoais?.telefone || '').includes(searchNorm) ||
      normalize(contact.profissional?.empresa || '').includes(searchNorm) ||
      normalize(contact.profissional?.cargo || '').includes(searchNorm) ||
      normalize(contact.endereco?.cidade || '').includes(searchNorm)
    );
  });

  // Calcular score KYC (simulado)
  const calculateKYCScore = (contact: ContactData): number => {
    let score = 0;

    // Dados pessoais (peso 25%)
    const pessoaisFields = [
      contact.dadosPessoais?.nomeCompleto,
      contact.dadosPessoais?.cpf,
      contact.dadosPessoais?.rg,
      contact.dadosPessoais?.email,
      contact.dadosPessoais?.telefone,
      contact.dadosPessoais?.dataNascimento
    ];
    const pessoaisCompletos = pessoaisFields.filter(Boolean).length;
    score += (pessoaisCompletos / pessoaisFields.length) * 25;

    // Documentos (peso 20%)
    const documentosFields = [
      contact.documentos?.rg,
      contact.documentos?.cpf,
      contact.documentos?.cnh,
      contact.documentos?.tituloEleitor
    ];
    const documentosCompletos = documentosFields.filter(Boolean).length;
    score += (documentosCompletos / documentosFields.length) * 20;

    // Endereço (peso 15%)
    const enderecoFields = [
      contact.endereco?.cep,
      contact.endereco?.logradouro,
      contact.endereco?.cidade,
      contact.endereco?.uf
    ];
    const enderecoCompletos = enderecoFields.filter(Boolean).length;
    score += (enderecoCompletos / enderecoFields.length) * 15;

    // Profissional (peso 20%)
    const profissionalFields = [
      contact.profissional?.empresa,
      contact.profissional?.cargo,
      contact.profissional?.salario,
      contact.profissional?.telefoneComercial
    ];
    const profissionalCompletos = profissionalFields.filter(Boolean).length;
    score += (profissionalCompletos / profissionalFields.length) * 20;

    // Financeiro (peso 20%)
    const financeiroFields = [
      contact.financeiro?.rendaMensal,
      contact.financeiro?.patrimonioTotal,
      contact.bancario?.banco,
      contact.bancario?.agencia,
      contact.bancario?.conta
    ];
    const financeiroCompletos = financeiroFields.filter(Boolean).length;
    score += (financeiroCompletos / financeiroFields.length) * 20;

    return Math.round(score);
  };

  // Função para obter cor do score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  // Função para remover contato
  const handleDelete = (contactId: string) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      setContacts(contacts.filter(c => c.id !== contactId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
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
              <h1 className="text-4xl font-bold text-green-600 mb-2">
                Consulta de Contatos (PF)
              </h1>
              <p className="text-gray-600">
                Gerencie e consulte todos os contatos cadastrados no sistema
              </p>
            </div>
            
            <Button onClick={onNew} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contato
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Contatos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Pesquisar por nome, CPF, e-mail, empresa, cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

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
              <CardTitle className="text-center">Score Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(filteredContacts.reduce((acc, contact) => acc + calculateKYCScore(contact), 0) / filteredContacts.length || 0)}
                </div>
                <div className="text-sm text-gray-500">KYC score</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => {
            const kycScore = calculateKYCScore(contact);
            
            return (
              <Card key={contact.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {contact.dadosPessoais?.nomeCompleto}
                      </CardTitle>
                      {contact.profissional?.empresa && (
                        <CardDescription className="text-sm">
                          {contact.profissional?.cargo} - {contact.profissional?.empresa}
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
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">CPF:</span>
                    <span>{contact.dadosPessoais?.cpf}</span>
                  </div>

                  {/* E-mail */}
                  {contact.dadosPessoais?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {contact.dadosPessoais?.email}
                      </span>
                    </div>
                  )}

                  {/* Telefone */}
                  {contact.dadosPessoais?.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{contact.dadosPessoais?.telefone}</span>
                    </div>
                  )}

                  {/* Localização */}
                  {contact.endereco?.cidade && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{contact.endereco?.cidade} - {contact.endereco?.uf}</span>
                    </div>
                  )}

                  {/* Empresa */}
                  {contact.profissional?.empresa && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{contact.profissional?.empresa}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onView(contact)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onEdit(contact)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              Nenhum contato encontrado
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando seu primeiro contato'}
            </p>
            <Button onClick={onNew} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Contato
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}