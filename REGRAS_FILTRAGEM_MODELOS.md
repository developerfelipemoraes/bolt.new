# Regras de Filtragem de Modelos de Chassi e Carroceria

## Visão Geral

Este documento descreve as regras de filtragem implementadas para modelos de chassi e carroceria no cadastro de veículos.

## Objetivo

Garantir que apenas modelos compatíveis com o veículo sendo cadastrado sejam apresentados ao usuário, facilitando a seleção e evitando erros de compatibilidade.

## Pré-requisitos Obrigatórios

Antes de mostrar fabricantes ou modelos, o sistema exige que os seguintes campos estejam preenchidos:

1. **Categoria** (ex: Rodoviário, Urbano, Turismo, Escolar, Micros, Especiais)
2. **Subcategoria** (ex: Convencional, Articulado, BRT, Padron, Midi, Básico)
3. **Ano de Fabricação** (ano em que o veículo foi fabricado)
4. **Ano do Modelo** (ano do modelo do veículo)

## Fluxo de Filtragem

### 1. Chassi

#### 1.1. Filtragem de Fabricantes de Chassi

Quando o usuário preenche os pré-requisitos, o sistema busca fabricantes que possuem modelos de chassi com:

- **Segmento compatível**: Verifica o campo JSONB `segments` na tabela `chassis_models`
  - Exemplo: `[{"segment": "Urbano", "vehicleType": "Midi"}]`
  - Deve conter um objeto com a categoria e subcategoria selecionadas

- **Anos disponíveis**: Verifica o campo JSONB `manufacture_model_year_pairs`
  - Exemplo: `[{"manufactureYear": 2020, "modelYear": 2020}, {"manufactureYear": 2021, "modelYear": 2021}]`
  - Deve conter um objeto com o par exato de ano fabricação e ano modelo

#### 1.2. Filtragem de Modelos de Chassi

Após selecionar o fabricante, o sistema filtra os modelos que:

- Pertencem ao **fabricante selecionado**
- Possuem o **segmento (categoria + subcategoria)** compatível
- Estão **disponíveis para os anos** de fabricação e modelo especificados

**Query Supabase implementada:**
```javascript
query = query
  .eq('chassis_manufacturers.name', fabricante)
  .contains('segments', [{ segment: categoria, vehicleType: subcategoria }])
  .contains('manufacture_model_year_pairs', [
    { manufactureYear: anoFab, modelYear: anoMod }
  ]);
```

### 2. Carroceria

#### 2.1. Filtragem de Fabricantes de Carroceria

Quando o usuário preenche os pré-requisitos, o sistema busca fabricantes que possuem modelos de carroceria com:

- **Categoria e Subcategoria compatíveis**: Verifica os campos `category_id` e `subcategory_id`
  - Sistema converte o nome da categoria/subcategoria para o UUID correspondente
  - Filtra modelos que têm os IDs correspondentes

- **Anos disponíveis**: Verifica dois campos JSONB:
  - `year_entries_data`: Lista de entradas específicas de anos
    - Exemplo: `[{"manufactureYear": 2020, "modelYear": 2020}]`
  - `year_ranges`: Intervalos de anos
    - Exemplo: `[{"start": 2015, "end": 2022}]`

A filtragem de anos aceita o modelo se:
- Existe uma entrada exata em `year_entries_data` OU
- Os anos estão dentro de um intervalo em `year_ranges`

#### 2.2. Filtragem de Modelos de Carroceria

Após selecionar o fabricante, o sistema filtra os modelos que:

- Pertencem ao **fabricante selecionado**
- Têm a **categoria e subcategoria** compatíveis
- Estão **disponíveis para os anos** especificados

**Query Supabase implementada:**
```javascript
query = query
  .eq('bodywork_manufacturers.name', fabricante)
  .eq('category_id', categoryId)
  .eq('subcategory_id', subcategoryId);

// Filtragem adicional em memória para anos
filteredData = data.filter(item => {
  const hasMatchingEntry = item.year_entries_data.some(
    entry => entry.manufactureYear === anoFab && entry.modelYear === anoMod
  );

  const hasMatchingRange = item.year_ranges.some(
    range => anoFab >= range.start && anoFab <= range.end &&
             anoMod >= range.start && anoMod <= range.end
  );

  return hasMatchingEntry || hasMatchingRange;
});
```

## Estrutura de Dados

### Tabela: chassis_models

```sql
- id: uuid
- manufacturer_id: uuid (FK para chassis_manufacturers)
- model: text
- segments: jsonb
  -- Formato: [{"segment": "Urbano", "vehicleType": "Midi"}]
- manufacture_model_year_pairs: jsonb
  -- Formato: [{"manufactureYear": 2020, "modelYear": 2020}]
- is_active: boolean
```

### Tabela: bodywork_models

```sql
- id: uuid
- manufacturer_id: uuid (FK para bodywork_manufacturers)
- category_id: uuid (FK para vehicle_categories)
- subcategory_id: uuid (FK para vehicle_subcategories)
- model: text
- year_entries_data: jsonb
  -- Formato: [{"manufactureYear": 2020, "modelYear": 2020}]
- year_ranges: jsonb
  -- Formato: [{"start": 2015, "end": 2022}]
- is_active: boolean
```

## Implementação

### Serviços

- **chassisService.ts**: `getChassisManufacturers()`, `searchChassisSummary()`
- **bodyworkService.ts**: `getBodyworkManufacturers()`, `searchBodywork()`

### Componentes

- **ChassisAutocomplete.tsx**: Componentes para seleção de fabricante e modelo de chassi
- **BodyworkAutocomplete.tsx**: Componentes para seleção de fabricante e modelo de carroceria
- **ChassisInfo.tsx**: Orquestra os componentes e valida os pré-requisitos

## Validações

1. **Desabilita seleção de fabricantes** até que categoria, subcategoria e anos estejam preenchidos
2. **Desabilita seleção de modelos** até que o fabricante seja selecionado
3. **Limpa seleções** quando pré-requisitos mudam
4. **Mostra mensagens informativas** quando campos estão desabilitados

## Dica ao Usuário

Uma dica azul é exibida na interface:

> "Os autocompletes são filtrados automaticamente por categoria, subcategoria e anos. Selecione o fabricante primeiro para ver os modelos disponíveis."

## Benefícios

1. **Redução de erros**: Apenas modelos compatíveis são apresentados
2. **Melhor experiência**: Usuário vê apenas opções relevantes
3. **Integridade de dados**: Garante consistência entre categoria, anos e modelos
4. **Performance**: Reduz a quantidade de dados carregados
