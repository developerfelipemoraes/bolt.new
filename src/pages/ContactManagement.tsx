import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ContactWizard from '@/components/ContactWizard';
import ContactListReal from '@/components/ContactListReal';
import ContactProfile from '@/components/ContactProfile';
import { ContactData } from '@/types/contact';
import { PermissionGuard } from '@/components/ui/permission-guard';

export default function ContactManagement() {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleNewContact = () => {
    navigate('/contacts/new');
  };

  const handleEditContact = (contact: any) => {
    setSelectedContact(contact);
    navigate('/contacts/edit');
  };

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    navigate('/contacts/profile');
  };

  const handleContactComplete = (contactData: ContactData) => {
    console.log('Contato cadastrado:', contactData);
    navigate('/contacts');
  };

  const handleContactCancel = () => {
    navigate('/contacts');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PermissionGuard resource="contacts" action="read">
            <ContactListReal
              onBack={handleBack}
              onNew={handleNewContact}
              onEdit={handleEditContact}
              onView={handleViewContact}
            />
          </PermissionGuard>
        } 
      />
      <Route 
        path="/new" 
        element={
          <PermissionGuard resource="contacts" action="create">
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="max-w-6xl mx-auto p-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/contacts')}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Lista
                </Button>
                <ContactWizard
                  onComplete={handleContactComplete}
                  onCancel={handleContactCancel}
                />
              </div>
            </div>
          </PermissionGuard>
        } 
      />
      <Route 
        path="/edit" 
        element={
          <PermissionGuard resource="contacts" action="update">
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="max-w-6xl mx-auto p-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/contacts')}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Lista
                </Button>
                <ContactWizard
                  onComplete={handleContactComplete}
                  onCancel={handleContactCancel}
                  initialData={selectedContact || undefined}
                />
              </div>
            </div>
          </PermissionGuard>
        } 
      />
      <Route 
        path="/profile" 
        element={
          selectedContact ? (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="max-w-6xl mx-auto p-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/contacts')}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Lista
                </Button>
                <ContactProfile
                  contactData={selectedContact}
                  onEdit={() => navigate('/contacts/edit')}
                  onExport={() => console.log('Exportar contato')}
                />
              </div>
            </div>
          ) : (
            <div>Contato não encontrado</div>
          )
        } 
      />
    </Routes>
  );
}