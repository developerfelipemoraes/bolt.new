# 📊 Dados de Carga Inicial - Sistema CRM

Este diretório contém os dados de carga inicial completos para testar a integração da API do sistema CRM.

## 📁 Arquivos Disponíveis

### 1. **companies.json**
- **3 empresas** com todos os campos preenchidos
- Estrutura completa: identificação, estrutura societária, endereços, contatos, financeiro, frota, licenças e compliance
- Empresas: TechCorp, LogiBrasil, InovaCorp

### 2. **contacts.json** 
- **6 contatos** com perfis completos
- Estrutura completa: dados pessoais, contatos, endereços, profissional, financeiro, bancário, documentos e compliance
- Contatos vinculados às empresas através de domínios de email

### 3. **company-contact-relationships.json**
- **Relacionamentos** entre empresas e contatos
- Scores de matching automático (74-98 pontos)
- Motivos de vinculação e status dos relacionamentos

### 4. **mongodb-import-script.js**
- **Script completo** para importar no MongoDB
- Criação de índices para otimização
- Exemplos de consultas úteis

## 🚀 Como Usar

### Opção 1: MongoDB Compass
1. Abra o MongoDB Compass
2. Conecte ao seu banco `crm_database`
3. Abra o shell do MongoDB (ícone `>_` no canto inferior)
4. Cole e execute o conteúdo do arquivo `mongodb-import-script.js`

### Opção 2: Linha de Comando
```bash
# Navegar até o diretório dos dados
cd /workspace/shadcn-ui/seed-data

# Importar empresas
mongoimport --db crm_database --collection companies --file companies.json --jsonArray

# Importar contatos  
mongoimport --db crm_database --collection contacts --file contacts.json --jsonArray

# Executar script de índices
mongo crm_database mongodb-import-script.js
```

### Opção 3: Usando Node.js
```javascript
const { MongoClient } = require('mongodb');
const fs = require('fs');

async function loadSeedData() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  const db = client.db('crm_database');
  
  // Carregar empresas
  const companies = JSON.parse(fs.readFileSync('companies.json', 'utf8'));
  await db.collection('companies').insertMany(companies);
  
  // Carregar contatos
  const contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
  await db.collection('contacts').insertMany(contacts);
  
  console.log('✅ Dados carregados com sucesso!');
  await client.close();
}

loadSeedData();
```

## 📋 Dados Incluídos

### 🏢 Empresas
1. **TechCorp** (Tecnologia)
   - CNPJ: 12.345.678/0001-90
   - Email: contato@techcorp.com.br
   - KYC Score: 85

2. **LogiBrasil** (Logística)
   - CNPJ: 98.765.432/0001-10
   - Email: contato@logibrasil.com.br
   - KYC Score: 92

3. **InovaCorp** (Startup)
   - CNPJ: 11.222.333/0001-44
   - Email: contato@inovacorp.com.br
   - KYC Score: 78

### 👥 Contatos
1. **João Silva Santos** - CEO TechCorp
2. **Maria Oliveira Costa** - CTO TechCorp
3. **Roberto Silva Transportes** - CEO LogiBrasil
4. **Fernanda Costa Logística** - Diretora LogiBrasil
5. **Ana Paula Costa Silva** - CEO InovaCorp
6. **Pedro Henrique Oliveira** - CTO InovaCorp

## 🎯 Algoritmo de Matching

Os relacionamentos são baseados em:

### Score de Matching (0-100)
- **60 pontos**: Mesmo domínio de email
- **30 pontos**: Nome da empresa similar
- **10 pontos**: Cargo corporativo detectado

### Exemplos de Matches
- João Santos + TechCorp = **95 pontos**
- Roberto Silva + LogiBrasil = **98 pontos**
- Ana Costa + InovaCorp = **96 pontos**

## 🔍 Consultas de Teste

### Buscar empresas por score KYC
```javascript
db.companies.find({
  "compliance.kycScore": { $gte: 80 }
}).sort({ "compliance.kycScore": -1 });
```

### Encontrar contatos por domínio de email
```javascript
db.contacts.find({
  "contact.email": /@techcorp\.com\.br$/
});
```

### Matching automático por empresa
```javascript
// Buscar contatos da TechCorp
db.contacts.find({
  "professional.company": /TechCorp/i
});
```

### Análise financeira
```javascript
// Empresas por faturamento
db.companies.find({}, {
  "basicInfo.tradeName": 1,
  "financial.annualRevenue": 1
}).sort({ "financial.annualRevenue": -1 });
```

## ✅ Verificação dos Dados

Após importar, execute:

```javascript
// Contar registros
db.companies.countDocuments(); // Deve retornar 3
db.contacts.countDocuments();  // Deve retornar 6

// Verificar índices
db.companies.getIndexes();
db.contacts.getIndexes();

// Testar busca por texto
db.companies.find({ $text: { $search: "TechCorp" } });
```

## 🚨 Troubleshooting

### Erro de conexão MongoDB
```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongod

# Iniciar MongoDB
sudo systemctl start mongod
```

### Erro de importação
```bash
# Verificar sintaxe JSON
cat companies.json | jq .
cat contacts.json | jq .
```

### Performance
- Os índices são criados automaticamente
- Para grandes volumes, considere usar `bulkWrite()`
- Monitore com `db.stats()` e `db.companies.stats()`

## 📈 Próximos Passos

1. **Testar API**: Use os dados para testar endpoints
2. **Validar Matching**: Verifique algoritmo de relacionamento
3. **Performance**: Monitore consultas com `explain()`
4. **Backup**: Configure backup automático dos dados

---

**🎯 Agora você tem dados completos para testar toda a funcionalidade do sistema CRM!**