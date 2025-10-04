import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SecondaryInfo as SecondaryInfoType } from '../../../types/vehicle';
import { fuelTypes } from '../../../data/vehicleCategories';

interface SecondaryInfoProps {
  data: SecondaryInfoType;
  onChange: (data: SecondaryInfoType) => void;
}

export const SecondaryInfo: React.FC<SecondaryInfoProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof SecondaryInfoType, value: string | number | boolean) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Informações Secundárias</h3>
        <p className="text-gray-600">Complete os dados técnicos e características do veículo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="capacity">Quantidade de Pessoas *</Label>
          <Input
            id="capacity"
            type="number"
            value={data.capacity}
            onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 1)}
            placeholder="Ex: 44"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condição do Veículo *</Label>
          <Select
            value={data.condition}
            onValueChange={(value) => handleChange('condition', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a condição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="semi-new">Seminovo</SelectItem>
              <SelectItem value="used">Usado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType">Tipo de Combustível *</Label>
          <Select
            value={data.fuelType}
            onValueChange={(value) => handleChange('fuelType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="steering">Direção *</Label>
          <Select
            value={data.steering}
            onValueChange={(value) => handleChange('steering', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de direção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assisted">Assistida</SelectItem>
              <SelectItem value="hydraulic">Hidráulica</SelectItem>
              <SelectItem value="mechanical">Mecânica</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="singleOwner">Único Dono</Label>
            <p className="text-sm text-gray-600">O veículo teve apenas um proprietário?</p>
          </div>
          <Switch
            id="singleOwner"
            checked={data.singleOwner}
            onCheckedChange={(checked) => handleChange('singleOwner', checked)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Veículo</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descreva as características, estado de conservação, histórico e outros detalhes importantes do veículo..."
          rows={6}
          maxLength={500}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Use este campo para destacar pontos importantes do veículo</span>
          <span>{data.description.length}/500</span>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Dicas para uma boa descrição:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Mencione o estado de conservação</li>
          <li>• Liste equipamentos e opcionais importantes</li>
          <li>• Informe sobre manutenções recentes</li>
          <li>• Destaque diferenciais do veículo</li>
          <li>• Seja honesto sobre possíveis defeitos</li>
        </ul>
      </div>
    </div>
  );
};