import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MatchingSystemReal from '@/components/MatchingSystemReal';
import { SmartMatchingComponent } from '@/components/CRMComponents';

export default function MatchingSystem() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Mock data para demonstração
  const mockCompanies = [
    {
      _id: '1',
      basicInfo: {
        legalName: 'TechCorp Soluções em Tecnologia Ltda',
        tradeName: 'TechCorp'
      },
      contact: {
        email: 'contato@techcorp.com.br'
      }
    },
    {
      _id: '2',
      basicInfo: {
        legalName: 'Logística Brasil Transportes S.A.',
        tradeName: 'LogiBrasil'
      },
      contact: {
        email: 'contato@logibrasil.com.br'
      }
    }
  ];

  const mockContacts = [
    {
      _id: '1',
      personalInfo: {
        fullName: 'João Silva Santos'
      },
      contact: {
        email: 'joao.santos@techcorp.com.br'
      },
      professional: {
        company: 'TechCorp',
        occupation: 'CEO'
      }
    },
    {
      _id: '2',
      personalInfo: {
        fullName: 'Maria Oliveira Costa'
      },
      contact: {
        email: 'maria.costa@techcorp.com.br'
      },
      professional: {
        company: 'TechCorp',
        occupation: 'CTO'
      }
    }
  ];

  const mockMatches = [
    {
      company: mockCompanies[0],
      contact: mockContacts[0],
      score: 95,
      reasons: ['Mesmo domínio de email', 'Cargo executivo']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto p-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Routes>
          <Route 
            path="/" 
            element={
              <MatchingSystemReal
                matches={mockMatches}
                companies={mockCompanies}
                contacts={mockContacts}
                onUpdate={() => console.log('Atualizar matches')}
              />
            } 
          />
          <Route 
            path="/company-contacts" 
            element={
              <SmartMatchingComponent
                onBack={() => navigate('/matching')}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
}