import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { useVehicleWizard } from '../hooks/useVehicleWizard';
import { WizardLayout } from './wizard-veiculos/WizardLayout';
import { VehicleTypeSelection } from './wizard-veiculos/steps/VehicleTypeSelection';
import { CategorySelection } from './wizard-veiculos/steps/CategorySelection';
import { SubcategorySelection } from './wizard-veiculos/steps/SubcategorySelection';
import { ChassisInfo } from './wizard-veiculos/steps/ChassisInfo';
import { VehicleData } from './wizard-veiculos/steps/VehicleData';
import { ProductIdentification } from './wizard-veiculos/steps/ProductIdentification';
import { MediaUpload } from './wizard-veiculos/steps/MediaUpload';
import { SecondaryInfo } from './wizard-veiculos/steps/SecondaryInfo';
import { SeatConfiguration } from './wizard-veiculos/steps/SeatConfiguration';
import { VehicleOptionals } from './wizard-veiculos/steps/VehicleOptionals';
import { ProductDescription } from './wizard-veiculos/steps/ProductDescription';
import { LocationInfo } from './wizard-veiculos/steps/LocationInfo';
import PricingMarginStep from './wizard-veiculos/steps/PricingMarginStep';
import { VehicleType, VehicleCategory, VehicleSubcategory } from '../types/vehicle';
import { apiService } from '../services/vehicleService';
import { toast } from 'sonner';
import { CommissionConfig, Supplier } from '../types/commission';

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

  const handleTypeSelect = (vehicleType: VehicleType) => {
    updateVehicleData({ vehicleType, category: undefined, subcategory: undefined });
  };

  const handleCategorySelect = (category: VehicleCategory) => {
    updateVehicleData({ category, subcategory: undefined });
  };

  const handleSubcategorySelect = (subcategory: VehicleSubcategory) => {
    updateVehicleData({ subcategory });
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === 12) {
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
      case 0:
        if (!vehicleData.vehicleType) {
          toast.error('Selecione um tipo de veículo antes de continuar');
          return false;
        }
        return true;

      case 1:
        if (!vehicleData.category) {
          toast.error('Selecione uma categoria antes de continuar');
          return false;
        }
        return true;

      case 2: {
        const hasSubcategories = vehicleData.category?.subcategories && vehicleData.category.subcategories.length > 0;
        if (hasSubcategories && !vehicleData.subcategory) {
          toast.error('Selecione uma subcategoria antes de continuar');
          return false;
        }
        return true;
      }

      case 3: {
        const chassisInfo = vehicleData.chassisInfo;
        const vehicleDataInfo = vehicleData.vehicleData;

        if (!vehicleDataInfo?.fabricationYear || !vehicleDataInfo?.modelYear) {
          toast.error('Preencha os anos de fabricação e modelo');
          return false;
        }

        if (!chassisInfo?.chassisManufacturer || !chassisInfo?.chassisModel ||
            !chassisInfo?.bodyManufacturer || !chassisInfo?.bodyModel) {
          toast.error('Preencha todas as informações de montagem');
          return false;
        }
        return true;
      }

      case 5: {
        const vehicleDataInfo = vehicleData.vehicleData;
        if (!vehicleDataInfo?.licensePlate || !vehicleDataInfo?.renavam || !vehicleDataInfo?.chassis) {
          toast.error('Preencha os dados obrigatórios do veículo');
          return false;
        }
        return true;
      }

      case 6:
        if (!vehicleData.productIdentification?.title) {
          toast.error('Defina um título para o produto');
          return false;
        }
        return true;

      case 8: {
        const secondaryInfo = vehicleData.secondaryInfo;
        if (!secondaryInfo?.capacity || !secondaryInfo?.condition || !secondaryInfo?.fuelType) {
          toast.error('Preencha as informações secundárias obrigatórias');
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
      const completeVehicleData = {
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');

      existingVehicles.push(completeVehicleData);

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
          <VehicleTypeSelection
            selectedType={vehicleData.vehicleType}
            onTypeSelect={handleTypeSelect}
          />
        );
      case 1:
        return (
          <CategorySelection
            vehicleType={vehicleData.vehicleType!}
            selectedCategory={vehicleData.category}
            onCategorySelect={handleCategorySelect}
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
          <ChassisInfo
            data={vehicleData.chassisInfo!}
            onChange={(data) => updateVehicleData({ chassisInfo: data })}
            category={vehicleData.category}
            subcategory={vehicleData.subcategory}
            fabricationYear={vehicleData.vehicleData?.fabricationYear}
            modelYear={vehicleData.vehicleData?.modelYear}
            onFabricationYearChange={(fabricationYear) => updateVehicleData({
              vehicleData: { ...vehicleData.vehicleData!, fabricationYear }
            })}
            onModelYearChange={(modelYear) => updateVehicleData({
              vehicleData: { ...vehicleData.vehicleData!, modelYear }
            })}
          />
        );
      case 4:
        return (
          <PricingMarginStep
            data={vehicleData.commission}
            supplier={vehicleData.supplier}
            onChange={(data: CommissionConfig) => updateVehicleData({ commission: data })}
            onSupplierChange={(supplier: Supplier | undefined) => updateVehicleData({ supplier })}
          />
        );
      case 5:
        return (
          <VehicleData
            data={vehicleData.vehicleData!}
            onChange={(data) => updateVehicleData({ vehicleData: data })}
            showBusPrefix={vehicleData.vehicleType?.id === 'bus'}
          />
        );
      case 6:
        return (
          <ProductIdentification
            data={vehicleData.productIdentification!}
            onChange={(data) => updateVehicleData({ productIdentification: data })}
          />
        );
      case 7:
        return (
          <MediaUpload
            data={vehicleData.media!}
            onChange={(data) => updateVehicleData({ media: data })}
          />
        );
      case 8:
        return (
          <SecondaryInfo
            data={vehicleData.secondaryInfo!}
            onChange={(data) => updateVehicleData({ secondaryInfo: data })}
          />
        );
      case 9:
        return (
          <SeatConfiguration
            data={vehicleData.seatConfiguration}
            onChange={(data) => updateVehicleData({ seatConfiguration: data })}
            isBus={vehicleData.vehicleType?.id === 'bus'}
          />
        );
      case 10:
        return (
          <VehicleOptionals
            data={vehicleData.optionals!}
            onChange={(data) => updateVehicleData({ optionals: data })}
          />
        );
      case 11:
        return (
          <ProductDescription
            description={vehicleData.description || ''}
            onChange={(description) => updateVehicleData({ description })}
            vehicleData={vehicleData}
          />
        );
      case 12:
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

  if (currentStep === 0) {
    return renderStep();
  }

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={13}
      stepTitle=""
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      isNextDisabled={isSubmitting}
      isSubmitting={isSubmitting}
    >
      {renderStep()}
    </WizardLayout>
  );
};
