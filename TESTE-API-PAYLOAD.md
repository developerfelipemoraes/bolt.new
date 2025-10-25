# 🚀 Guia de Teste - API de Veículos com Nova Divisão de Imagens

## 📋 Visão Geral

A API agora suporta **três categorias separadas de fotos originais**:
- `originalPhotosInterior` - Fotos do interior do veículo
- `originalPhotosExterior` - Fotos da parte externa do veículo
- `originalPhotosInstruments` - Fotos do painel e instrumentos

---

## 🔑 Endpoints

### **POST** `/api/upload/images`
Faz upload de múltiplas imagens e retorna URLs.

**Headers:**
```json
{
  "Authorization": "Bearer SEU_TOKEN_AQUI"
}
```

**Body:** `multipart/form-data`
- Campo: `files` (múltiplos arquivos)
- Tipos aceitos: `image/jpeg`, `image/png`, `image/webp`

**Response:**
```json
{
  "urls": [
    "https://storage.exemplo.com/img1.jpg",
    "https://storage.exemplo.com/img2.jpg"
  ]
}
```

---

### **POST** `/api/vehicles`
Cria um novo veículo.

**Headers:**
```json
{
  "Authorization": "Bearer SEU_TOKEN_AQUI",
  "Content-Type": "application/json",
  "X-Company-ID": "ID_DA_EMPRESA"
}
```

**Body:** Ver exemplos abaixo

---

## 📄 Exemplos de Payload

### 1️⃣ **Payload Completo** (`exemplo-payload-vehicle.json`)

Exemplo com **todos os campos preenchidos**, incluindo:
- ✅ Três tipos de fotos originais (5 internas + 6 externas + 3 instrumentos)
- ✅ 8 fotos tratadas
- ✅ 3 fotos de documentos
- ✅ Configuração de assentos detalhada
- ✅ Sistema de comissões completo
- ✅ Fornecedor (empresa)
- ✅ Todos os opcionais

**Caso de uso:** Teste completo da API com todos os recursos

---

### 2️⃣ **Payload Mínimo** (`exemplo-payload-vehicle-minimo.json`)

Exemplo com **apenas campos obrigatórios**:
- ✅ 2 fotos internas + 3 externas + 1 instrumento
- ✅ 3 fotos tratadas
- ✅ 1 foto de documento
- ✅ Sem comissões
- ✅ Sem fornecedor
- ✅ Opcionais básicos

**Caso de uso:** Teste rápido ou cadastro simples

---

## 🧪 Como Testar

### **Passo 1: Upload das Imagens**

Primeiro, faça upload de todas as imagens:

```bash
# Upload fotos internas
curl -X POST https://vehicles.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/upload/images \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "files=@foto-interior-1.jpg" \
  -F "files=@foto-interior-2.jpg"
```

**Resposta:**
```json
{
  "urls": [
    "https://storage.../foto-interior-1.jpg",
    "https://storage.../foto-interior-2.jpg"
  ]
}
```

Repita para:
- Fotos externas
- Fotos de instrumentos
- Fotos tratadas
- Fotos de documentos

---

### **Passo 2: Montar o Payload**

Use as URLs retornadas para montar o `mediaFiles`:

```json
{
  "mediaFiles": {
    "originalPhotosInterior": [
      "https://storage.../foto-interior-1.jpg",
      "https://storage.../foto-interior-2.jpg"
    ],
    "originalPhotosExterior": [
      "https://storage.../foto-exterior-1.jpg",
      "https://storage.../foto-exterior-2.jpg",
      "https://storage.../foto-exterior-3.jpg"
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

---

### **Passo 3: Criar o Veículo**

```bash
curl -X POST https://vehicles.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/vehicles \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Company-ID: ID_DA_EMPRESA" \
  -d @exemplo-payload-vehicle-minimo.json
