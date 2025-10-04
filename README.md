# 🚀 Sistema CRM Profissional

Sistema completo de CRM (Customer Relationship Management) desenvolvido com React, TypeScript e Tailwind CSS, focado no mercado brasileiro com validações específicas e funcionalidades avançadas.

## ✨ Funcionalidades Principais

### 📊 **Dashboard Executivo**
- KPIs em tempo real (contatos, empresas, veículos, receita)
- Pipeline de vendas visual com estágios
- Alertas inteligentes e notificações
- Atividade recente do sistema
- Ações rápidas para todos os módulos

### 👥 **Gestão de Contatos (PF)**
- **Wizard completo** com 9 etapas
- Validação de CPF em tempo real
- Perfil 360° com score KYC
- Gestão de documentos e anexos
- Compliance e declarações PEP

### 🏢 **Gestão de Empresas (PJ)**
- **Wizard completo** com 11 etapas
- Validação de CNPJ em tempo real
- Estrutura societária completa
- Gestão de licenças e seguros
- Compliance LGPD

### 🚗 **Gestão de Veículos**
- **Wizard completo** com 11 etapas
- Categorização avançada (ônibus, caminhões, etc.)
- Upload de mídia (fotos e vídeos)
- Configuração de opcionais
- Localização geográfica

### 🤖 **Smart Matching**
- Algoritmo de IA para correspondência PJ × PF
- Score de matching (60-100 pontos)
- Análise por domínio de email, nome da empresa e cargo
- Visualização de vínculos automáticos

### 💼 **Vendas & Pipeline**
- Funil de vendas completo
- Gestão de oportunidades
- Atividades de vendas (calls, emails, meetings)
- Métricas avançadas e conversão

### 📈 **Relatórios & Analytics**
- Dashboards analíticos com insights
- Segmentação por estado, segmento, categoria
- Tendências e projeções de crescimento
- Performance de vendedores e produtos

### 📅 **Tarefas & Atividades**
- Agenda integrada com calendário
- Gestão de tarefas por prioridade
- Follow-ups automáticos
- Feed de atividades em tempo real

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Build**: Vite
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM
- **State**: React Query + Context API
- **Notifications**: Sonner

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd sistema-crm

# Instale as dependências
pnpm install
# ou
npm install

# Execute o projeto
pnpm dev
# ou
npm run dev
```

### Acesso
- **URL**: http://localhost:5173
- **Login Demo**: Use as credenciais na tela de login

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Autenticação e controle de acesso
│   ├── layout/          # Layouts principais
│   ├── ui/              # Componentes UI (Shadcn/ui)
│   ├── contact-wizard/  # Wizard de contatos (9 etapas)
│   ├── wizard-contas-contatos/ # Wizard de empresas (11 etapas)
│   ├── wizard-veiculos/ # Wizard de veículos (11 etapas)
│   └── CRMComponents/   # Biblioteca standalone
├── pages/               # Páginas principais
├── types/               # Definições TypeScript
├── utils/               # Utilitários e validações
├── hooks/               # Custom hooks
├── services/            # Serviços de API
└── data/                # Dados estáticos
```

## 🎯 Funcionalidades Específicas

### **Validações Brasileiras**
- ✅ CPF com dígito verificador
- ✅ CNPJ com dígito verificador  
- ✅ CEP com integração ViaCEP
- ✅ Telefones com formatação automática

### **Sistema de Autenticação**
- 🔐 Multi-empresa (Aurovel + Clientes)
- 👑 Super Admin (controle total)
- 🏢 Admin por empresa
- 👤 Usuários com permissões específicas

### **Algoritmo de Matching**
- 🎯 Score baseado em múltiplos critérios:
  - 60 pontos: Mesmo domínio de email
  - 30 pontos: Nome da empresa similar
  - 10 pontos: Cargo corporativo
  - Bônus: Localização, telefone, etc.

## 📊 Dados de Demonstração

O sistema inclui dados completos para teste:
- **3 empresas** (TechCorp, LogiBrasil, InovaCorp)
- **6 contatos** executivos
- **Relacionamentos** com scores 93-98%
- **Todos os campos** preenchidos

### Carregar Dados de Teste
```bash
# Os dados estão em /seed-data/
# Veja DOWNLOAD_SEED_DATA.md para instruções
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# API Backend (opcional)
VITE_API_URL=http://localhost:3001

# Configurações do sistema
VITE_APP_NAME=Sistema CRM
VITE_COMPANY_NAME=Sua Empresa
```

### Customização
- **Cores**: Edite `src/index.css` (CSS variables)
- **Componentes**: Todos em `src/components/ui/`
- **Temas**: Suporte a dark/light mode
- **Logos**: Substitua em `public/`

## 🚀 Deploy

### Build para Produção
```bash
pnpm build
# ou
npm run build
```

### Deploy Automático
O projeto está configurado para deploy em:
- Vercel
- Netlify  
- GitHub Pages
- Qualquer hosting estático

## 🧪 Testes

```bash
# Executar testes (quando implementados)
pnpm test

# Lint do código
pnpm lint
```

## 📚 Documentação

### Componentes CRM
- Todos os componentes estão documentados em `src/components/CRMComponents/README.md`
- Biblioteca standalone pronta para reutilização
- Tipos TypeScript completos

### API Integration
- Serviço de API em `src/services/api.ts`
- Hooks customizados em `src/hooks/`
- Tratamento de erros centralizado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para dúvidas e suporte:
- 📧 Email: suporte@empresa.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: https://empresa.com.br

---

**Desenvolvido com ❤️ para o mercado brasileiro**

### 🏆 Características Destacadas

- ✅ **100% Responsivo** - Funciona em desktop, tablet e mobile
- ✅ **Validações Brasileiras** - CPF, CNPJ, CEP nativos
- ✅ **Multi-empresa** - Suporte a múltiplas organizações
- ✅ **IA Integrada** - Matching automático inteligente
- ✅ **Performance** - Otimizado para grandes volumes de dados
- ✅ **Acessibilidade** - Compatível com leitores de tela
- ✅ **PWA Ready** - Pode ser instalado como app