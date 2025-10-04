import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Building2, Phone, MapPin, TrendingUp, FileText } from 'lucide-react';

export interface CompanyData {
  id?: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  email: string;
  telefone: string;
  celular: string;
  website: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  segmento: string;
  porte: string;
  faturamento: string;
  numeroFuncionarios: string;
  observacoes: string;
}

interface CompanyWizardProps {
  onSubmit?: (company: CompanyData) => void;
  onCancel?: () => void;
  initialData?: Partial<CompanyData>;
  className?: string;
}

export const CompanyWizardComponent: React.FC<CompanyWizardProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  className = ""
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompanyData>({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    email: '',
    telefone: '',
    celular: '',
    website: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    segmento: '',
    porte: '',
    faturamento: '',
    numeroFuncionarios: '',
    observacoes: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<CompanyData>>({});

  const steps = [
    { id: 1, title: 'Dados da Empresa', icon: Building2 },
    { id: 2, title: 'Contato', icon: Phone },
    { id: 3, title: 'Endereço', icon: MapPin },
    { id: 4, title: 'Dados Comerciais', icon: TrendingUp },
    { id: 5, title: 'Observações', icon: FileText }
  ];

  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) return false;
    
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    const checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (checkDigit1 !== parseInt(cleanCNPJ.charAt(12))) return false;
    
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    const checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return checkDigit2 === parseInt(cleanCNPJ.charAt(13));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCEP = (cep: string): boolean => {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
  };

  const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    let formattedValue = value;

    if (field === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (field === 'cep') {
      formattedValue = formatCEP(value);
    } else if (field === 'telefone' || field === 'celular') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CompanyData> = {};

    switch (step) {
      case 1: // Dados da Empresa
        if (!formData.razaoSocial.trim()) newErrors.razaoSocial = 'Razão Social é obrigatória';
        if (!formData.nomeFantasia.trim()) newErrors.nomeFantasia = 'Nome Fantasia é obrigatório';
        if (!formData.cnpj.trim()) {
          newErrors.cnpj = 'CNPJ é obrigatório';
        } else if (!validateCNPJ(formData.cnpj)) {
          newErrors.cnpj = 'CNPJ inválido';
        }
        break;
      
      case 2: // Contato
        if (!formData.email.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Email inválido';
        }
        if (!formData.telefone.trim() && !formData.celular.trim()) {
          newErrors.telefone = 'Pelo menos um telefone é obrigatório';
        }
        break;
      
      case 3: // Endereço
        if (!formData.cep.trim()) {
          newErrors.cep = 'CEP é obrigatório';
        } else if (!validateCEP(formData.cep)) {
          newErrors.cep = 'CEP inválido';
        }
        if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
        if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
        if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error('Por favor, corrija os erros antes de continuar');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        toast.success('Empresa cadastrada com sucesso!');
      }
    } else {
      toast.error('Por favor, corrija os erros no formulário');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Dados da Empresa
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input
                id="razaoSocial"
                value={formData.razaoSocial}
                onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                className={errors.razaoSocial ? 'border-red-500' : ''}
              />
              {errors.razaoSocial && <span className="text-red-500 text-sm">{errors.razaoSocial}</span>}
            </div>
            <div>
              <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
              <Input
                id="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
                className={errors.nomeFantasia ? 'border-red-500' : ''}
              />
              {errors.nomeFantasia && <span className="text-red-500 text-sm">{errors.nomeFantasia}</span>}
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                placeholder="00.000.000/0000-00"
                className={errors.cnpj ? 'border-red-500' : ''}
              />
              {errors.cnpj && <span className="text-red-500 text-sm">{errors.cnpj}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  value={formData.inscricaoMunicipal}
                  onChange={(e) => handleInputChange('inscricaoMunicipal', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Contato
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.empresa.com.br"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefone">Telefone {!formData.celular && '*'}</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 1234-5678"
                  className={errors.telefone ? 'border-red-500' : ''}
                />
                {errors.telefone && <span className="text-red-500 text-sm">{errors.telefone}</span>}
              </div>
              <div>
                <Label htmlFor="celular">Celular {!formData.telefone && '*'}</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) => handleInputChange('celular', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Endereço
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  placeholder="00000-000"
                  className={errors.cep ? 'border-red-500' : ''}
                />
                {errors.cep && <span className="text-red-500 text-sm">{errors.cep}</span>}
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className={errors.endereco ? 'border-red-500' : ''}
              />
              {errors.endereco && <span className="text-red-500 text-sm">{errors.endereco}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => handleInputChange('complemento', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className={errors.cidade ? 'border-red-500' : ''}
                />
                {errors.cidade && <span className="text-red-500 text-sm">{errors.cidade}</span>}
              </div>
            </div>
            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger className={errors.estado ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && <span className="text-red-500 text-sm">{errors.estado}</span>}
            </div>
          </div>
        );

      case 4: // Dados Comerciais
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="segmento">Segmento</Label>
                <Select value={formData.segmento} onValueChange={(value) => handleInputChange('segmento', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="varejo">Varejo</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="industria">Indústria</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="construcao">Construção</SelectItem>
                    <SelectItem value="alimenticio">Alimentício</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="porte">Porte da Empresa</Label>
                <Select value={formData.porte} onValueChange={(value) => handleInputChange('porte', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o porte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mei">MEI</SelectItem>
                    <SelectItem value="micro">Microempresa</SelectItem>
                    <SelectItem value="pequena">Pequena</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="faturamento">Faturamento Anual</Label>
                <Select value={formData.faturamento} onValueChange={(value) => handleInputChange('faturamento', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a faixa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ate-81k">Até R$ 81.000</SelectItem>
                    <SelectItem value="81k-360k">R$ 81.001 a R$ 360.000</SelectItem>
                    <SelectItem value="360k-4.8m">R$ 360.001 a R$ 4.800.000</SelectItem>
                    <SelectItem value="4.8m-300m">R$ 4.800.001 a R$ 300.000.000</SelectItem>
                    <SelectItem value="acima-300m">Acima de R$ 300.000.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numeroFuncionarios">Número de Funcionários</Label>
                <Select value={formData.numeroFuncionarios} onValueChange={(value) => handleInputChange('numeroFuncionarios', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a faixa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 funcionário</SelectItem>
                    <SelectItem value="2-9">2 a 9 funcionários</SelectItem>
                    <SelectItem value="10-49">10 a 49 funcionários</SelectItem>
                    <SelectItem value="50-99">50 a 99 funcionários</SelectItem>
                    <SelectItem value="100-499">100 a 499 funcionários</SelectItem>
                    <SelectItem value="500+">500+ funcionários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5: // Observações
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                rows={5}
                placeholder="Informações adicionais sobre a empresa..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Cadastro de Empresa
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Etapa {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Indicators */}
        <div className="flex justify-between items-center">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-1 ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-50'
                      : isCompleted
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit}>
                Finalizar Cadastro
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyWizardComponent;