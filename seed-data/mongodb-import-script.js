// Script para importar dados de carga inicial no MongoDB
// Execute este script no MongoDB Compass ou via mongo shell

// Conectar ao banco de dados CRM
use crm_database;

// 1. Limpar coleções existentes (opcional - descomente se necessário)
// db.companies.deleteMany({});
// db.contacts.deleteMany({});
// db.relationships.deleteMany({});

// 2. Inserir empresas
db.companies.insertMany([
  {
    "basicInfo": {
      "legalName": "TechCorp Soluções em Tecnologia Ltda",
      "tradeName": "TechCorp",
      "cnpj": "12.345.678/0001-90",
      "stateRegistration": "123456789",
      "municipalRegistration": "987654321",
      "foundingDate": "2018-03-15",
      "legalNature": "Sociedade Empresária Limitada",
      "companySize": "Média",
      "mainActivity": "Desenvolvimento de software",
      "secondaryActivities": ["Consultoria em TI", "Suporte técnico"]
    },
    "corporateStructure": {
      "authorizedCapital": 500000,
      "paidCapital": 350000,
      "numberOfPartners": 3,
      "partners": [
        {
          "name": "João Silva Santos",
          "cpf": "123.456.789-01",
          "participation": 40,
          "role": "Sócio Administrador"
        },
        {
          "name": "Maria Oliveira Costa",
          "cpf": "987.654.321-02",
          "participation": 35,
          "role": "Sócia"
        },
        {
          "name": "Carlos Eduardo Lima",
          "cpf": "456.789.123-03",
          "participation": 25,
          "role": "Sócio"
        }
      ]
    },
    "addresses": {
      "headquarters": {
        "street": "Av. Paulista",
        "number": "1000",
        "complement": "Sala 1501",
        "neighborhood": "Bela Vista",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01310-100",
        "country": "Brasil"
      },
      "correspondence": {
        "street": "Av. Paulista",
        "number": "1000",
        "complement": "Sala 1501",
        "neighborhood": "Bela Vista",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01310-100",
        "country": "Brasil"
      }
    },
    "contact": {
      "email": "contato@techcorp.com.br",
      "phone": "(11) 3456-7890",
      "mobile": "(11) 98765-4321",
      "website": "https://www.techcorp.com.br",
      "linkedin": "https://linkedin.com/company/techcorp"
    },
    "keyContacts": [
      {
        "name": "João Silva Santos",
        "position": "CEO",
        "email": "joao.santos@techcorp.com.br",
        "phone": "(11) 98765-4321"
      },
      {
        "name": "Maria Oliveira Costa",
        "position": "CTO",
        "email": "maria.costa@techcorp.com.br",
        "phone": "(11) 97654-3210"
      }
    ],
    "financial": {
      "annualRevenue": 2500000,
      "numberOfEmployees": 45,
      "creditRating": "A",
      "paymentTerms": "30 dias",
      "averageTicket": 15000,
      "mainClients": ["Banco ABC", "Empresa XYZ", "Corporação 123"]
    },
    "banking": {
      "primaryBank": "Banco do Brasil",
      "accountNumber": "12345-6",
      "agency": "1234",
      "pixKey": "12.345.678/0001-90"
    },
    "fleet": {
      "hasFleet": true,
      "vehicleCount": 8,
      "vehicles": [
        {
          "type": "Carro",
          "brand": "Toyota",
          "model": "Corolla",
          "year": 2022,
          "plate": "ABC-1234"
        },
        {
          "type": "Van",
          "brand": "Fiat",
          "model": "Ducato",
          "year": 2021,
          "plate": "XYZ-5678"
        }
      ]
    },
    "licenses": {
      "hasLicenses": true,
      "licenses": [
        {
          "type": "Alvará de Funcionamento",
          "number": "ALV-2023-001",
          "issueDate": "2023-01-15",
          "expiryDate": "2024-01-15",
          "issuingBody": "Prefeitura de São Paulo"
        },
        {
          "type": "Licença Ambiental",
          "number": "LA-2023-002",
          "issueDate": "2023-02-10",
          "expiryDate": "2025-02-10",
          "issuingBody": "CETESB"
        }
      ]
    },
    "compliance": {
      "kycScore": 85,
      "riskClassification": "Baixo",
      "lastReview": "2024-01-15",
      "nextReview": "2024-07-15",
      "complianceOfficer": "Ana Paula Compliance",
      "documents": [
        {
          "type": "Contrato Social",
          "status": "Válido",
          "lastUpdate": "2023-03-15"
        },
        {
          "type": "Certidão Negativa",
          "status": "Válido",
          "lastUpdate": "2024-01-10"
        }
      ]
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "basicInfo": {
      "legalName": "Logística Brasil Transportes S.A.",
      "tradeName": "LogiBrasil",
      "cnpj": "98.765.432/0001-10",
      "stateRegistration": "987654321",
      "municipalRegistration": "123456789",
      "foundingDate": "2015-08-20",
      "legalNature": "Sociedade Anônima",
      "companySize": "Grande",
      "mainActivity": "Transporte rodoviário de cargas",
      "secondaryActivities": ["Armazenagem", "Distribuição"]
    },
    "corporateStructure": {
      "authorizedCapital": 2000000,
      "paidCapital": 1800000,
      "numberOfPartners": 5,
      "partners": [
        {
          "name": "Roberto Silva Transportes",
          "cpf": "111.222.333-44",
          "participation": 30,
          "role": "Diretor Presidente"
        },
        {
          "name": "Fernanda Costa Logística",
          "cpf": "555.666.777-88",
          "participation": 25,
          "role": "Diretora Operacional"
        }
      ]
    },
    "addresses": {
      "headquarters": {
        "street": "Rod. Presidente Dutra",
        "number": "Km 225",
        "complement": "Galpão A",
        "neighborhood": "Distrito Industrial",
        "city": "São José dos Campos",
        "state": "SP",
        "zipCode": "12240-000",
        "country": "Brasil"
      },
      "correspondence": {
        "street": "Rod. Presidente Dutra",
        "number": "Km 225",
        "complement": "Galpão A",
        "neighborhood": "Distrito Industrial",
        "city": "São José dos Campos",
        "state": "SP",
        "zipCode": "12240-000",
        "country": "Brasil"
      }
    },
    "contact": {
      "email": "contato@logibrasil.com.br",
      "phone": "(12) 3456-7890",
      "mobile": "(12) 98765-4321",
      "website": "https://www.logibrasil.com.br",
      "linkedin": "https://linkedin.com/company/logibrasil"
    },
    "keyContacts": [
      {
        "name": "Roberto Silva Transportes",
        "position": "CEO",
        "email": "roberto.silva@logibrasil.com.br",
        "phone": "(12) 98765-4321"
      },
      {
        "name": "Fernanda Costa Logística",
        "position": "Diretora Operacional",
        "email": "fernanda.costa@logibrasil.com.br",
        "phone": "(12) 97654-3210"
      }
    ],
    "financial": {
      "annualRevenue": 15000000,
      "numberOfEmployees": 180,
      "creditRating": "AA",
      "paymentTerms": "45 dias",
      "averageTicket": 25000,
      "mainClients": ["Mercado Livre", "Magazine Luiza", "Casas Bahia"]
    },
    "banking": {
      "primaryBank": "Itaú",
      "accountNumber": "98765-4",
      "agency": "9876",
      "pixKey": "98.765.432/0001-10"
    },
    "fleet": {
      "hasFleet": true,
      "vehicleCount": 45,
      "vehicles": [
        {
          "type": "Caminhão",
          "brand": "Mercedes",
          "model": "Actros",
          "year": 2023,
          "plate": "LOG-1001"
        },
        {
          "type": "Carreta",
          "brand": "Scania",
          "model": "R450",
          "year": 2022,
          "plate": "LOG-2002"
        }
      ]
    },
    "licenses": {
      "hasLicenses": true,
      "licenses": [
        {
          "type": "RNTRC",
          "number": "RNTRC-123456789",
          "issueDate": "2023-01-01",
          "expiryDate": "2025-01-01",
          "issuingBody": "ANTT"
        },
        {
          "type": "Licença Ambiental",
          "number": "LA-SP-2023-003",
          "issueDate": "2023-03-01",
          "expiryDate": "2026-03-01",
          "issuingBody": "CETESB"
        }
      ]
    },
    "compliance": {
      "kycScore": 92,
      "riskClassification": "Muito Baixo",
      "lastReview": "2024-02-01",
      "nextReview": "2024-08-01",
      "complianceOfficer": "Carlos Compliance Santos",
      "documents": [
        {
          "type": "Estatuto Social",
          "status": "Válido",
          "lastUpdate": "2023-08-20"
        },
        {
          "type": "Certidão Negativa Federal",
          "status": "Válido",
          "lastUpdate": "2024-02-01"
        }
      ]
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "basicInfo": {
      "legalName": "InovaCorp Tecnologia e Inovação Ltda",
      "tradeName": "InovaCorp",
      "cnpj": "11.222.333/0001-44",
      "stateRegistration": "111222333",
      "municipalRegistration": "444555666",
      "foundingDate": "2020-01-10",
      "legalNature": "Sociedade Empresária Limitada",
      "companySize": "Pequena",
      "mainActivity": "Desenvolvimento de aplicativos móveis",
      "secondaryActivities": ["Design UX/UI", "Consultoria digital"]
    },
    "corporateStructure": {
      "authorizedCapital": 200000,
      "paidCapital": 150000,
      "numberOfPartners": 2,
      "partners": [
        {
          "name": "Ana Paula Costa Silva",
          "cpf": "321.654.987-11",
          "participation": 60,
          "role": "Sócia Administradora"
        },
        {
          "name": "Pedro Henrique Oliveira",
          "cpf": "654.321.987-22",
          "participation": 40,
          "role": "Sócio"
        }
      ]
    },
    "addresses": {
      "headquarters": {
        "street": "Rua das Startups",
        "number": "500",
        "complement": "Coworking Tech Hub",
        "neighborhood": "Vila Madalena",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "05433-000",
        "country": "Brasil"
      },
      "correspondence": {
        "street": "Rua das Startups",
        "number": "500",
        "complement": "Coworking Tech Hub",
        "neighborhood": "Vila Madalena",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "05433-000",
        "country": "Brasil"
      }
    },
    "contact": {
      "email": "contato@inovacorp.com.br",
      "phone": "(11) 2345-6789",
      "mobile": "(11) 99876-5432",
      "website": "https://www.inovacorp.com.br",
      "linkedin": "https://linkedin.com/company/inovacorp"
    },
    "keyContacts": [
      {
        "name": "Ana Paula Costa Silva",
        "position": "CEO & Founder",
        "email": "ana.costa@inovacorp.com.br",
        "phone": "(11) 99876-5432"
      },
      {
        "name": "Pedro Henrique Oliveira",
        "position": "CTO & Co-Founder",
        "email": "pedro.oliveira@inovacorp.com.br",
        "phone": "(11) 98765-1234"
      }
    ],
    "financial": {
      "annualRevenue": 800000,
      "numberOfEmployees": 12,
      "creditRating": "B+",
      "paymentTerms": "15 dias",
      "averageTicket": 8000,
      "mainClients": ["Startup ABC", "E-commerce XYZ", "Fintech 123"]
    },
    "banking": {
      "primaryBank": "Nubank",
      "accountNumber": "11111-1",
      "agency": "0001",
      "pixKey": "contato@inovacorp.com.br"
    },
    "fleet": {
      "hasFleet": false,
      "vehicleCount": 0,
      "vehicles": []
    },
    "licenses": {
      "hasLicenses": true,
      "licenses": [
        {
          "type": "Alvará Digital",
          "number": "AD-2023-004",
          "issueDate": "2023-01-10",
          "expiryDate": "2024-01-10",
          "issuingBody": "Prefeitura de São Paulo"
        }
      ]
    },
    "compliance": {
      "kycScore": 78,
      "riskClassification": "Médio",
      "lastReview": "2024-01-10",
      "nextReview": "2024-07-10",
      "complianceOfficer": "Compliance Terceirizado Ltda",
      "documents": [
        {
          "type": "Contrato Social",
          "status": "Válido",
          "lastUpdate": "2023-01-10"
        },
        {
          "type": "Certidão Municipal",
          "status": "Válido",
          "lastUpdate": "2024-01-05"
        }
      ]
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);

print("✅ Empresas inseridas com sucesso!");

// 3. Inserir contatos (apenas o primeiro para exemplo)
db.contacts.insertMany([
  {
    "personalInfo": {
      "fullName": "João Silva Santos",
      "cpf": "123.456.789-01",
      "rg": "12.345.678-9",
      "birthDate": "1985-03-15",
      "nationality": "Brasileira",
      "maritalStatus": "Casado",
      "gender": "Masculino",
      "motherName": "Maria Santos Silva",
      "fatherName": "José Silva Santos"
    },
    "contact": {
      "email": "joao.santos@techcorp.com.br",
      "personalEmail": "joao.santos.pessoal@gmail.com",
      "phone": "(11) 98765-4321",
      "landline": "(11) 3456-7890",
      "emergencyContact": {
        "name": "Maria Santos Silva",
        "relationship": "Mãe",
        "phone": "(11) 97654-3210"
      }
    },
    "addresses": {
      "residential": {
        "street": "Rua das Flores",
        "number": "123",
        "complement": "Apto 45",
        "neighborhood": "Jardins",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567",
        "country": "Brasil",
        "residenceType": "Própria",
        "residenceTime": "8 anos"
      },
      "professional": {
        "street": "Av. Paulista",
        "number": "1000",
        "complement": "Sala 1501",
        "neighborhood": "Bela Vista",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01310-100",
        "country": "Brasil"
      }
    },
    "professional": {
      "company": "TechCorp Soluções em Tecnologia Ltda",
      "position": "CEO",
      "department": "Diretoria",
      "admissionDate": "2018-03-15",
      "salary": 25000,
      "workRegime": "CLT",
      "previousExperience": [
        {
          "company": "IBM Brasil",
          "position": "Gerente de TI",
          "period": "2015-2018",
          "reason": "Promoção"
        }
      ]
    },
    "financial": {
      "monthlyIncome": 25000,
      "otherIncome": 5000,
      "totalIncome": 30000,
      "monthlyExpenses": 18000,
      "netWorth": 500000,
      "creditScore": 850,
      "hasDebts": false,
      "debts": [],
      "assets": [
        {
          "type": "Imóvel",
          "description": "Apartamento próprio",
          "value": 800000
        },
        {
          "type": "Veículo",
          "description": "BMW X3 2022",
          "value": 250000
        },
        {
          "type": "Investimentos",
          "description": "Ações e fundos",
          "value": 300000
        }
      ]
    },
    "banking": {
      "primaryBank": "Banco do Brasil",
      "accountType": "Conta Corrente",
      "accountNumber": "12345-6",
      "agency": "1234",
      "bankingTime": "10 anos",
      "creditLimit": 50000,
      "pixKey": "123.456.789-01"
    },
    "documents": {
      "hasValidDocuments": true,
      "documents": [
        {
          "type": "CPF",
          "number": "123.456.789-01",
          "status": "Regular",
          "lastVerification": "2024-01-15"
        },
        {
          "type": "RG",
          "number": "12.345.678-9",
          "issuingBody": "SSP/SP",
          "issueDate": "2010-03-15",
          "status": "Válido"
        },
        {
          "type": "CNH",
          "number": "12345678901",
          "category": "B",
          "expiryDate": "2026-03-15",
          "status": "Válida"
        }
      ]
    },
    "compliance": {
      "kycScore": 88,
      "riskClassification": "Baixo",
      "lastReview": "2024-01-15",
      "nextReview": "2024-07-15",
      "pep": false,
      "sanctionsList": false,
      "complianceNotes": "Cliente de baixo risco, documentação completa e atualizada",
      "approvedBy": "Ana Paula Compliance",
      "approvalDate": "2024-01-15"
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
  // Adicione os outros contatos seguindo o mesmo padrão...
]);

print("✅ Contatos inseridos com sucesso!");

// 4. Criar índices para otimização
db.companies.createIndex({ "basicInfo.cnpj": 1 });
db.companies.createIndex({ "basicInfo.legalName": "text", "basicInfo.tradeName": "text" });
db.companies.createIndex({ "contact.email": 1 });
db.companies.createIndex({ "compliance.kycScore": 1 });

db.contacts.createIndex({ "personalInfo.cpf": 1 });
db.contacts.createIndex({ "personalInfo.fullName": "text" });
db.contacts.createIndex({ "contact.email": 1 });
db.contacts.createIndex({ "professional.company": "text" });
db.contacts.createIndex({ "compliance.kycScore": 1 });

print("✅ Índices criados com sucesso!");

// 5. Verificar dados inseridos
print("\n📊 RESUMO DOS DADOS INSERIDOS:");
print("Empresas cadastradas: " + db.companies.countDocuments());
print("Contatos cadastrados: " + db.contacts.countDocuments());

// 6. Exemplos de consultas úteis
print("\n🔍 EXEMPLOS DE CONSULTAS:");

print("\n1. Buscar empresa por CNPJ:");
print("db.companies.findOne({'basicInfo.cnpj': '12.345.678/0001-90'})");

print("\n2. Buscar contatos por empresa:");
print("db.contacts.find({'professional.company': /TechCorp/i})");

print("\n3. Buscar por domínio de email:");
print("db.contacts.find({'contact.email': /@techcorp.com.br$/})");

print("\n4. Listar empresas por score KYC:");
print("db.companies.find({}, {'basicInfo.tradeName': 1, 'compliance.kycScore': 1}).sort({'compliance.kycScore': -1})");

print("\n✅ Script de carga inicial executado com sucesso!");
print("🚀 Agora você pode testar a integração com a API!");