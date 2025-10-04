# CRM Components Library

A complete, standalone CRM components library built with React, TypeScript, and Tailwind CSS.

## Features

- 🧙‍♂️ **Contact Wizard** - 5-step contact registration with validation
- 🏢 **Company Wizard** - 5-step company registration with validation  
- 🤖 **Smart Matching** - AI-powered contact-company matching system
- 📋 **Contact List** - Advanced contact management with search/filters
- 🏭 **Company List** - Advanced company management with search/filters
- 📊 **CRM Dashboard** - Analytics dashboard with real-time statistics

## Installation

```bash
npm install @crm/components
# or
yarn add @crm/components
# or
pnpm add @crm/components
```

## Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom lucide-react sonner
```

## Usage

### Basic Import

```typescript
import {
  ContactWizardComponent,
  CompanyWizardComponent,
  SmartMatchingComponent,
  ContactListComponent,
  CompanyListComponent,
  CRMDashboardComponent,
  type ContactData,
  type CompanyData
} from '@crm/components';
```

### Contact Wizard

```tsx
import { ContactWizardComponent, type ContactData } from '@crm/components';

function App() {
  const handleContactSubmit = (data: ContactData) => {
    console.log('New contact:', data);
  };

  return (
    <ContactWizardComponent
      onSubmit={handleContactSubmit}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

### Company Wizard

```tsx
import { CompanyWizardComponent, type CompanyData } from '@crm/components';

function App() {
  const handleCompanySubmit = (data: CompanyData) => {
    console.log('New company:', data);
  };

  return (
    <CompanyWizardComponent
      onSubmit={handleCompanySubmit}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

### CRM Dashboard

```tsx
import { CRMDashboardComponent } from '@crm/components';

function App() {
  const contacts = []; // Your contacts data
  const companies = []; // Your companies data
  const matches = []; // Your matches data

  return (
    <CRMDashboardComponent
      contacts={contacts}
      companies={companies}
      matches={matches}
      onNewContact={() => console.log('New contact')}
      onNewCompany={() => console.log('New company')}
      onStartMatching={() => console.log('Start matching')}
    />
  );
}
```

### Smart Matching

```tsx
import { SmartMatchingComponent } from '@crm/components';

function App() {
  const contacts = []; // Your contacts data
  const companies = []; // Your companies data

  return (
    <SmartMatchingComponent
      contacts={contacts}
      companies={companies}
      onMatchConfirmed={(matches) => console.log('New matches:', matches)}
    />
  );
}
```

## Data Types

### ContactData

```typescript
interface ContactData {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cargo?: string;
  empresa?: string;
  departamento?: string;
}
```

### CompanyData

```typescript
interface CompanyData {
  id?: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  segmento?: string;
  porte?: string;
  faturamento?: string;
  numeroFuncionarios?: string;
}
```

## Styling

This library uses Tailwind CSS. Make sure your project has Tailwind CSS configured with the necessary classes.

### Required Tailwind Config

Add these to your `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    // ... your existing content
    "./node_modules/@crm/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add any custom theme extensions if needed
    },
  },
  plugins: [],
}
```

## Features Details

### Validation

- **CPF/CNPJ**: Real validation with checksum verification
- **Email**: Format validation
- **CEP**: Automatic address lookup (requires ViaCEP API)
- **Required Fields**: Visual feedback for missing data

### Smart Matching Algorithm

The matching system uses multiple criteria:
- Geographic proximity (same state/city)
- Industry/segment alignment
- Company size compatibility
- Professional level matching

Scores range from 60-100% with detailed reasoning.

### Responsive Design

All components are fully responsive and work on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.

## Contributing

This library is part of the MGX platform. For contributions and issues, please contact the development team.