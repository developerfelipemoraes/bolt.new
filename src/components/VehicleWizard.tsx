import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { useVehicleWizard } from '../hooks/useVehicleWizard';
import { WizardLayout } from './wizard-veiculos/WizardLayout';
import { CategorySelection } from './wizard-veiculos/steps/CategorySelection';
import { ChassisInfo } from './wizard-veiculos/steps/ChassisInfo';
import { SubcategorySelection } from './wizard-veiculos/steps/SubcategorySelection';
import { VehicleData } from './wizard-veiculos/steps/VehicleData';
import { ProductIdentification } from './wizard-veiculos/steps/ProductIdentification';
import { MediaUpload } from './wizard-veiculos/steps/MediaUpload';
import { SecondaryInfo } from './wizard-veiculos/steps/SecondaryInfo';
import { SeatConfiguration } from './wizard-veiculos/steps/SeatConfiguration';
import { VehicleOptionals } from './wizard-veiculos/steps/VehicleOptionals';
import { ProductDescription } from './wizard-veiculos/steps/ProductDescription';
import { LocationInfo } from './wizard-veiculos/steps/LocationInfo';
import PricingMarginStep from './wizard-veiculos/steps/PricingMarginStep';
import { VehicleCategory, VehicleSubcategory } from '../types/vehicle';
import { PricingData } from '../types/salesOpportunity';
import { apiService } from '../services/vehicleService';
import { toast } from 'sonner';

interface VehicleWizardProps {
  onComplete?: (vehicleData: Vehicle) => void;
  onCancel?: () => void;
}

export const VehicleWizard: React.FC<VehicleWizardProps> = ({ onComplete, onCancel }) => {
  const { 
    currentStep, 
    vehicleData, 
    updateVehicleData, 
    nextStep, 
    prevStep, 
    saveDraft 
  } = useVehicleWizard();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategorySelect = (category: VehicleCategory) => {
    updateVehicleData({ category });
  };

  const handleSubcategorySelect = (subcategory: VehicleSubcategory) => {
    updateVehicleData({ subcategory });
  };

  const handleNext = async () => {
    // Validações por etapa
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === 11) { // Última etapa
      await handleSubmit();
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const handleSaveDraft = () => {
    saveDraft();
    toast.success('Rascunho salvo com sucesso!');
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Category Selection
        if (!vehicleData.category) {
          toast.error('Selecione uma categoria antes de continuar');
          return false;
        }
        return true;

      case 1: { // Chassis Info
        const chassisInfo = vehicleData.chassisInfo;
        if (!chassisInfo?.chassisManufacturer || !chassisInfo?.chassisModel || 
            !chassisInfo?.bodyManufacturer || !chassisInfo?.bodyModel) {
          toast.error('Preencha todas as informações de montagem');
          return false;
        }
        return true;
      }

      case 3: { // Pricing & Margin
        const pricing = vehicleData.pricing;
        if (!pricing?.valor_venda_final || pricing.valor_venda_final <= 0) {
          toast.error('Defina um valor de venda válido');
          return false;
        }
        if (!pricing?.percentual_comissao_vendedor || pricing.percentual_comissao_vendedor < 0) {
          toast.error('Defina o percentual de comissão');
          return false;
        }
        return true;
      }

      case 4: { // Vehicle Data
        const vehicleDataInfo = vehicleData.vehicleData;
        if (!vehicleDataInfo?.licensePlate || !vehicleDataInfo?.renavam || !vehicleDataInfo?.chassis) {
          toast.error('Preencha os dados obrigatórios do veículo');
          return false;
        }
        return true;
      }

      case 5: // Product Identification
        if (!vehicleData.productIdentification?.title) {
          toast.error('Defina um título para o produto');
          return false;
        }
        return true;

      case 7: { // Secondary Info
        const secondaryInfo = vehicleData.secondaryInfo;
        if (!secondaryInfo?.capacity || !secondaryInfo?.condition || !secondaryInfo?.fuelType) {
          toast.error('Preencha as informações secundárias obrigatórias');
          return false;
        }
        return true;
      }

      case 11: { // Location
        const location = vehicleData.location;
        if (!location?.address || !location?.city || !location?.state || !location?.zipCode) {
          toast.error('Preencha todas as informações de localização');
          return false;
        }
        return true;
      }

      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Aqui seria feita a integração com a API
      const completeVehicleData = {
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Salvar no localStorage para demonstração
      const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
      
      existingVehicles.push(completeVehicleData);

      // Chamar API para salvar o veículo
      await apiService.createVehicle(completeVehicleData as Vehicle);

      localStorage.setItem('vehicles', JSON.stringify(existingVehicles));

      toast.success('Veículo cadastrado com sucesso!');

      onComplete?.(completeVehicleData as Vehicle);

    } catch (error) 
    {
      toast.error('Erro ao salvar o veículo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CategorySelection
            selectedCategory={vehicleData.category}
            onCategorySelect={handleCategorySelect}
            onConfirm={nextStep}
          />
        );
      case 1:
        return (
          <ChassisInfo
            data={vehicleData.chassisInfo!}
            onChange={(data) => updateVehicleData({ chassisInfo: data })}
          />
        );
      case 2:
        return (
          <SubcategorySelection
            category={vehicleData.category!}
            selectedSubcategory={vehicleData.subcategory}
            onSubcategorySelect={handleSubcategorySelect}
          />
        );
      case 3:
        return (
          <PricingMarginStep
            data={vehicleData.pricing as PricingData}
            onChange={(data) => updateVehicleData({ pricing: data })}
          />
        );
      case 4:
        return (
          <VehicleData
            data={vehicleData.vehicleData!}
            onChange={(data) => updateVehicleData({ vehicleData: data })}
            showBusPrefix={vehicleData.category?.id === 'buses'}
          />
        );
      case 5:
        return (
          <ProductIdentification
            data={vehicleData.productIdentification!}
            onChange={(data) => updateVehicleData({ productIdentification: data })}
          />
        );
      case 6:
        return (
          <MediaUpload
            data={vehicleData.media!}
            onChange={(data) => updateVehicleData({ media: data })}
          />
        );
      case 7:
        return (
          <SecondaryInfo
            data={vehicleData.secondaryInfo!}
            onChange={(data) => updateVehicleData({ secondaryInfo: data })}
          />
        );
      case 8:
        return (
          <SeatConfiguration
            data={vehicleData.seatConfiguration}
            onChange={(data) => updateVehicleData({ seatConfiguration: data })}
            isBus={vehicleData.category?.id === 'buses'}
          />
        );
      case 9:
        return (
          <VehicleOptionals
            data={vehicleData.optionals!}
            onChange={(data) => updateVehicleData({ optionals: data })}
          />
        );
      case 10:
        return (
          <ProductDescription
            description={vehicleData.description || ''}
            onChange={(description) => updateVehicleData({ description })}
            vehicleData={vehicleData}
          />
        );
      case 11:
        return (
          <LocationInfo
            data={vehicleData.location!}
            onChange={(data) => updateVehicleData({ location: data })}
          />
        );
      default:
        return null;
    }
  };

  // Para a etapa 0 (seleção de categoria), não mostramos o layout padrão
  if (currentStep === 0) {
    return renderStep();
  }

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={12}
      stepTitle=""
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      isNextDisabled={isSubmitting}
      isPreviousDisabled={currentStep === 0}
    >
      {renderStep()}
    </WizardLayout>
  );
};