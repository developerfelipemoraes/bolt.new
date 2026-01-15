import React, { useState, useEffect } from 'react';
import { ChassisModelComplete } from '@/types/vehicleModels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YearEntriesEditor } from './YearEntriesEditor';
import { calculateYearRangesFromEntries, validateProductionYears } from '@/utils/yearRangeCalculator';
import { toast } from 'sonner';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { YearEntry } from '@/types/vehicleModels';
import { useChassisCompleteDetail } from '../../hooks/useChassisModels';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ChassisModelCompleteFormProps {
  chassisId?: string;
  onSave: (data: ChassisModelComplete) => Promise<void>;
  onCancel: () => void;
}

export const ChassisModelCompleteForm: React.FC<ChassisModelCompleteFormProps> = ({
  chassisId,
  onSave,
  onCancel
}) => {
  const { data: initialData, isLoading, error } = useChassisCompleteDetail(
    chassisId || '',
    !!chassisId
  );

  const [formData, setFormData] = useState<ChassisModelComplete>({
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

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Erro ao carregar dados do modelo: {error.message}
        </AlertDescription>
        <Button variant="outline" onClick={onCancel} className="mt-4">Voltar</Button>
      </Alert>
    );
  }

  const busTypes = [
    { id: 'highway', name: 'Rodoviário' },
    { id: 'urban', name: 'Urbano' },
    { id: 'school', name: 'Escolar' },
    { id: 'rural', name: 'Rural' }
  ];

  const busSegments: Record<string, Array<{id: string, name: string}>> = {
    'highway': [
      { id: 'highway-conventional', name: 'Convencional' },
      { id: 'double-deck', name: 'DD (Double Deck)' },
      { id: 'low-driver', name: 'LD (Low Driver)' },
      { id: 'midi-highway', name: 'Midi Rodoviário' },
      { id: 'micro-highway', name: 'Micro Rodoviário' }
    ],
    'urban': [
      { id: 'bi-articulated', name: 'Biarticulado' },
      { id: 'articulated', name: 'Articulado' },
      { id: 'padron', name: 'Padrão' },
      { id: 'midi-urban', name: 'Midi' },
      { id: 'basic', name: 'Básico' },
      { id: 'micro-urban', name: 'Micro' }
    ],
    'school': [
      { id: 'school-standard', name: 'Padrão' },
      { id: 'school-midi', name: 'Midi Escolar' },
      { id: 'school-micro', name: 'Micro Escolar' },
      { id: 'school-van', name: 'Van Escolar' }
    ],
    'rural': [
      { id: 'rural-standard', name: 'Padrão' },
      { id: 'rural-reinforced', name: 'Reforçado' },
      { id: 'rural-4x4', name: '4x4' }
    ]
  };

  const drivetrainOptions = ['4x2', '4x4', '6x2', '6x4', '6x6', '8x2', '8x4', '8x6', '8x8'];
  const axleCountOptions = [2, 3, 4, 5, 6];
  const enginePositionOptions = [
    { value: 'Dianteira', label: 'Dianteira' },
    { value: 'Central', label: 'Central' },
    { value: 'Traseira', label: 'Traseira' }
  ];

  const availableSegments = formData.type ? busSegments[formData.type] || [] : [];

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
            {chassisId ? 'Editar Modelo de Chassi' : 'Novo Modelo de Chassi'}
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
                <Select
                  value={formData.drivetrain || ''}
                  onValueChange={(value) => updateField('drivetrain', value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tração" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivetrainOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="axleCount">Número de Eixos</Label>
                <Select
                  value={formData.axleCount?.toString() || ''}
                  onValueChange={(value) => updateField('axleCount', value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o número de eixos" />
                  </SelectTrigger>
                  <SelectContent>
                    {axleCountOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option} eixos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type || ''}
                  onValueChange={(value) => {
                    updateField('type', value || null);
                    updateField('segment', null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {busTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="segment">Segmento</Label>
                <Select
                  value={formData.segment || ''}
                  onValueChange={(value) => updateField('segment', value || null)}
                  disabled={!formData.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.type ? "Selecione o segmento" : "Selecione primeiro o tipo"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  value={formData.enginePosition}
                  onValueChange={(value) => updateField('enginePosition', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição do motor" />
                  </SelectTrigger>
                  <SelectContent>
                    {enginePositionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
