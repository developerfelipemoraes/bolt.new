# 🔐 Credenciais de Acesso ao Sistema

## ✅ Usuário Configurado no Banco de Dados

### Dados do Usuário
- **Email:** `felipeaneas@gmail.com`
- **Nome:** Felipe Aneas
- **Role:** super_admin (Acesso total ao sistema)
- **Organização:** Aurovel
- **Status:** Ativo ✅

---

## 🔑 Como Configurar a Senha

### Opção 1: Resetar Senha via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Navegue até: **Authentication** → **Users**
4. Encontre o usuário: `felipeaneas@gmail.com`
5. Clique nos três pontos (⋮) ao lado do usuário
6. Selecione **"Reset Password"** ou **"Send password reset email"**
7. Defina uma nova senha

### Opção 2: Criar Novo Usuário via Interface do Sistema

Se preferir criar um novo usuário de teste:

1. No código, localize o arquivo: `src/components/auth/LoginComponent.tsx`
2. Adicione temporariamente um link de "Cadastrar"
3. Ou use o Supabase Dashboard para criar o usuário manualmente

---

## 📝 Como Criar Usuário via Supabase Dashboard

1. Acesse: **Authentication** → **Users**
2. Clique em **"Add user"** ou **"Invite user"**
3. Preencha:
   - **Email:** seu-email@exemplo.com
   - **Password:** sua-senha-segura
   - **Auto Confirm User:** ✅ (marque esta opção)
4. Clique em **"Create user"**
5. Após criar, execute este SQL no **SQL Editor**:

```sql
-- Registrar usuário no system_users
INSERT INTO system_users (
  id,
  organization_id,
  email,
  full_name,
  role,
  is_active
)
VALUES (
  'COLE_AQUI_O_UUID_DO_USUARIO',  -- Copie o ID do usuário criado
  '00000000-0000-0000-0000-000000000001',  -- ID da organização Aurovel
  'seu-email@exemplo.com',
  'Seu Nome Completo',
  'super_admin',  -- ou 'company_admin', 'sales', 'support'
  true
);
```

---

## 🎯 Roles Disponíveis

- **super_admin:** Acesso total (gerencia organizações)
- **company_admin:** Administrador da empresa
- **sales:** Equipe de vendas
- **support:** Suporte

---

## 🚀 Para Fazer Login

1. Abra o sistema no navegador
2. Use as credenciais criadas:
   - **Email:** felipeaneas@gmail.com (ou o email que você criou)
   - **Senha:** A senha que você definiu
3. Clique em **"Entrar"**

---

## ⚠️ Importante

- A senha NÃO está visível no banco de dados (é hasheada)
- Você precisa resetar/definir a senha via Supabase Dashboard
- O sistema usa Supabase Auth para autenticação segura
- Email de confirmação está DESABILITADO por padrão

---

## 🔧 Suporte

Se tiver problemas:
1. Verifique se o usuário existe em `auth.users`
2. Verifique se existe registro em `system_users`
3. Confirme que `is_active = true`
4. Tente resetar a senha via Dashboard
