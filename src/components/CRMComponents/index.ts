// Export all CRM components
export { ContactWizardComponent } from './ContactWizardComponent';
export { CompanyWizardComponent } from './CompanyWizardComponent';
export { SmartMatchingComponent } from './SmartMatchingComponent';
export { ContactListComponent } from './ContactListComponent';
export { CompanyListComponent } from './CompanyListComponent';
export { CRMDashboardComponent } from './CRMDashboardComponent';

// Export all types
export type {
  ContactData,
  MatchData,
  ContactWizardProps,
  CompanyWizardProps,
  ContactListProps,
  CompanyListProps,
  SmartMatchingProps,
  CRMDashboardProps
} from './types';

// Re-export individual component types for backward compatibility
export type { CompanyData } from './CompanyWizardComponent';