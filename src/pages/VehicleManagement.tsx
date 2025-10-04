import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VehicleWizard } from '@/components/VehicleWizard';
import { VehicleList } from '@/components/VehicleList';
import { VehicleSummary } from '@/components/VehicleSummary';
import { Vehicle } from '@/types/vehicle';
import { PermissionGuard } from '@/components/ui/permission-guard';

export default function VehicleManagement() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [summaryData, setSummaryData] = useState<Partial<Vehicle> | null>(null);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleNewVehicle = () => {
    navigate('/vehicles/new');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    navigate('/vehicles/edit');
  };

  const handleVehicleComplete = (vehicleData: Vehicle) => {
    setSummaryData(vehicleData);
    navigate('/vehicles/summary');
  };

  const handleVehicleCancel = () => {
    navigate('/vehicles');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PermissionGuard resource="vehicles" action="read">
            <VehicleList
              onAdd={handleNewVehicle}
              onEdit={handleEditVehicle}
            />
          </PermissionGuard>
        } 
      />
      <Route 
        path="/new" 
        element={
          <PermissionGuard resource="vehicles" action="create">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="max-w-6xl mx-auto p-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/vehicles')}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Lista
                </Button>
                <VehicleWizard
                  onComplete={handleVehicleComplete}
                  onCancel={handleVehicleCancel}
                />
              </div>
            </div>
          </PermissionGuard>
        } 
      />
      <Route 
        path="/edit" 
        element={
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="max-w-6xl mx-auto p-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/vehicles')}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à Lista
              </Button>
              <VehicleWizard
                onComplete={handleVehicleComplete}
                onCancel={handleVehicleCancel}
              />
            </div>
          </div>
        } 
      />
      <Route 
        path="/summary" 
        element={
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="max-w-6xl mx-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  Veículo Cadastrado com Sucesso!
                </h1>
                <Button onClick={() => navigate('/vehicles')}>
                  Voltar à Lista
                </Button>
              </div>
              {summaryData && <VehicleSummary vehicleData={summaryData} />}
            </div>
          </div>
        } 
      />
    </Routes>
  );
}