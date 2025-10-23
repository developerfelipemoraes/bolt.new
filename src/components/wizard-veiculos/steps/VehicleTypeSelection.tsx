import { VehicleType } from '@/types/vehicle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { vehicleTypes } from '@/data/vehicleCategories';
import { Check } from 'lucide-react';

interface VehicleTypeSelectionProps {
  selectedType?: VehicleType;
  onTypeSelect: (type: VehicleType) => void;
}

export const VehicleTypeSelection: React.FC<VehicleTypeSelectionProps> = ({
  selectedType,
  onTypeSelect
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Tipo de Veículo</h3>
        <p className="text-muted-foreground">
          Selecione o tipo do veículo que deseja cadastrar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicleTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType?.id === type.id
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onTypeSelect(type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{type.icon}</span>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                </div>
                {selectedType?.id === type.id && (
                  <Check className="h-6 w-6 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {type.categories?.length || 0} {type.categories?.length === 1 ? 'categoria' : 'categorias'} disponíveis
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedType && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{selectedType.icon}</span>
              {selectedType.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Categorias disponíveis:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedType.categories?.map((category) => (
                <div
                  key={category.id}
                  className="px-3 py-1 bg-white rounded-full text-sm border"
                >
                  {category.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
