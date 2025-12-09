# 🚀 Como Fazer Login no Sistema - GUIA RÁPIDO

## ✅ Situação Atual

Você tem um usuário configurado no banco de dados:
- **Email:** `felipeaneas@gmail.com`
- **Perfil:** Super Admin (acesso total)
- **Status:** Ativo ✅

**PROBLEMA:** A senha precisa ser definida/resetada.

---

## 🔐 SOLUÇÃO RÁPIDA - Resetar Senha (3 passos)

### Passo 1: Acesse o Supabase Dashboard
👉 **Link direto:** https://supabase.com/dashboard/project/yalyiockckqrmseuaivm

Faça login com sua conta do Supabase.

---

### Passo 2: Vá para Authentication → Users
No menu lateral, clique em:
1. **Authentication** (ícone de usuário)
2. **Users**

Você verá o usuário: `felipeaneas@gmail.com`

---

### Passo 3: Resetar a Senha
1. Clique nos **três pontos (⋮)** ao lado do email
2. Selecione **"Reset Password"** ou **"Send reset password email"**
3. Opções:
   - **Enviar email:** Você receberá um email para redefinir a senha
   - **Definir manualmente:** No dashboard, você pode definir uma senha diretamente

**OU** se preferir definir a senha manualmente:
1. Clique no email do usuário
2. No formulário de edição, há um campo "New Password"
3. Digite a nova senha
4. Clique em **"Save"**

---

## 🎯 Fazer Login no Sistema

Após definir a senha:

1. Abra o sistema: `http://localhost:5173` (ou onde estiver rodando)
2. Digite:
   - **Email:** `felipeaneas@gmail.com`
   - **Senha:** A senha que você acabou de definir
3. Clique em **"Entrar"**

---

## 🆕 Opção 2: Criar Novo Usuário (se preferir)

### No Supabase Dashboard:

1. Vá em **Authentication** → **Users**
2. Clique em **"Add user"**
3. Preencha:
   ```
   Email: seu-email@exemplo.com
   Password: sua-senha-123
   ☑️ Auto Confirm User (MARQUE ISSO!)
   ```
4. Clique em **"Create user"**
5. **IMPORTANTE:** Copie o UUID do usuário criado (ex: `abc123-def456-...`)

### Registrar no Sistema:

Vá para **SQL Editor** no Supabase e execute:

```sql
INSERT INTO system_users (id, organization_id, email, full_name, role, is_active)
VALUES (
  'COLE_O_UUID_AQUI',  -- UUID do usuário criado acima
  '00000000-0000-0000-0000-000000000001',
  'seu-email@exemplo.com',
  'Seu Nome',
  'super_admin',
  true
);
```

Pronto! Agora pode fazer login com esse novo usuário.

---

## 📋 Resumo dos Dados

**Projeto Supabase:**
- URL: https://yalyiockckqrmseuaivm.supabase.co
- Dashboard: https://supabase.com/dashboard/project/yalyiockckqrmseuaivm

**Organização Criada:**
- Nome: Aurovel
- ID: `00000000-0000-0000-0000-000000000001`

**Usuário Existente:**
- Email: felipeaneas@gmail.com
- Role: super_admin
- Status: Ativo

---

## ❓ Problemas Comuns

### "Email ou senha incorretos"
- Verifique se a senha foi definida corretamente no Supabase
- Tente resetar a senha novamente

### "Usuário não encontrado"
- Verifique se existe registro em `system_users`
- Execute a query de verificação:
```sql
SELECT * FROM system_users WHERE email = 'seu-email@exemplo.com';
```

### "Token inválido"
- Limpe o cache do navegador
- Faça logout e login novamente

---

## 🎉 Pronto!

Após seguir os passos acima, você terá acesso completo ao sistema com todas as funcionalidades de Super Admin.