```

---

## ✅ Validações do Backend

O backend deve validar:

1. **Campos obrigatórios:**
   - `vehicleType`
   - `category`
   - `chassisInfo`
   - `vehicleData` (ano, placa, etc)
   - `productIdentification.title`
   - `secondaryInfo`
   - `optionals`
   - `location`

2. **MediaFiles:**
   - Arrays devem existir (podem estar vazios)
   - URLs devem ser strings válidas
   - Aceitar formato novo E legado (`originalPhotos`)

3. **Comissões (se presente):**
   - Total de participantes deve somar 100%
   - Deve ter ao menos 1 participante "Aurovel"
   - Valores devem ser >= 0

---

## 🔄 Retrocompatibilidade

O backend deve aceitar **ambos os formatos**:

### **Formato Novo** (preferido)
```json
{
  "mediaFiles": {
    "originalPhotosInterior": ["url1", "url2"],
    "originalPhotosExterior": ["url3", "url4"],
    "originalPhotosInstruments": ["url5"]
  }
}
```

### **Formato Legado** (ainda aceito)
```json
{
  "mediaFiles": {
    "originalPhotos": ["url1", "url2", "url3"]
  }
}
```

**Sugestão:** Se receber formato legado, migrar automaticamente para `originalPhotosExterior`.

---

## 📊 Estrutura Detalhada do MediaFiles

```typescript
mediaFiles: {
  // FOTOS ORIGINAIS (3 categorias separadas)
  originalPhotosInterior: string[],    // Bancos, painel de passageiros, interior
  originalPhotosExterior: string[],    // Lataria, rodas, chassi, frente/traseira
  originalPhotosInstruments: string[], // Painel do motorista, odômetro, controles

  // FOTOS TRATADAS (para publicação)
  treatedPhotos: string[],             // Primeira = destaque

  // DOCUMENTOS
  documentPhotos: string[],            // CRLV, nota fiscal, etc

  // VÍDEO (opcional)
  video: string | null
}
```

---

## 🎯 Cenários de Teste

### ✅ **Teste 1: Payload Completo**
- Use `exemplo-payload-vehicle.json`
- Valide que todos os campos são salvos corretamente
- Verifique que as 3 categorias de fotos originais são separadas

### ✅ **Teste 2: Payload Mínimo**
- Use `exemplo-payload-vehicle-minimo.json`
- Valide campos obrigatórios
- Verifique que funciona sem comissões/fornecedor

### ✅ **Teste 3: Retrocompatibilidade**
- Envie payload com `originalPhotos` (formato antigo)
- Valide que backend aceita e migra para `originalPhotosExterior`

### ✅ **Teste 4: Arrays Vazios**
```json
{
  "mediaFiles": {
    "originalPhotosInterior": [],
    "originalPhotosExterior": [],
    "originalPhotosInstruments": [],
    "treatedPhotos": [],
    "documentPhotos": [],
    "video": null
  }
}
```

### ✅ **Teste 5: Validação de Erros**
- Campos obrigatórios faltando
- URLs inválidas
- Comissões com soma != 100%
- Ano inválido

---

## 📝 Notas Importantes

1. **Performance:** Os 5 uploads (interior, exterior, instrumentos, tratadas, documentos) são feitos **em paralelo** no frontend

2. **Ordem das fotos tratadas:** A primeira foto em `treatedPhotos` é considerada a foto de **destaque**

3. **IDs:** Gerar IDs únicos para:
   - `supplier.id`
   - `commission.participants[].id`

4. **Datas:** Formato ISO 8601: `"2024-10-25T14:30:00.000Z"`

5. **Preços:** Sempre em centavos ou com 2 casas decimais: `450000.00`

---

## 🐛 Troubleshooting

### **Erro: "Upload falhou (400)"**
- Verifique se o tipo de arquivo é aceito (jpeg/png/webp)
- Verifique se o token está válido
- Verifique tamanho máximo do arquivo

### **Erro: "Campo obrigatório faltando"**
- Compare com `exemplo-payload-vehicle-minimo.json`
- Verifique estrutura de objetos aninhados

### **Erro: "X-Company-ID inválido"**
- Certifique-se de passar o header `X-Company-ID`
- Verifique se o ID existe no sistema

---

## 📞 Contato

Para dúvidas sobre a API, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
