import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yalyiockckqrmseuaivm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbHlpb2NrY2txcm1zZXVhaXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDEwNTYsImV4cCI6MjA4MDc3NzA1Nn0.KSM3IWZTNDtVRU4s3l2ksNp7x4nxAGtv5vV5i2Owjko';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  const email = 'teste@aurovel.com';
  const password = 'teste123';
  const fullName = 'Usuário Teste';
  const organizationId = '00000000-0000-0000-0000-000000000001';

  console.log('Criando usuário de teste...');
  console.log('Email:', email);
  console.log('Senha:', password);

  // 1. Criar usuário no Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Erro ao criar usuário no Auth:', authError);

    // Verificar se o usuário já existe
    if (authError.message.includes('already registered')) {
      console.log('\n⚠️  Este email já está registrado!');
      console.log('Você pode fazer login com:');
      console.log('📧 Email:', email);
      console.log('🔑 Senha: teste123 (se não alterada)');
      console.log('\nOu use o fluxo de "Esqueceu sua senha?" para resetar.');
      return;
    }
    return;
  }

  if (!authData.user) {
    console.error('Usuário não foi criado');
    return;
  }

  console.log('✅ Usuário criado no Auth:', authData.user.id);

  // 2. Criar registro em system_users
  const { error: insertError } = await supabase
    .from('system_users')
    .insert({
      id: authData.user.id,
      organization_id: organizationId,
      email,
      full_name: fullName,
      role: 'admin',
      is_active: true,
    });

  if (insertError) {
    console.error('Erro ao criar registro em system_users:', insertError);
    return;
  }

  console.log('✅ Registro criado em system_users');

  // Fazer logout para não ficar autenticado
  await supabase.auth.signOut();

  console.log('\n🎉 Usuário de teste criado com sucesso!');
  console.log('\n═══════════════════════════════════════');
  console.log('CREDENCIAIS DE TESTE');
  console.log('═══════════════════════════════════════');
  console.log('📧 Email:      teste@aurovel.com');
  console.log('🔑 Senha:      teste123');
  console.log('👤 Nome:       Usuário Teste');
  console.log('🏢 Empresa:    Aurovel');
  console.log('⚡ Perfil:     Admin');
  console.log('═══════════════════════════════════════');
  console.log('\n✅ Você pode fazer login com essas credenciais!');
  console.log('✅ Depois teste o fluxo de reset de senha!');
}

createTestUser().catch(console.error);
