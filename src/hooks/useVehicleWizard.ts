import { useState, useCallback } from 'react';
import { Vehicle, WizardStep } from '../types/vehicle';

const initialVehicleData: Partial<Vehicle> = {
  chassisInfo: {
    chassisManufacturer: '',
    bodyManufacturer: '',
    chassisModel: '',
    bodyModel: ''
  },
  vehicleData: {
    fabricationYear: new Date().getFullYear(),
    modelYear: new Date().getFullYear(),
    mileage: 0,
    licensePlate: '',
    price: 0,
    priceCost: 0,
    renavam: '',
    chassis: '',
    availableQuantity: 1,
    internalNotes: ''
  },
  productIdentification: {
    title: ''
  },
  media: {
    originalPhotos: [],
    treatedPhotos: [],
    documentPhotos: []
  },
  secondaryInfo: {
    capacity: 1,
    condition: 'used',
    fuelType: '',
    steering: 'assisted',
    singleOwner: false,
    description: ''
  },
  optionals: {
    airConditioning: false,
    usb: false,
    packageHolder: false,
    soundSystem: false,
    monitor: false,
    wifi: false,
    bathroom: false,
    glasType: 'glued',
    curtain: false,
    cabin: false,
    accessibility: false,
    factoryRetarder: false,
    optionalRetarder: false,
    legSupport: false,
    coffeeMaker: false
  },
  location: {
    address: '',
    neighborhood: '',
    state: '',
    city: '',
    zipCode: ''
  },
  description: ''
};

export const useVehicleWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>(initialVehicleData);
  const [isDraft, setIsDraft] = useState(false);

  const updateVehicleData = useCallback((stepData: Partial<Vehicle>) => {
    setVehicleData(prev => ({
      ...prev,
      ...stepData
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 10));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 10)));
  }, []);

  const saveDraft = useCallback(() => {
    setIsDraft(true);
    localStorage.setItem('vehicleDraft', JSON.stringify(vehicleData));
  }, [vehicleData]);

  const loadDraft = useCallback(() => {
    const draft = localStorage.getItem('vehicleDraft');
    if (draft) {
      setVehicleData(JSON.parse(draft));
      setIsDraft(true);
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('vehicleDraft');
    setIsDraft(false);
  }, []);

  const resetWizard = useCallback(() => {
    setCurrentStep(0);
    setVehicleData(initialVehicleData);
    clearDraft();
  }, [clearDraft]);

  return {
    currentStep,
    vehicleData,
    isDraft,
    updateVehicleData,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
    loadDraft,
    clearDraft,
    resetWizard
  };
};