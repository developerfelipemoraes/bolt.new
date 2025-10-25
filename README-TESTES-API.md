# 🧪 Testes da API de Veículos

Arquivos criados para facilitar os testes da nova estrutura de fotos originais separadas.

## 📁 Arquivos Disponíveis

### 1. `exemplo-payload-vehicle.json`
**Payload completo** com todos os campos preenchidos.

**Características:**
- ✅ 5 fotos internas
- ✅ 6 fotos externas
- ✅ 3 fotos de instrumentos
- ✅ 8 fotos tratadas
- ✅ 3 fotos de documentos
- ✅ Sistema de comissões (3 participantes)
- ✅ Fornecedor empresa
- ✅ Configuração completa de assentos
- ✅ Todos os opcionais

**Quando usar:** Teste completo de todos os recursos da API

---

### 2. `exemplo-payload-vehicle-minimo.json`
**Payload mínimo** com apenas campos obrigatórios.

**Características:**
- ✅ 2 fotos internas
- ✅ 3 fotos externas
- ✅ 1 foto de instrumentos
- ✅ 3 fotos tratadas
- ✅ 1 foto de documento
- ❌ Sem comissões
- ❌ Sem fornecedor
- ✅ Opcionais básicos

**Quando usar:** Teste rápido ou cadastro simples

---

### 3. `test-api-vehicle.js`
**Script Node.js** para testar a API de forma automatizada.

**Funcionalidades:**
- ✅ Validação do payload antes de enviar
- ✅ Envio da requisição POST /api/vehicles
- ✅ Exibição detalhada da resposta
- ✅ Tratamento de erros
- ✅ Suporte a payload completo ou mínimo

---

### 4. `TESTE-API-PAYLOAD.md`
**Documentação completa** de como testar a API.

**Conteúdo:**
- 📖 Visão geral da nova estrutura
- 🔑 Endpoints e autenticação
- 📄 Exemplos de payload
- 🧪 Passo a passo dos testes
- ✅ Cenários de validação
- 🔄 Retrocompatibilidade
- 🐛 Troubleshooting

---

## 🚀 Como Usar

### Opção 1: Script Automatizado (Recomendado)

```bash
# Teste com payload mínimo
node test-api-vehicle.js --token=SEU_TOKEN --company=ID_EMPRESA

# Teste com payload completo
node test-api-vehicle.js --token=SEU_TOKEN --company=ID_EMPRESA --full

# Ver ajuda
node test-api-vehicle.js --help
```

**O script irá:**
1. Carregar o payload
2. Validar estrutura
3. Exibir resumo
4. Enviar requisição
5. Mostrar resultado

---

### Opção 2: cURL Manual

```bash
# Criar veículo
curl -X POST https://vehicles.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/vehicles \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Company-ID: ID_EMPRESA" \
  -d @exemplo-payload-vehicle-minimo.json
```

---

### Opção 3: Postman/Insomnia

1. Importe os arquivos JSON
2. Configure headers:
   - `Authorization: Bearer SEU_TOKEN`
   - `Content-Type: application/json`
   - `X-Company-ID: ID_EMPRESA`
3. Envie POST para `/api/vehicles`

---

## 📊 Estrutura das Fotos (Nova Divisão)

```json
{
  "mediaFiles": {
    "originalPhotosInterior": [
      "https://storage.../interior-foto1.jpg",
      "https://storage.../interior-foto2.jpg"
    ],
    "originalPhotosExterior": [
      "https://storage.../exterior-foto1.jpg",
      "https://storage.../exterior-foto2.jpg",
      "https://storage.../exterior-foto3.jpg"
    ],
    "originalPhotosInstruments": [
      "https://storage.../painel.jpg"
    ],
    "treatedPhotos": [
      "https://storage.../destaque.jpg",
      "https://storage.../foto1.jpg"
    ],
    "documentPhotos": [
      "https://storage.../crlv.jpg"
    ],
    "video": null
  }
}
```

### 🎯 Diferença do Formato Antigo

**❌ Formato Antigo:**
```json
{
  "mediaFiles": {
    "originalPhotos": ["todas", "as", "fotos", "misturadas"]
  }
}
```

**✅ Formato Novo:**
```json
{
  "mediaFiles": {
    "originalPhotosInterior": ["foto1", "foto2"],
    "originalPhotosExterior": ["foto3", "foto4"],
    "originalPhotosInstruments": ["foto5"]
  }
}
```

---

## ✅ Checklist de Validações

### Backend deve validar:

- [ ] `vehicleType.id` existe
- [ ] `category.id` existe
- [ ] `chassisInfo` completo
- [ ] `vehicleData.fabricationYear` válido
- [ ] `vehicleData.licensePlate` válido
- [ ] `productIdentification.title` não vazio
- [ ] `mediaFiles` com arrays (podem estar vazios)
- [ ] URLs em `mediaFiles` são strings válidas
- [ ] `secondaryInfo.condition` é 'new', 'used' ou 'semi-new'
- [ ] `optionals` com todos os campos booleanos
- [ ] `location` com cidade e estado
- [ ] Se `commission` presente:
  - [ ] Participantes somam 100%
  - [ ] Tem ao menos 1 "Aurovel"
  - [ ] Valores >= 0

---

## 🔄 Retrocompatibilidade

A API deve aceitar **ambos os formatos**:

```javascript
// Formato novo (preferido)
if (payload.mediaFiles.originalPhotosInterior) {
  // Processar novo formato
}
// Formato legado (ainda suportado)
else if (payload.mediaFiles.originalPhotos) {
  // Migrar para originalPhotosExterior
  payload.mediaFiles.originalPhotosExterior = payload.mediaFiles.originalPhotos;
  payload.mediaFiles.originalPhotosInterior = [];
  payload.mediaFiles.originalPhotosInstruments = [];
}
```

---

## 📞 Troubleshooting

### Erro: "Cannot read property 'originalPhotosInterior'"

**Solução:** Certifique-se que `mediaFiles` existe e tem os campos:
```json
{
  "mediaFiles": {
    "originalPhotosInterior": [],
    "originalPhotosExterior": [],
    "originalPhotosInstruments": [],
    "treatedPhotos": [],
    "documentPhotos": []
  }
}
```

### Erro: "Total de comissões deve ser 100%"

**Solução:** Verifique `commission.participants`:
```json
{
  "participants": [
    {"role": "Aurovel", "percent": 70},
    {"role": "Corretor", "percent": 25},
    {"role": "Indicador", "percent": 5}
  ]
}
// Total = 70 + 25 + 5 = 100 ✅
```

### Erro: "X-Company-ID is required"

**Solução:** Adicione o header:
```bash
-H "X-Company-ID: sua-empresa-id"
```

---

## 📚 Documentação Adicional

- Ver `TESTE-API-PAYLOAD.md` para guia detalhado
- Ver exemplos JSON para estrutura completa
- Consultar tipos em `src/types/vehicle.ts`

---

## 🎯 Próximos Passos

Após testar com sucesso:

1. ✅ Validar que fotos são salvas nas 3 categorias separadas
2. ✅ Testar busca/listagem de veículos
3. ✅ Testar edição de veículo existente
4. ✅ Verificar relatórios/exportações
5. ✅ Confirmar retrocompatibilidade com dados antigos

---

## 💡 Dicas

- Use `--full` no script para teste completo
- Teste primeiro com payload mínimo
- Valide URLs das imagens antes de enviar
- Guarde o `id` retornado para testes de edição
- Verifique logs do backend para debugging

---

Boa sorte nos testes! 🚀
