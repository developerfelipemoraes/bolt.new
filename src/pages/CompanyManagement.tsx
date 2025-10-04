import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CompanyWizard from '@/components/CompanyWizard';
import CompanyListReal from '@/components/CompanyListReal';
import CompanyProfile from '@/components/CompanyProfile';
import { CompanyData } from '@/types/company';
import { PermissionGuard } from '@/components/ui/permission-guard';

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleNewCompany = () => {
    navigate('/companies/new');
  };

  const handleEditCompany = (company: any) => {
    setSelectedCompany(company);
    navigate('/companies/edit');
  };

  const handleViewCompany = (company: any) => {
    setSelectedCompany(company);
    navigate('/companies/profile');
  };

  const handleCompanyComplete = (companyData: CompanyData) => {
    console.log('Empresa cadastrada:', companyData);
    navigate('/companies');
  };

  const handleCompanyCancel = () => {
    navigate('/companies');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PermissionGuard resource="companies" action="read">
            <CompanyListReal
              onBack={handleBack}
              onNew={handleNewCompany}
              onEdit={handleEditCompany}
              onView={handleViewCompany}
            />
          </PermissionGuard>
        } 
      />
      <Route 
        path="/new" 
        element={
          <PermissionGuard resource="companies" action="create">
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="max-w-6xl mx-auto p-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/companies')}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Lista
                </Button>
                <CompanyWizard
                  onComplete={handleCompanyComplete}
                  onCancel={handleCompanyCancel}
                />
              </div>
            </div>
          </PermissionGuard>
        } 
      />
      <Route 
        path="/edit" 
        element={
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="max-w-6xl mx-auto p-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/companies')}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à Lista
              </Button>
              <CompanyWizard
                onComplete={handleCompanyComplete}
                onCancel={handleCompanyCancel}
                initialData={selectedCompany || undefined}
              />
            </div>
          </div>
        } 
      />
      <Route 
        path="/profile" 
        element={
          selectedCompany ? (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="max-w-6xl mx-auto p-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/companies')}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Lista
                </Button>
                <CompanyProfile
                  companyData={selectedCompany}
                  onEdit={() => navigate('/companies/edit')}
                  onExport={() => console.log('Exportar empresa')}
                  onBack={() => navigate('/companies')}
                />
              </div>
            </div>
          ) : (
            <div>Empresa não encontrada</div>
          )
        } 
      />
    </Routes>
  );
}