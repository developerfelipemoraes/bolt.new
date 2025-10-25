#!/usr/bin/env node

/**
 * Script de Teste - API de Veículos
 *
 * Uso:
 *   node test-api-vehicle.js --token=SEU_TOKEN --company=ID_EMPRESA [--full]
 *
 * Flags:
 *   --token    : Token de autenticação (obrigatório)
 *   --company  : ID da empresa (obrigatório)
 *   --full     : Usar payload completo (padrão: mínimo)
 *   --help     : Mostra esta ajuda
 */

const fs = require('fs');
const https = require('https');

// Configuração
const API_BASE_URL = 'https://vehicles.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api';

// Parse argumentos
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    acc[key] = value || true;
  }
  return acc;
}, {});

// Validação
if (args.help) {
  console.log(`
🚀 Script de Teste - API de Veículos

Uso:
  node test-api-vehicle.js --token=SEU_TOKEN --company=ID_EMPRESA [--full]

Flags:
  --token    : Token de autenticação (obrigatório)
  --company  : ID da empresa (obrigatório)
  --full     : Usar payload completo (padrão: mínimo)
  --help     : Mostra esta ajuda

Exemplos:
  node test-api-vehicle.js --token=abc123 --company=comp-001
  node test-api-vehicle.js --token=abc123 --company=comp-001 --full
  `);
  process.exit(0);
}

if (!args.token) {
  console.error('❌ Erro: --token é obrigatório');
  console.log('Use --help para ver instruções');
  process.exit(1);
}

if (!args.company) {
  console.error('❌ Erro: --company é obrigatório');
  console.log('Use --help para ver instruções');
  process.exit(1);
}

// Carregar payload
const payloadFile = args.full
  ? './exemplo-payload-vehicle.json'
  : './exemplo-payload-vehicle-minimo.json';

console.log(`\n📄 Carregando payload: ${payloadFile}`);

let payload;
try {
  payload = JSON.parse(fs.readFileSync(payloadFile, 'utf8'));
} catch (error) {
  console.error(`❌ Erro ao ler arquivo: ${error.message}`);
  process.exit(1);
}

// Função auxiliar para fazer requisição
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          reject(new Error(`Erro ao parsear resposta: ${error.message}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Testar criação de veículo
async function testCreateVehicle() {
  console.log('\n🚀 Testando criação de veículo...\n');

  console.log('📊 Resumo do Payload:');
  console.log(`   • Tipo: ${payload.vehicleType.name}`);
  console.log(`   • Categoria: ${payload.category.name}`);
  console.log(`   • Modelo: ${payload.productIdentification.title}`);
  console.log(`   • Ano: ${payload.vehicleData.fabricationYear}/${payload.vehicleData.modelYear}`);
  console.log(`   • Placa: ${payload.vehicleData.licensePlate}`);
  console.log(`   • Preço: R$ ${payload.vehicleData.price.toLocaleString('pt-BR')}`);

  console.log('\n📷 Fotos:');
  console.log(`   • Internas: ${payload.mediaFiles.originalPhotosInterior.length}`);
  console.log(`   • Externas: ${payload.mediaFiles.originalPhotosExterior.length}`);
  console.log(`   • Instrumentos: ${payload.mediaFiles.originalPhotosInstruments.length}`);
  console.log(`   • Tratadas: ${payload.mediaFiles.treatedPhotos.length}`);
  console.log(`   • Documentos: ${payload.mediaFiles.documentPhotos.length}`);

  if (payload.commission) {
    console.log('\n💰 Comissão:');
    console.log(`   • Modo: ${payload.commission.commissionMode}`);
    console.log(`   • Valor Bruto: R$ ${payload.commission.valor_comissao_bruta.toLocaleString('pt-BR')}`);
    console.log(`   • Participantes: ${payload.commission.participants.length}`);
  }

  if (payload.supplier) {
    console.log('\n🏢 Fornecedor:');
    console.log(`   • Nome: ${payload.supplier.companyName || payload.supplier.fullName}`);
    console.log(`   • Tipo: ${payload.supplier.supplierType}`);
  }

  console.log('\n⏳ Enviando requisição...\n');

  const url = new URL(`${API_BASE_URL}/vehicles`);
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${args.token}`,
      'Content-Type': 'application/json',
      'X-Company-ID': args.company,
      'API-Version': 'v1'
    }
  };

  try {
    const response = await makeRequest(url, options, payload);

    if (response.status === 200 || response.status === 201) {
      console.log('✅ Veículo criado com sucesso!\n');
      console.log('📋 Resposta da API:');
      console.log(JSON.stringify(response.body, null, 2));

      if (response.body && response.body.id) {
        console.log(`\n🆔 ID do veículo: ${response.body.id}`);
      }
    } else {
      console.error(`❌ Erro na API (${response.status}):\n`);
      console.error(JSON.stringify(response.body, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Erro na requisição: ${error.message}`);
    process.exit(1);
  }
}

// Validar payload antes de enviar
function validatePayload() {
  console.log('\n🔍 Validando payload...');

  const errors = [];

  // Validações básicas
  if (!payload.vehicleType || !payload.vehicleType.id) {
    errors.push('vehicleType.id é obrigatório');
  }

  if (!payload.category || !payload.category.id) {
    errors.push('category.id é obrigatório');
  }

  if (!payload.chassisInfo) {
    errors.push('chassisInfo é obrigatório');
  }

  if (!payload.vehicleData) {
    errors.push('vehicleData é obrigatório');
  }

  if (!payload.productIdentification || !payload.productIdentification.title) {
    errors.push('productIdentification.title é obrigatório');
  }

  if (!payload.mediaFiles) {
    errors.push('mediaFiles é obrigatório');
  } else {
    // Validar que os arrays existem
    const requiredArrays = [
      'originalPhotosInterior',
      'originalPhotosExterior',
      'originalPhotosInstruments',
      'treatedPhotos',
      'documentPhotos'
    ];

    requiredArrays.forEach(field => {
      if (!Array.isArray(payload.mediaFiles[field])) {
        errors.push(`mediaFiles.${field} deve ser um array`);
      }
    });
  }

  if (!payload.secondaryInfo) {
    errors.push('secondaryInfo é obrigatório');
  }

  if (!payload.optionals) {
    errors.push('optionals é obrigatório');
  }

  if (!payload.location) {
    errors.push('location é obrigatório');
  }

  // Validar comissões se presente
  if (payload.commission) {
    if (!Array.isArray(payload.commission.participants)) {
      errors.push('commission.participants deve ser um array');
    } else {
      const totalPercent = payload.commission.participants.reduce(
        (sum, p) => sum + p.percent,
        0
      );
      if (Math.abs(totalPercent - 100) > 0.01) {
        errors.push(`Total de comissões deve ser 100% (atual: ${totalPercent}%)`);
      }

      const hasAurovel = payload.commission.participants.some(
        p => p.role === 'Aurovel'
      );
      if (!hasAurovel) {
        errors.push('Deve haver ao menos um participante "Aurovel"');
      }
    }
  }

  if (errors.length > 0) {
    console.error('\n❌ Erros encontrados:');
    errors.forEach(err => console.error(`   • ${err}`));
    process.exit(1);
  }

  console.log('✅ Payload válido!\n');
}

// Executar
(async () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🚌 Teste de API - Criação de Veículo ║');
  console.log('╚════════════════════════════════════════╝');

  validatePayload();
  await testCreateVehicle();

  console.log('\n✅ Teste concluído com sucesso!\n');
})();
