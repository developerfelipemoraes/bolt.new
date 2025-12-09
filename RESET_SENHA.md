# Fluxo de Reset de Senha

## Como Funciona

O sistema agora possui um fluxo completo de recuperação de senha implementado com Supabase Auth.

## Para Usuários

### Solicitando Reset de Senha

1. Na tela de login, clique em "Esqueceu sua senha?"
2. Digite seu email cadastrado
3. Clique em "Enviar Link"
4. Você receberá um email com um link de recuperação

### Redefinindo a Senha

1. Abra o email e clique no link de recuperação
2. Você será redirecionado para a página de redefinição de senha
3. Digite sua nova senha (mínimo 6 caracteres)
4. Confirme a nova senha
5. Clique em "Atualizar Senha"
6. Você será redirecionado para a tela de login
7. Faça login com sua nova senha

## Para Desenvolvedores

### Componentes Criados

1. **ResetPassword.tsx** (`src/pages/ResetPassword.tsx`)
   - Página dedicada para redefinição de senha
   - Valida a sessão de recuperação
   - Permite que o usuário defina uma nova senha
   - Possui validação de senha e confirmação

2. **App.tsx** (Atualizado)
   - Detecta automaticamente quando o usuário clica no link de recuperação
   - Processa o token de recovery da URL (`#access_token=...&type=recovery`)
   - Estabelece a sessão temporária com o token
   - Exibe a página de reset de senha
   - Gerencia os estados: login, reset, app

### Fluxo Técnico

1. **Solicitação de Reset:**
   ```typescript
   userService.resetPassword(email)
   // Envia email via supabase.auth.resetPasswordForEmail()
   // Redireciona para window.location.origin
   ```

2. **Clique no Link:**
   - Usuário clica no link do email
   - Supabase redireciona para: `http://localhost:3000/#access_token=...&type=recovery&refresh_token=...`

3. **Detecção e Processamento:**
   ```typescript
   // App.tsx useEffect detecta type=recovery na URL
   const hashParams = new URLSearchParams(window.location.hash.substring(1));
   if (type === 'recovery') {
     // Estabelece sessão temporária
     await supabase.auth.setSession({ access_token, refresh_token });
     // Mostra página de reset
     setViewMode('reset');
   }
   ```

4. **Atualização de Senha:**
   ```typescript
   userService.updatePassword(newPassword)
   // Atualiza senha via supabase.auth.updateUser({ password })
   ```

5. **Logout e Login:**
   - Após atualizar a senha, o sistema faz logout
   - Usuário é redirecionado para tela de login
   - Pode fazer login com a nova senha

### Configurações Necessárias

#### No Dashboard do Supabase

1. Acesse: Authentication > URL Configuration
2. Configure o "Site URL" para sua URL de produção
3. Adicione a URL em "Redirect URLs"
   - Desenvolvimento: `http://localhost:3000`
   - Produção: `https://seu-dominio.com`

#### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Segurança

- O token de recovery tem validade limitada (1 hora por padrão)
- A sessão é temporária e expira após o uso
- O sistema limpa a URL após processar o token
- A senha é validada no cliente e no servidor
- O logout é automático após a redefinição

### Customização

Para customizar o email de recuperação:

1. Acesse: Authentication > Email Templates
2. Edite o template "Reset Password"
3. O link deve conter: `{{ .ConfirmationURL }}`

### Troubleshooting

**Problema:** "Link de recuperação inválido ou expirado"
- **Causa:** Token expirado ou sessão inválida
- **Solução:** Solicite um novo link de recuperação

**Problema:** Email não chega
- **Causa:** Verifique se o email está cadastrado
- **Solução:** Verifique spam ou solicite novamente

**Problema:** Redirect vai para URL errada
- **Causa:** URL não configurada no Supabase
- **Solução:** Adicione a URL nas configurações do Supabase

## Testes

### Testar Localmente

1. Inicie o servidor de desenvolvimento: `npm run dev`
2. Acesse a tela de login
3. Clique em "Esqueceu sua senha?"
4. Digite um email cadastrado
5. Verifique sua caixa de entrada
6. Clique no link do email
7. Defina uma nova senha
8. Faça login com a nova senha

## Melhorias Futuras

- [ ] Adicionar rate limiting para solicitações de reset
- [ ] Adicionar força da senha com barra de progresso
- [ ] Adicionar verificação de senha comprometida (HIBP)
- [ ] Adicionar histórico de senhas (não permitir reutilização)
- [ ] Adicionar 2FA (autenticação em dois fatores)
