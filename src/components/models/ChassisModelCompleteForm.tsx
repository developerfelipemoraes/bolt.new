import React, { useState, useEffect } from 'react';
import { ChassisModelComplete } from '@/types/vehicleModels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { YearEntriesEditor } from './YearEntriesEditor';
import { calculateYearRangesFromEntries, validateProductionYears } from '@/utils/yearRangeCalculator';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { YearEntry } from '@/types/vehicleModels';

interface ChassisModelCompleteFormProps {
  initialData?: ChassisModelComplete;
  onSave: (data: ChassisModelComplete) => Promise<void>;
  onCancel: () => void;
}

export const ChassisModelCompleteForm: React.FC<ChassisModelCompleteFormProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<ChassisModelComplete>(() => initialData || {
    chassisManufacturer: '',
    model: '',
    drivetrain: null,
    axleCount: null,
    type: null,
    segment: null,
    vehicleType: null,
    productionStart: null,
    manufactureYear: new Date().getFullYear(),
    modelYear: new Date().getFullYear(),
    productionEnd: null,
    enginePosition: '',
    emissionStandard: '',
    engineModel: '',
    engineType: '',
    maxPower: '',
    maxTorque: '',
    measurementStandard: '',
    fuel: '',
    emissionControl: '',
    crankshaftMainBearings: '',
    valveLocation: '',
    displacement: '',
    cylinderBore: '',
    pistonStroke: '',
    compressionRatio: '',
    specificConsumption: '',
    airCompressor: '',
    firingOrder: '',
    oilPumpType: '',
    airIntakeSystem: '',
    fuelSystem: '',
    lubricationSystem: '',
    coolingSystem: '',
    injectionPumpModel: '',
    injectorPumpType: '',
    injectionPumpGovernor: '',
    injectionSystem: '',
    injectionPressure: '',
    compressorModel: '',
    compressorCylinderBore: '',
    compressorPistonStroke: '',
    compressorDisplacement: '',
    compressorCylinderCount: '',
    compressorCooling: '',
    compressorDrive: '',
    compressorFlow: '',
    transmissionModel: '',
    transmissionActuation: '',
    synchronizedGears: '',
    transmissionSummary: '',
    gearRatiosDetailed: '',
    frontSuspensionType: '',
    frontShockAbsorbers: '',
    rearShockAbsorbersType: '',
    rearShockAbsorbers: '',
    intermediateSuspensionType: '',
    intermediateShockAbsorbers: '',
    intermediateStabilizerBar: '',
    kneelingSystem: '',
    wheelRims: '',
    optionalRims: '',
    tires: '',
    optionalTires: '',
    rearDualWheels: '',
    otherTires: '',
    frameType: '',
    frameRailsDimensions: '',
    sectionModulus: '',
    material: '',
    frameLubrication: '',
    frameArticulation: '',
    serviceBrakeType: '',
    serviceBrakeModel: '',
    totalFrictionArea: '',
    liningThickness: '',
    discDiameter: '',
    drumDiameter: '',
    frontLiningWidth: '',
    rearLiningWidth: '',
    brakeSystemPressure: '',
    parkingBrakeType: '',
    engineBrakeType: '',
    retarderType: '',
    additionalBrakeType: '',
    absType: '',
    yearEntries: [],
    yearRanges: [],
    yearRules: { sources: ['yearEntries'], logic: 'union->ranges; start=min(years); end=max(years); segments=contiguous' },
    sourceCount: 0,
    articulaoquadrochassi: null,
    categories: null,
    name: null
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof ChassisModelComplete>(
    field: K,
    value: ChassisModelComplete[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleYearEntriesChange = (newEntries: YearEntry[]) => {
    const result = calculateYearRangesFromEntries(newEntries);
    setFormData(prev => ({
      ...prev,
      yearEntries: result.yearEntries,
      yearRanges: result.yearRanges,
      yearRules: result.yearRules,
      sourceCount: result.sourceCount
    }));
  };

  const handleSave = async () => {
    if (!formData.chassisManufacturer.trim()) {
      toast.error('Fabricante do chassi é obrigatório');
      return;
    }

    if (!formData.model.trim()) {
      toast.error('Modelo é obrigatório');
      return;
    }

    if (formData.axleCount !== null && formData.axleCount < 1) {
      toast.error('Número de eixos deve ser maior que zero');
      return;
    }

    const productionYearsError = validateProductionYears(formData.productionStart, formData.productionEnd);
    if (productionYearsError) {
      toast.error(productionYearsError);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success('Modelo de chassi salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar modelo de chassi');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            {initialData ? 'Editar Modelo de Chassi' : 'Novo Modelo de Chassi'}
          </h2>
          <p className="text-muted-foreground">
            Editor completo com todas as especificações técnicas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="years">Anos</TabsTrigger>
          <TabsTrigger value="engine">Motor</TabsTrigger>
          <TabsTrigger value="transmission">Transmissão</TabsTrigger>
          <TabsTrigger value="suspension">Suspensão</TabsTrigger>
          <TabsTrigger value="wheels">Rodas/Pneus</TabsTrigger>
          <TabsTrigger value="frame">Chassis</TabsTrigger>
          <TabsTrigger value="brakes">Freios</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais do modelo de chassi</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {formData._id?.$oid && (
                <div className="col-span-2 p-3 bg-muted rounded-md">
                  <Label className="text-xs text-muted-foreground">ID do Documento (somente leitura)</Label>
                  <div className="font-mono text-sm mt-1">{formData._id.$oid}</div>
                </div>
              )}

              <div>
                <Label htmlFor="chassisManufacturer">Fabricante *</Label>
                <Input
                  id="chassisManufacturer"
                  value={formData.chassisManufacturer}
                  onChange={(e) => updateField('chassisManufacturer', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => updateField('model', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="drivetrain">Tração</Label>
                <Input
                  id="drivetrain"
                  value={formData.drivetrain || ''}
                  onChange={(e) => updateField('drivetrain', e.target.value || null)}
                  placeholder="Ex: 4x2, 6x4"
                />
              </div>

              <div>
                <Label htmlFor="axleCount">Número de Eixos</Label>
                <Input
                  id="axleCount"
                  type="number"
                  value={formData.axleCount || ''}
                  onChange={(e) => updateField('axleCount', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  value={formData.type || ''}
                  onChange={(e) => updateField('type', e.target.value || null)}
                />
              </div>

              <div>
                <Label htmlFor="segment">Segmento</Label>
                <Input
                  id="segment"
                  value={formData.segment || ''}
                  onChange={(e) => updateField('segment', e.target.value || null)}
                />
              </div>

              <div>
                <Label htmlFor="vehicleType">Tipo de Veículo</Label>
                <Input
                  id="vehicleType"
                  value={formData.vehicleType || ''}
                  onChange={(e) => updateField('vehicleType', e.target.value || null)}
                />
              </div>

              <div>
                <Label htmlFor="productionStart">Início de Produção</Label>
                <Input
                  id="productionStart"
                  type="number"
                  value={formData.productionStart || ''}
                  onChange={(e) => updateField('productionStart', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>

              <div>
                <Label htmlFor="productionEnd">Fim de Produção</Label>
                <Input
                  id="productionEnd"
                  type="number"
                  value={formData.productionEnd || ''}
                  onChange={(e) => updateField('productionEnd', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="years">
          <YearEntriesEditor
            yearEntries={formData.yearEntries}
            yearRanges={formData.yearRanges}
            productionStart={formData.productionStart}
            productionEnd={formData.productionEnd}
            onChange={handleYearEntriesChange}
          />
        </TabsContent>

        <TabsContent value="engine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Especificações do Motor</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="engineModel">Modelo do Motor</Label>
                <Input
                  id="engineModel"
                  value={formData.engineModel}
                  onChange={(e) => updateField('engineModel', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="engineType">Tipo do Motor</Label>
                <Input
                  id="engineType"
                  value={formData.engineType}
                  onChange={(e) => updateField('engineType', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="enginePosition">Posição do Motor</Label>
                <Input
                  id="enginePosition"
                  value={formData.enginePosition}
                  onChange={(e) => updateField('enginePosition', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="displacement">Cilindrada</Label>
                <Input
                  id="displacement"
                  value={formData.displacement}
                  onChange={(e) => updateField('displacement', e.target.value)}
                  placeholder="Ex: 3.870 cm³"
                />
              </div>

              <div>
                <Label htmlFor="maxPower">Potência Máxima</Label>
                <Input
                  id="maxPower"
                  value={formData.maxPower}
                  onChange={(e) => updateField('maxPower', e.target.value)}
                  placeholder="Ex: 90 cv (66,17 kW) @ 2800 rpm"
                />
              </div>

              <div>
                <Label htmlFor="maxTorque">Torque Máximo</Label>
                <Input
                  id="maxTorque"
                  value={formData.maxTorque}
                  onChange={(e) => updateField('maxTorque', e.target.value)}
                  placeholder="Ex: 275,6 Nm (28,1 mkgf) @ 1600 rpm"
                />
              </div>

              <div>
                <Label htmlFor="fuel">Combustível</Label>
                <Input
                  id="fuel"
                  value={formData.fuel}
                  onChange={(e) => updateField('fuel', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="compressionRatio">Taxa de Compressão</Label>
                <Input
                  id="compressionRatio"
                  value={formData.compressionRatio}
                  onChange={(e) => updateField('compressionRatio', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="injectionPressure">Sistema de Injeção</Label>
                <Input
                  id="injectionPressure"
                  value={formData.injectionPressure}
                  onChange={(e) => updateField('injectionPressure', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transmission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transmissão e Câmbio</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transmissionModel">Modelo da Transmissão</Label>
                <Input
                  id="transmissionModel"
                  value={formData.transmissionModel}
                  onChange={(e) => updateField('transmissionModel', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="transmissionActuation">Atuação</Label>
                <Input
                  id="transmissionActuation"
                  value={formData.transmissionActuation}
                  onChange={(e) => updateField('transmissionActuation', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="synchronizedGears">Marchas Sincronizadas</Label>
                <Input
                  id="synchronizedGears"
                  value={formData.synchronizedGears}
                  onChange={(e) => updateField('synchronizedGears', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="transmissionSummary">Resumo do Câmbio</Label>
                <Input
                  id="transmissionSummary"
                  value={formData.transmissionSummary}
                  onChange={(e) => updateField('transmissionSummary', e.target.value)}
                  placeholder="Ex: 5 à frente e 1 à ré"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="gearRatiosDetailed">Relações de Marchas Detalhadas</Label>
                <Textarea
                  id="gearRatiosDetailed"
                  value={formData.gearRatiosDetailed}
                  onChange={(e) => updateField('gearRatiosDetailed', e.target.value)}
                  rows={6}
                  placeholder="1ª - 6,331:1&#10;2ª - 3,603:1&#10;..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspension" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Suspensão</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frontSuspensionType">Tipo de Suspensão Dianteira</Label>
                <Input
                  id="frontSuspensionType"
                  value={formData.frontSuspensionType}
                  onChange={(e) => updateField('frontSuspensionType', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="frontShockAbsorbers">Amortecedores Dianteiros</Label>
                <Input
                  id="frontShockAbsorbers"
                  value={formData.frontShockAbsorbers}
                  onChange={(e) => updateField('frontShockAbsorbers', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="rearShockAbsorbersType">Tipo de Amortecedor Traseiro</Label>
                <Input
                  id="rearShockAbsorbersType"
                  value={formData.rearShockAbsorbersType}
                  onChange={(e) => updateField('rearShockAbsorbersType', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="rearShockAbsorbers">Suspensão Traseira</Label>
                <Input
                  id="rearShockAbsorbers"
                  value={formData.rearShockAbsorbers}
                  onChange={(e) => updateField('rearShockAbsorbers', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wheels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rodas e Pneus</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wheelRims">Rodas</Label>
                <Input
                  id="wheelRims"
                  value={formData.wheelRims}
                  onChange={(e) => updateField('wheelRims', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="optionalRims">Rodas Opcionais</Label>
                <Input
                  id="optionalRims"
                  value={formData.optionalRims}
                  onChange={(e) => updateField('optionalRims', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tires">Pneus</Label>
                <Input
                  id="tires"
                  value={formData.tires}
                  onChange={(e) => updateField('tires', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="optionalTires">Pneus Opcionais</Label>
                <Textarea
                  id="optionalTires"
                  value={formData.optionalTires}
                  onChange={(e) => updateField('optionalTires', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="rearDualWheels">Rodas Duplas Traseiras</Label>
                <Input
                  id="rearDualWheels"
                  value={formData.rearDualWheels}
                  onChange={(e) => updateField('rearDualWheels', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="otherTires">Outros Pneus</Label>
                <Input
                  id="otherTires"
                  value={formData.otherTires}
                  onChange={(e) => updateField('otherTires', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frame" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Chassi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frameType">Tipo de Chassi</Label>
                <Input
                  id="frameType"
                  value={formData.frameType}
                  onChange={(e) => updateField('frameType', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="frameRailsDimensions">Dimensões das Longarinas</Label>
                <Input
                  id="frameRailsDimensions"
                  value={formData.frameRailsDimensions}
                  onChange={(e) => updateField('frameRailsDimensions', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="sectionModulus">Módulo de Seção</Label>
                <Input
                  id="sectionModulus"
                  value={formData.sectionModulus}
                  onChange={(e) => updateField('sectionModulus', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => updateField('material', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brakes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Freios</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceBrakeType">Tipo de Freio de Serviço</Label>
                <Input
                  id="serviceBrakeType"
                  value={formData.serviceBrakeType}
                  onChange={(e) => updateField('serviceBrakeType', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="serviceBrakeModel">Modelo do Freio de Serviço</Label>
                <Textarea
                  id="serviceBrakeModel"
                  value={formData.serviceBrakeModel}
                  onChange={(e) => updateField('serviceBrakeModel', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="discDiameter">Diâmetro do Disco</Label>
                <Input
                  id="discDiameter"
                  value={formData.discDiameter}
                  onChange={(e) => updateField('discDiameter', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="drumDiameter">Diâmetro do Tambor</Label>
                <Input
                  id="drumDiameter"
                  value={formData.drumDiameter}
                  onChange={(e) => updateField('drumDiameter', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="parkingBrakeType">Freio de Estacionamento</Label>
                <Input
                  id="parkingBrakeType"
                  value={formData.parkingBrakeType}
                  onChange={(e) => updateField('parkingBrakeType', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="engineBrakeType">Freio Motor</Label>
                <Input
                  id="engineBrakeType"
                  value={formData.engineBrakeType}
                  onChange={(e) => updateField('engineBrakeType', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="retarderType">Retarder</Label>
                <Input
                  id="retarderType"
                  value={formData.retarderType}
                  onChange={(e) => updateField('retarderType', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="absType">ABS</Label>
                <Input
                  id="absType"
                  value={formData.absType}
                  onChange={(e) => updateField('absType', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
