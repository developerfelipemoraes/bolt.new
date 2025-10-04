# 📦 DOWNLOAD DOS DADOS DE CARGA INICIAL

## 🎯 **ARQUIVOS DISPONÍVEIS PARA DOWNLOAD:**

Os arquivos estão localizados em `/workspace/shadcn-ui/seed-data/` e contêm:

### 📄 **1. companies.json** (11.7 KB)
```json
[
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
        }
      ]
    }
    // ... mais campos completos
  }
  // ... mais 2 empresas
]
```

### 👥 **2. contacts.json** (22.8 KB)
```json
[
  {
    "personalInfo": {
      "fullName": "João Silva Santos",
      "cpf": "123.456.789-01",
      "rg": "12.345.678-9",
      "birthDate": "1985-03-15",
      "nationality": "Brasileira",
      "maritalStatus": "Casado",
      "gender": "Masculino"
    },
    "contact": {
      "email": "joao.santos@techcorp.com.br",
      "phone": "(11) 98765-4321"
    },
    "financial": {
      "monthlyIncome": 25000,
      "creditScore": 850,
      "netWorth": 500000
    }
    // ... todos os campos completos
  }
  // ... mais 5 contatos
]
```

### 🔗 **3. company-contact-relationships.json** (4.4 KB)
```json
[
  {
    "companyId": "TechCorp",
    "companyCnpj": "12.345.678/0001-90",
    "companyName": "TechCorp Soluções em Tecnologia Ltda",
    "contacts": [
      {
        "contactCpf": "123.456.789-01",
        "contactName": "João Silva Santos",
        "relationship": "CEO",
        "matchingScore": 95,
        "matchingReasons": [
          "Mesmo domínio de email (@techcorp.com.br)",
          "Cargo de alta liderança (CEO)"
        ]
      }
    ]
  }
]
```

## 🚀 **COMO USAR:**

### **Para MongoDB:**
```bash
mongoimport --db crm_database --collection companies --file companies.json --jsonArray
mongoimport --db crm_database --collection contacts --file contacts.json --jsonArray
```

### **Para Node.js:**
```javascript
const companies = require('./companies.json');
const contacts = require('./contacts.json');
const relationships = require('./company-contact-relationships.json');
```

## 📊 **ESTATÍSTICAS:**
- **3 empresas** completas (TechCorp, LogiBrasil, InovaCorp)
- **6 contatos** executivos com perfis completos
- **Matching scores** de 93-98 pontos
- **Todos os campos** do sistema preenchidos

---

**💡 DICA:** Use o botão "Export" no canto superior direito da plataforma MGX para baixar todos os arquivos do projeto!