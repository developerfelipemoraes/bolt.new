# 🔐 CREDENCIAIS DE ACESSO - SISTEMA CRM

## ✅ SITUAÇÃO ATUAL

**TUDO PRONTO!** Sistema 100% integrado com Supabase.

---

## 🎯 ACESSO RÁPIDO

### 1️⃣ Resetar Senha (Solução mais rápida)

**Link direto do Dashboard:**
👉 https://supabase.com/dashboard/project/yalyiockckqrmseuaivm/auth/users

**Passos:**
1. Faça login no Supabase Dashboard
2. Vá em **Authentication** → **Users**
3. Encontre o email: `felipeaneas@gmail.com`
4. Clique nos 3 pontos (⋮) → **"Reset Password"**
5. Ou clique no email → campo "New Password" → Digite nova senha → Save

**Depois faça login:**
- Email: `felipeaneas@gmail.com`
- Senha: (a que você definiu)

---

### 2️⃣ Criar Novo Usuário de Teste

**No Supabase Dashboard:**

1. Vá em **Authentication** → **Users** → **"Add user"**
2. Preencha:
   ```
   Email: teste@aurovel.com
   Password: teste123
   ☑️ Auto Confirm User (IMPORTANTE!)
   ```
3. Clique em **"Create user"**
4. **Copie o UUID** do usuário criado (ex: abc123-def456...)

**Depois, vá em SQL Editor e execute:**

```sql
INSERT INTO system_users (
  id,
  organization_id,
  email,
  full_name,
  role,
  is_active
) VALUES (
  'COLE_O_UUID_AQUI',
  '00000000-0000-0000-0000-000000000001',
  'teste@aurovel.com',
  'Usuário Teste',
  'super_admin',
  true
);
```

**Pronto! Faça login:**
- Email: `teste@aurovel.com`
- Senha: `teste123`

---

## 📋 DADOS DO SISTEMA

### Supabase
- **URL:** https://yalyiockckqrmseuaivm.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/yalyiockckqrmseuaivm

### Organização
- **Nome:** Aurovel
- **ID:** `00000000-0000-0000-0000-000000000001`

### Usuário Cadastrado
- **Email:** felipeaneas@gmail.com
- **Nome:** Felipe Aneas
- **Role:** super_admin
- **Status:** ✅ Ativo
- **UUID:** `52e95efe-d3de-4ad2-b137-31cb00988979`

---

## 🚀 O QUE ESTÁ FUNCIONANDO

### ✅ Backend (100% Supabase)
- ✅ Autenticação via Supabase Auth
- ✅ Empresas (companies)
- ✅ Contatos (contacts)
- ✅ Veículos (vehicles)
- ✅ Modelos Chassi (chassis_models)
- ✅ Modelos Carroceria (bodywork_models)
- ✅ Categorias/Subcategorias
- ✅ Oportunidades (sales_opportunities)
- ✅ Pipelines (sales_pipelines)
- ✅ Multi-tenancy (organizations)
- ✅ RLS (Row Level Security)

### ✅ Serviços Integrados
- ✅ userService → Supabase Auth ✅
- ✅ companyService → Supabase ✅
- ✅ contactService → Supabase ✅
- ✅ chassisService → Supabase ✅
- ✅ bodyworkService → Supabase ✅
- ✅ vehicleService → Supabase ✅

### ✅ Frontend (UX)
- ✅ Sistema de Login
- ✅ Gerenciamento de Empresas
- ✅ Gerenciamento de Contatos
- ✅ Cadastro de Veículos
- ✅ Gestão de Modelos
- ✅ Pipeline de Vendas
- ✅ Sistema de Permissões

---

## 🎭 ROLES DISPONÍVEIS

| Role | Descrição | Acesso |
|------|-----------|--------|
| **super_admin** | Super administrador | TOTAL |
| **company_admin** | Admin da empresa | Completo (sua org) |
| **sales** | Vendedor | Limitado (vendas) |
| **support** | Suporte | Limitado (suporte) |

---

## 🔧 VERIFICAR SE ESTÁ TUDO OK

Execute no **SQL Editor** do Supabase:

```sql
-- Verificar usuário
SELECT
  u.email,
  su.full_name,
  su.role,
  su.is_active,
  o.name as organization
FROM auth.users u
JOIN system_users su ON u.id = su.id
JOIN organizations o ON su.organization_id = o.id
WHERE u.email = 'felipeaneas@gmail.com';
```

Deve retornar:
```
email: felipeaneas@gmail.com
full_name: Felipe Aneas
role: super_admin
is_active: true
organization: Aurovel
```

---

## ❓ PROBLEMAS?

### "Email ou senha incorretos"
→ Resete a senha pelo Dashboard

### "Usuário não encontrado"
→ Verifique se existe em `system_users`

### "Token inválido"
→ Limpe o cache do navegador (Ctrl+Shift+Del)

### "Erro de conexão"
→ Verifique o arquivo `.env`:
```
VITE_SUPABASE_URL=https://yalyiockckqrmseuaivm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎉 RESUMO

**Para fazer login:**

1. **Opção A (Resetar senha):**
   - Acesse: https://supabase.com/dashboard/project/yalyiockckqrmseuaivm/auth/users
   - Resete a senha do email: felipeaneas@gmail.com
   - Faça login no sistema

2. **Opção B (Criar novo usuário):**
   - Crie via Dashboard (instruções acima)
   - Registre em system_users (SQL acima)
   - Faça login

**Sistema está 100% funcional e integrado com Supabase!** 🚀
