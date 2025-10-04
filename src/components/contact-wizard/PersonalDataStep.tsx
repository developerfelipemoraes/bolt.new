import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactData, brazilianStates } from '../../types/contact';
import { validateCPF, formatCPF, calculateAge } from '../../utils/validators';

interface PersonalDataStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function PersonalDataStep({ data, onDataChange }: PersonalDataStepProps) {
  const handleInputChange = (field: string, value: string) => {
    const updatedPersonal = { ...data.personal, [field]: value };
    onDataChange({ personal: updatedPersonal });
  };

  const handleCpfChange = (value: string) => {
    const formattedCpf = formatCPF(value);
    handleInputChange('cpf', formattedCpf);
  };

  const handleSpouseCpfChange = (value: string) => {
    const formattedCpf = formatCPF(value);
    handleInputChange('spouseCpf', formattedCpf);
  };

  const handleGuardianCpfChange = (value: string) => {
    const formattedCpf = formatCPF(value);
    handleInputChange('guardianCpf', formattedCpf);
  };

  const isMinor = data.personal?.birthDate ? calculateAge(data.personal.birthDate) < 18 : false;
  const showSpouseFields = data.personal?.maritalStatus === 'Casado(a)' || data.personal?.maritalStatus === 'União estável';
  const cpfValid = data.personal?.cpf ? validateCPF(data.personal.cpf) : true;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="fullName">Nome Completo *</Label>
          <Input
            id="fullName"
            value={data.personal?.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={data.personal?.cpf || ''}
            onChange={(e) => handleCpfChange(e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            required
            className={!cpfValid ? 'border-red-500' : ''}
          />
          {!cpfValid && data.personal?.cpf && (
            <p className="text-sm text-red-500">CPF inválido</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de Nascimento *</Label>
          <Input
            id="birthDate"
            type="date"
            value={data.personal?.birthDate || ''}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            required
          />
          {data.personal?.birthDate && (
            <p className="text-sm text-gray-500">
              Idade: {calculateAge(data.personal.birthDate)} anos
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Sexo</Label>
          <Select
            value={data.personal?.gender || ''}
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nacionalidade</Label>
          <Input
            id="nationality"
            value={data.personal?.nationality || ''}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            placeholder="Ex: Brasileira"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthPlace">Naturalidade (Cidade)</Label>
          <Input
            id="birthPlace"
            value={data.personal?.birthPlace || ''}
            onChange={(e) => handleInputChange('birthPlace', e.target.value)}
            placeholder="Cidade de nascimento"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthState">UF da Naturalidade</Label>
          <Select
            value={data.personal?.birthState || ''}
            onValueChange={(value) => handleInputChange('birthState', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a UF" />
            </SelectTrigger>
            <SelectContent>
              {brazilianStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherName">Nome da Mãe</Label>
          <Input
            id="motherName"
            value={data.personal?.motherName || ''}
            onChange={(e) => handleInputChange('motherName', e.target.value)}
            placeholder="Nome completo da mãe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherName">Nome do Pai</Label>
          <Input
            id="fatherName"
            value={data.personal?.fatherName || ''}
            onChange={(e) => handleInputChange('fatherName', e.target.value)}
            placeholder="Nome completo do pai"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Estado Civil</Label>
          <Select
            value={data.personal?.maritalStatus || ''}
            onValueChange={(value) => handleInputChange('maritalStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
              <SelectItem value="Casado(a)">Casado(a)</SelectItem>
              <SelectItem value="União estável">União estável</SelectItem>
              <SelectItem value="Separado(a)">Separado(a)</SelectItem>
              <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
              <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Spouse Information */}
      {showSpouseFields && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="font-medium text-blue-900 mb-4">Dados do Cônjuge/Companheiro(a)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spouseName">Nome do Cônjuge/Companheiro(a)</Label>
              <Input
                id="spouseName"
                value={data.personal?.spouseName || ''}
                onChange={(e) => handleInputChange('spouseName', e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseCpf">CPF do Cônjuge/Companheiro(a)</Label>
              <Input
                id="spouseCpf"
                value={data.personal?.spouseCpf || ''}
                onChange={(e) => handleSpouseCpfChange(e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>
        </div>
      )}

      {/* Guardian Information */}
      {isMinor && (
        <div className="border rounded-lg p-4 bg-yellow-50">
          <h3 className="font-medium text-yellow-900 mb-4">Dados do Responsável/Tutor/Curador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">Nome do Responsável</Label>
              <Input
                id="guardianName"
                value={data.personal?.guardianName || ''}
                onChange={(e) => handleInputChange('guardianName', e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianCpf">CPF do Responsável</Label>
              <Input
                id="guardianCpf"
                value={data.personal?.guardianCpf || ''}
                onChange={(e) => handleGuardianCpfChange(e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}