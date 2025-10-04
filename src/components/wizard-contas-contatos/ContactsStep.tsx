import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { CompanyData, KeyContact, AccountingOffice } from '../../types/company';

interface ContactsStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function ContactsStep({ data, onDataChange }: ContactsStepProps) {
  const handleInputChange = (field: keyof CompanyData, value: string) => {
    onDataChange({ [field]: value });
  };

  const handleKeyContactChange = (index: number, field: keyof KeyContact, value: string) => {
    const contacts = [...(data.keyContacts || [])];
    contacts[index] = { ...contacts[index], [field]: value };
    onDataChange({ keyContacts: contacts });
  };

  const addKeyContact = () => {
    const newContact: KeyContact = {
      name: '',
      email: '',
      phone: '',
      role: 'commercial'
    };
    onDataChange({ keyContacts: [...(data.keyContacts || []), newContact] });
  };

  const removeKeyContact = (index: number) => {
    const contacts = [...(data.keyContacts || [])];
    contacts.splice(index, 1);
    onDataChange({ keyContacts: contacts });
  };

  const handleAccountingChange = (field: keyof AccountingOffice | 'contactName' | 'contactEmail' | 'contactPhone', value: string) => {
    const accounting = data.accountingOffice || { companyName: '', crc: '', contact: { name: '', email: '', phone: '' } };
    
    if (field === 'contactName') {
      accounting.contact.name = value;
    } else if (field === 'contactEmail') {
      accounting.contact.email = value;
    } else if (field === 'contactPhone') {
      accounting.contact.phone = value;
    } else if (field === 'companyName') {
      accounting.companyName = value;
    } else if (field === 'crc') {
      accounting.crc = value;
    }
    
    onDataChange({ accountingOffice: accounting });
  };

  return (
    <div className="space-y-6">
      {/* Main Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Contatos Principais</CardTitle>
          <CardDescription>Informações de contato da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>E-mail Principal *</Label>
              <Input
                type="email"
                value={data.primaryEmail || ''}
                onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                placeholder="contato@empresa.com.br"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone *</Label>
              <Input
                value={data.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 1234-5678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={data.whatsapp || ''}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={data.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="www.empresa.com.br"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Redes Sociais</Label>
              <Input
                value={data.socialMedia || ''}
                onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                placeholder="@empresa_oficial"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contatos-chave</span>
            <Button onClick={addKeyContact} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>Responsáveis por áreas específicas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.keyContacts?.map((contact, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Contato {index + 1}</h4>
                <Button
                  onClick={() => removeKeyContact(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => handleKeyContactChange(index, 'name', e.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Área</Label>
                  <Select
                    value={contact.role}
                    onValueChange={(value: 'fiscal' | 'financial' | 'logistics' | 'commercial') => 
                      handleKeyContactChange(index, 'role', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiscal">Fiscal</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="logistics">Logística</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleKeyContactChange(index, 'email', e.target.value)}
                    placeholder="contato@empresa.com.br"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => handleKeyContactChange(index, 'phone', e.target.value)}
                    placeholder="(11) 1234-5678"
                  />
                </div>
              </div>
            </div>
          )) || <p className="text-gray-500 text-center py-4">Nenhum contato adicionado</p>}
        </CardContent>
      </Card>

      {/* Accounting Office */}
      <Card>
        <CardHeader>
          <CardTitle>Escritório de Contabilidade</CardTitle>
          <CardDescription>Informações do contador responsável</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Razão Social</Label>
              <Input
                value={data.accountingOffice?.companyName || ''}
                onChange={(e) => handleAccountingChange('companyName', e.target.value)}
                placeholder="Nome do escritório"
              />
            </div>

            <div className="space-y-2">
              <Label>CRC</Label>
              <Input
                value={data.accountingOffice?.crc || ''}
                onChange={(e) => handleAccountingChange('crc', e.target.value)}
                placeholder="CRC-SP 123456/O-1"
              />
            </div>

            <div className="space-y-2">
              <Label>Nome do Contato</Label>
              <Input
                value={data.accountingOffice?.contact?.name || ''}
                onChange={(e) => handleAccountingChange('contactName', e.target.value)}
                placeholder="Nome do contador"
              />
            </div>

            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={data.accountingOffice?.contact?.email || ''}
                onChange={(e) => handleAccountingChange('contactEmail', e.target.value)}
                placeholder="contador@escritorio.com.br"
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={data.accountingOffice?.contact?.phone || ''}
                onChange={(e) => handleAccountingChange('contactPhone', e.target.value)}
                placeholder="(11) 1234-5678"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}