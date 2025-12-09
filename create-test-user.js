import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yalyiockckqrmseuaivm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbHlpb2NrY2txcm1zZXVhaXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIwMTA1NiwiZXhwIjoyMDgwNzc3MDU2fQ.PNe6eQxl92VH7dQpDKCfVgzqV7q9w3JKC_8QAZUblCY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  const email = 'teste@aurovel.com';
  const password = 'teste123';
  const fullName = 'Usuário Teste';
  const organizationId = '00000000-0000-0000-0000-000000000001';

  console.log('Criando usuário de teste...');
  console.log('Email:', email);
  console.log('Senha:', password);

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName
    }
  });

  if (authError) {
    console.error('Erro ao criar usuário no Auth:', authError);
    return;
  }

  console.log('Usuário criado no Auth:', authData.user.id);

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

  console.log('\n✅ Usuário de teste criado com sucesso!');
  console.log('\n📧 Email:', email);
  console.log('🔑 Senha:', password);
  console.log('👤 Nome:', fullName);
  console.log('🏢 Organização: Aurovel');
  console.log('⚡ Perfil: Admin');
  console.log('\nVocê pode fazer login com essas credenciais e depois testar o reset de senha!');
}

createTestUser().catch(console.error);
