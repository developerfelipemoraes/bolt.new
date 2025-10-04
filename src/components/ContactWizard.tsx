import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Target, Save, Trash2, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ContactData } from '../types/contact';
// Mock data removed - using empty initial state

// Import wizard steps
import PersonalDataStep from './contact-wizard/PersonalDataStep';
import DocumentsStep from './contact-wizard/DocumentsStep';
import AddressStep from './contact-wizard/AddressStep';
import ProfessionalStep from './contact-wizard/ProfessionalStep';
import CorrespondenceStep from './contact-wizard/CorrespondenceStep';
import FinancialStep from './contact-wizard/FinancialStep';
import BankingStep from './contact-wizard/BankingStep';
import ComplianceStep from './contact-wizard/ComplianceStep';
import ReviewStep from './contact-wizard/ReviewStep';

interface ContactWizardProps {
  onComplete: (data: ContactData) => void;
  onCancel: () => void;
  initialData?: ContactData;
}

const steps = [
  { id: 1, title: 'Dados Pessoais', description: 'Informações básicas e familiares' },
  { id: 2, title: 'Documentos', description: 'Documentação de identidade' },
  { id: 3, title: 'Endereço Residencial', description: 'Dados de contato e endereço' },
  { id: 4, title: 'Dados Profissionais', description: 'Informações de trabalho' },
  { id: 5, title: 'Correspondência', description: 'Preferência de contato' },
  { id: 6, title: 'Situação Financeira', description: 'Renda e patrimônio' },
  { id: 7, title: 'Bancário', description: 'Contas e referências bancárias' },
  { id: 8, title: 'Compliance', description: 'Declarações e KYC' },
  { id: 9, title: 'Revisão & Envio', description: 'Validação final' }
];

const STORAGE_KEY = 'wizard_pf_full';

export default function ContactWizard({ onComplete, onCancel, initialData }: ContactWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ContactData>>(initialData || {});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // If editing existing data, use it; otherwise try to load draft
    if (initialData) {
      setFormData(initialData);
      return;
    }

    // Load draft from localStorage only if not editing
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        toast.success('Rascunho carregado automaticamente');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [initialData]);

  useEffect(() => {
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    setFormData({});
    saveDraft({});
    toast.success('Dados mock carregados com sucesso');
  };

  const handleDataChange = (stepData: Partial<ContactData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    saveDraft(updatedData);
  };

  const saveDraft = (data: Partial<ContactData>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    toast.success('Rascunho salvo automaticamente');
  };

  const handleSaveDraft = () => {
    saveDraft(formData);
    toast.success('Rascunho salvo com sucesso');
  };

  const handleClearForm = () => {
    setFormData({});
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(1);
    toast.success('Formulário limpo');
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contato_pf.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Dados exportados com sucesso');
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setFormData(importedData);
          saveDraft(importedData);
          toast.success('Dados importados com sucesso');
        } catch (error) {
          toast.error('Erro ao importar arquivo JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleComplete = () => {
    // Clear draft and complete
    localStorage.removeItem(STORAGE_KEY);
    onComplete(formData as ContactData);
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
        return <PersonalDataStep {...stepProps} />;
      case 2:
        return <DocumentsStep {...stepProps} />;
      case 3:
        return <AddressStep {...stepProps} />;
      case 4:
        return <ProfessionalStep {...stepProps} />;
      case 5:
        return <CorrespondenceStep {...stepProps} />;
      case 6:
        return <FinancialStep {...stepProps} />;
      case 7:
        return <BankingStep {...stepProps} />;
      case 8:
        return <ComplianceStep {...stepProps} />;
      case 9:
        return <ReviewStep {...stepProps} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen py-8 transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Cadastro de Pessoa Física
              </h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Preencha os dados do contato seguindo o wizard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsDarkMode(!isDarkMode)}
                variant="outline"
                size="sm"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </Button>
              <Button onClick={onCancel} variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Etapa {currentStep} de {steps.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={handleMockData} size="sm" variant="outline" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Mock Dados
            </Button>
            <Button onClick={handleSaveDraft} size="sm" variant="outline" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Rascunho
            </Button>
            <Button onClick={handleClearForm} size="sm" variant="outline" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Limpar
            </Button>
            <Button onClick={handleExportJSON} size="sm" variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar JSON
            </Button>
            <label className="inline-flex">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
              <Button size="sm" variant="outline" className="flex items-center gap-2" as="span">
                <Upload className="w-4 h-4" />
                Importar JSON
              </Button>
            </label>
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
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
              <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {currentStep}
              </span>
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
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
            
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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