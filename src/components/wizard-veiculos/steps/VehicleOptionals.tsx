import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleOptionals as VehicleOptionalsType } from '../../../types/vehicle';

interface VehicleOptionalsProps {
  data: VehicleOptionalsType;
  onChange: (data: VehicleOptionalsType) => void;
}

export const VehicleOptionals: React.FC<VehicleOptionalsProps> = ({ data, onChange }) => {
  const handleSwitchChange = (field: keyof VehicleOptionalsType, value: boolean) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleSelectChange = (field: keyof VehicleOptionalsType, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const optionalGroups = [
    {
      title: 'Conforto',
      icon: '🛋️',
      items: [
        { key: 'airConditioning', label: 'Ar-condicionado', type: 'switch' },
        { key: 'legSupport', label: 'Apoio de perna', type: 'switch' },
        { key: 'curtain', label: 'Cortina', type: 'switch' }
      ]
    },
    {
      title: 'Tecnologia',
      icon: '📱',
      items: [
        { key: 'usb', label: 'USB', type: 'switch' },
        { key: 'soundSystem', label: 'Sistema de som', type: 'switch' },
        { key: 'monitor', label: 'Monitor', type: 'switch' },
        { key: 'wifi', label: 'Wi-Fi', type: 'switch' }
      ]
    },
    {
      title: 'Estrutura',
      icon: '🏗️',
      items: [
        { key: 'packageHolder', label: 'Porta-pacote', type: 'switch' },
        { key: 'bathroom', label: 'Banheiro', type: 'switch' },
        { key: 'cabin', label: 'Cabine', type: 'switch' },
        { key: 'coffeeMaker', label: 'Cafeteira', type: 'switch' }
      ]
    },
    {
      title: 'Segurança',
      icon: '🛡️',
      items: [
        { key: 'accessibility', label: 'Acessibilidade', type: 'switch' },
        { key: 'factoryRetarder', label: 'Freio Retarder de Fábrica', type: 'switch' },
        { key: 'optionalRetarder', label: 'Freio Retarder Opcional', type: 'switch' }
      ]
    }
  ];

  const countActiveOptionals = () => {
    return Object.values(data).filter(value => value === true).length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Opcionais do Veículo</h3>
        <p className="text-gray-600">Marque os opcionais e equipamentos presentes no veículo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {optionalGroups.map((group) => (
          <Card key={group.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{group.icon}</span>
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <Label htmlFor={item.key} className="cursor-pointer">
                    {item.label}
                  </Label>
                  <Switch
                    id={item.key}
                    checked={data[item.key as keyof VehicleOptionalsType] as boolean}
                    onCheckedChange={(checked) => 
                      handleSwitchChange(item.key as keyof VehicleOptionalsType, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tipo de Vidro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🪟</span>
            Tipo de Vidro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="glassType">Tipo de Vidro</Label>
            <Select
              value={data.glasType}
              onValueChange={(value) => handleSelectChange('glasType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de vidro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="glued">Vidro Colado</SelectItem>
                <SelectItem value="tilting">Vidro Basculante</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Opcionais */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">Resumo dos Opcionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(data).map(([key, value]) => {
              if (value === true) {
                const item = optionalGroups
                  .flatMap(group => group.items)
                  .find(item => item.key === key);
                
                return (
                  <div key={key} className="bg-green-100 px-3 py-1 rounded-full text-sm text-green-800">
                    ✓ {item?.label || key}
                  </div>
                );
              }
              return null;
            })}
            
            {data.glasType && (
              <div className="bg-green-100 px-3 py-1 rounded-full text-sm text-green-800">
                ✓ {data.glasType === 'glued' ? 'Vidro Colado' : 'Vidro Basculante'}
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-green-200">
            <span className="text-lg font-semibold text-green-800">
              Total de opcionais selecionados: {countActiveOptionals()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};