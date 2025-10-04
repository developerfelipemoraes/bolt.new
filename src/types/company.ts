export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface KeyContact extends Contact {
  role: 'fiscal' | 'financial' | 'logistics' | 'commercial';
}

export interface AccountingOffice {
  companyName: string;
  crc: string;
  contact: Contact;
}

export interface Shareholder {
  name: string;
  cpf: string;
  percentage: number;
}

export interface Administrator {
  name: string;
  cpf: string;
  instrument: string;
  date: string;
}

export interface Attorney {
  name: string;
  cpf: string;
  powers: string;
  expirationDate: string;
}

export interface RelatedCompany {
  companyName: string;
  cnpj: string;
  participationPercentage: number;
}

export interface BankAccount {
  bank: string;
  agency: string;
  account: string;
}

export interface Insurance {
  type: string;
  number: string;
  validity: string;
  insurer: string;
}

export interface Vehicle {
  id: string;
  type: string;
  model: string;
  year: number;
  plate: string;
  usage: string;
  kycScore: number;
  status: 'active' | 'pending' | 'inactive';
  pendencies: string[];
}

export interface CompanyData {
  // Step 1: Identification
  corporateName: string;
  tradeName: string;
  cnpj: string;
  nire?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  primaryCnae?: string;
  secondaryCnaes?: string[];
  legalNature?: string;
  companySize: 'MEI' | 'ME' | 'EPP' | 'Others';
  taxRegime: 'Simples' | 'Lucro Presumido' | 'Lucro Real';
  incorporationDate: string;

  // Step 2: Addresses
  commercialAddress: Address;
  billingAddress?: Address;
  deliveryAddress?: Address;

  // Step 3: Contacts
  primaryEmail: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  socialMedia?: string;
  keyContacts: KeyContact[];
  accountingOffice?: AccountingOffice;

  // Step 4: Corporate Structure
  control: 'national' | 'foreign';
  country?: string;
  finalBeneficiaries: Shareholder[];
  administrators: Administrator[];
  attorneys: Attorney[];
  relatedCompanies: RelatedCompany[];

  // Step 5: Financial
  socialCapital: number;
  netWorth: number;
  revenue12m: number;
  relevantAssets?: string;
  paymentTerms: string;
  creditLimit: number;

  // Step 6: Banking
  primaryBankAccount: BankAccount;
  secondaryBankAccount?: BankAccount;
  pixKey?: string;
  beneficiary?: string;

  // Step 7: Operations
  businessLine: string;
  currentFleet: string;
  intendedUse: string;
  preferredBrands: string;
  interestCategories: string[];

  // Step 8: Licenses & Insurance
  rntrc?: string;
  rntrcValidity?: string;
  operatingLicense?: string;
  environmentalLicenses?: string;
  insurances: Insurance[];

  // Step 9: Compliance & LGPD
  isPep: boolean;
  pepRelationship: boolean;
  pepName?: string;
  pepCpf?: string;
  dpoName?: string;
  dpoEmail?: string;
  legalBasis?: string;
  communicationConsent: boolean;
  sharingConsent: boolean;

  // Step 10: Documents
  documents: {
    cnpjCard?: string;
    socialContract?: string;
    registrations?: string;
    addressProof?: string;
    clearances?: string;
    powerOfAttorney?: string;
    digitalCertificate?: string;
    licenses?: string;
  };

  // Profile data
  status: 'client' | 'prospect';
  tags: string[];
  kycScore: number;
  nextReview: string;
  vehicles: Vehicle[];
  completeness: number;
  monthlyTicket: number;
  vehicleCount: number;
  credit: number;
}