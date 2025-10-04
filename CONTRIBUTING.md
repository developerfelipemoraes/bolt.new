# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o Sistema CRM Profissional! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

Este projeto adere ao código de conduta. Ao participar, você deve manter este padrão.

## 🚀 Como Contribuir

### 1. **Fork e Clone**
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/sistema-crm.git
cd sistema-crm

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/sistema-crm.git
```

### 2. **Configuração do Ambiente**
```bash
# Instale as dependências
pnpm install

# Execute o projeto
pnpm dev
```

### 3. **Criação de Branch**
```bash
# Crie uma branch para sua feature
git checkout -b feature/nome-da-feature

# Ou para correção de bug
git checkout -b fix/nome-do-bug
```

### 4. **Desenvolvimento**
- Siga os padrões de código existentes
- Mantenha a arquitetura modular
- Adicione testes quando necessário
- Documente mudanças significativas

### 5. **Commit e Push**
```bash
# Adicione suas mudanças
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"

# Push para seu fork
git push origin feature/nome-da-feature
```

### 6. **Pull Request**
- Abra um PR no repositório original
- Descreva claramente as mudanças
- Referencie issues relacionadas
- Aguarde review e feedback

## 📝 Padrões de Código

### **Estrutura de Arquivos**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Shadcn/ui)
│   ├── layout/         # Layouts da aplicação
│   └── [feature]/      # Componentes específicos por feature
├── pages/              # Páginas/rotas principais
├── hooks/              # Custom hooks
├── services/           # Serviços de API
├── types/              # Definições TypeScript
├── utils/              # Funções utilitárias
└── data/               # Dados estáticos
```

### **Convenções de Nomenclatura**
- **Componentes**: PascalCase (`ContactWizard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useContactApi.ts`)
- **Utilitários**: camelCase (`validateCPF.ts`)
- **Tipos**: PascalCase (`ContactData.ts`)

### **Padrões de Commit**
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

## 🧪 Testes

### **Executar Testes**
```bash
# Todos os testes
pnpm test

# Testes em watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### **Escrever Testes**
- Teste componentes críticos
- Teste validações brasileiras
- Teste fluxos de wizard
- Teste algoritmo de matching

## 📚 Documentação

### **Componentes**
- Documente props e tipos
- Adicione exemplos de uso
- Mantenha README atualizado

### **APIs**
- Documente endpoints
- Inclua exemplos de request/response
- Mantenha tipos TypeScript atualizados

## 🐛 Reportar Bugs

### **Template de Issue**
```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Reproduzir**
Passos para reproduzir:
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.0.0]
```

## 💡 Sugerir Funcionalidades

### **Template de Feature Request**
```markdown
**Funcionalidade Desejada**
Descrição clara da funcionalidade.

**Problema que Resolve**
Explique o problema que esta funcionalidade resolveria.

**Solução Proposta**
Descrição de como você imagina que funcionaria.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Contexto Adicional**
Qualquer outro contexto sobre a feature.
```

## 🔍 Code Review

### **Checklist do Reviewer**
- [ ] Código segue os padrões estabelecidos
- [ ] Funcionalidade está completa
- [ ] Testes passam
- [ ] Documentação atualizada
- [ ] Performance não foi impactada
- [ ] Acessibilidade mantida
- [ ] Responsividade verificada

### **Checklist do Autor**
- [ ] Código testado localmente
- [ ] Lint passou sem erros
- [ ] Build de produção funciona
- [ ] Documentação atualizada
- [ ] Changelog atualizado
- [ ] Screenshots/GIFs adicionados (se UI)

## 🏷️ Versionamento

Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

## 📞 Contato

- **Issues**: Use o GitHub Issues
- **Discussões**: GitHub Discussions
- **Email**: dev@empresa.com

---

**Obrigado por contribuir! 🙏**