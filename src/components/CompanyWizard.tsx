import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { CompanyData } from '../types/company';
// Mock data removed - using empty initial state

// Import wizard steps
import IdentificationStep from './wizard-contas-contatos/IdentificationStep';
import AddressesStep from './wizard-contas-contatos/AddressesStep';
import ContactsStep from './wizard-contas-contatos/ContactsStep';
import CorporateStructureStep from './wizard-contas-contatos/CorporateStructureStep';
import FinancialStep from './wizard-contas-contatos/FinancialStep';
import BankingStep from './wizard-contas-contatos/BankingStep';
import OperationsStep from './wizard-contas-contatos/OperationsStep';
import LicensesStep from './wizard-contas-contatos/LicensesStep';
import ComplianceStep from './wizard-contas-contatos/ComplianceStep';
import DocumentsStep from './wizard-contas-contatos/DocumentsStep';
import ReviewStep from './wizard-contas-contatos/ReviewStep';

interface CompanyWizardProps {
  onComplete: (data: CompanyData) => void;
  onCancel: () => void;
  initialData?: CompanyData;
}

const steps = [
  { id: 1, title: 'Identificação', description: 'Dados básicos da empresa' },
  { id: 2, title: 'Endereços', description: 'Endereços comercial, cobrança e entrega' },
  { id: 3, title: 'Contatos', description: 'Informações de contato' },
  { id: 4, title: 'Estrutura Societária', description: 'Sócios e administradores' },
  { id: 5, title: 'Financeiro', description: 'Dados financeiros' },
  { id: 6, title: 'Bancário', description: 'Contas bancárias' },
  { id: 7, title: 'Operação', description: 'Frota e atividades' },
  { id: 8, title: 'Licenças & Seguros', description: 'Documentação operacional' },
  { id: 9, title: 'Compliance & LGPD', description: 'Conformidade e privacidade' },
  { id: 10, title: 'Documentos', description: 'Anexos e arquivos' },
  { id: 11, title: 'Revisão & Envio', description: 'Validação final' }
];

export default function CompanyWizard({ onComplete, onCancel, initialData }: CompanyWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CompanyData>>(initialData || {});

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMockData = () => {
    // Mock data removed - function disabled
    console.log('Mock data feature removed');
  };

  const handleDataChange = (stepData: Partial<CompanyData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleComplete = () => {
    onComplete(formData as CompanyData);
  };

  const renderStep = () => {
    const stepProps = {
      data: formData,
      onDataChange: handleDataChange,
      onNext: handleNext,
      onPrevious: handlePrevious
    };

    switch (currentStep) {
      case 1:
        return <IdentificationStep {...stepProps} />;
      case 2:
        return <AddressesStep {...stepProps} />;
      case 3:
        return <ContactsStep {...stepProps} />;
      case 4:
        return <CorporateStructureStep {...stepProps} />;
      case 5:
        return <FinancialStep {...stepProps} />;
      case 6:
        return <BankingStep {...stepProps} />;
      case 7:
        return <OperationsStep {...stepProps} />;
      case 8:
        return <LicensesStep {...stepProps} />;
      case 9:
        return <ComplianceStep {...stepProps} />;
      case 10:
        return <DocumentsStep {...stepProps} />;
      case 11:
        return <ReviewStep {...stepProps} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cadastro de Empresa</h1>
              <p className="text-gray-600 mt-1">Preencha os dados da empresa seguindo o wizard</p>
            </div>
            <Button
              onClick={handleMockData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Mock Completo
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Etapa {currentStep} de {steps.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <Badge
                key={step.id}
                variant={step.id === currentStep ? "default" : step.id < currentStep ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setCurrentStep(step.id)}
              >
                {step.id}. {step.title}
              </Badge>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {currentStep}
              </span>
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStep()}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <div className="text-sm text-gray-500">
              {currentStep} / {steps.length}
            </div>
            
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex items-center gap-2"
              >
                Concluir Cadastro
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}