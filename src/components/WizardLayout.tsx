import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Save, ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  children: React.ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  showSaveDraft?: boolean;
}

const stepTitles = [
  'Seleção de Categoria',
  'Informações de Montagem',
  'Categoria e Subcategoria',
  'Dados do Veículo',
  'Identificação do Produto',
  'Upload de Mídia',
  'Informações Secundárias',
  'Definição de Poltronas',
  'Opcionais do Veículo',
  'Descrição do Produto',
  'Localização do Produto'
];

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  totalSteps,
  children,
  onPrevious,
  onNext,
  onSaveDraft,
  isNextDisabled = false,
  isPreviousDisabled = false,
  showSaveDraft = true
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Cadastro de Veículo
            </h1>
            <Badge variant="outline" className="text-sm">
              Etapa {currentStep + 1} de {totalSteps}
            </Badge>
          </div>
          
          <Progress value={progress} className="mb-2" />
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{stepTitles[currentStep]}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {stepTitles[currentStep]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {children}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {showSaveDraft && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Rascunho
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isPreviousDisabled}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <Button
              onClick={onNext}
              disabled={isNextDisabled}
              className="flex items-center gap-2"
            >
              {currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};