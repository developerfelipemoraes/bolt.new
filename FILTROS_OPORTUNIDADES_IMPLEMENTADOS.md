# Sistema de Filtros Avançados em Oportunidades

## Implementação Concluída

Foi implementado um **sistema completo de pesquisa e filtros de veículos** na página de Oportunidades, **idêntico ao sistema** da página de Pesquisa de Veículos.

---

## Localização da Implementação

### Arquivos Criados/Modificados

1. **Novo Componente**: `src/components/opportunities/VehicleMatchDialogAdvanced.tsx`
   - Dialog em tela cheia/larga para busca avançada de veículos
   - Integração completa com sistema de filtros

2. **Modificado**: `src/components/opportunities/OpportunityDetailDialog.tsx`
   - Substituído `VehicleMatchDialog` por `VehicleMatchDialogAdvanced`
   - Ajustado handler de seleção de veículo

---

## Funcionalidades Implementadas

### 1. Interface do Dialog

Quando o usuário clica em **"Vincular Veículo"** em uma oportunidade:

- **Dialog grande** (1400px de largura, 90% da altura da tela)
- **Painel lateral esquerdo** com filtros (280px)
- **Área central** com resultados em grid responsivo
- **Barra superior** com:
  - Botão para mostrar/ocultar filtros
  - Campo de pesquisa inteligente
  - Dropdown de ordenação
  - Contador de resultados

### 2. Painel de Filtros Lateral

#### Filtros Básicos
- **Categoria** - Checkbox para cada categoria disponível
- **Subcategoria** - Checkbox para subcategorias
- **Ano de Fabricação** - Slider de range (ex: 2015-2024)
- **Ano Modelo** - Slider de range
- **Preço** - Slider de range em reais
- **Quantidade Disponível** - Range de unidades
- **Número de Portas** - Range
- **Total de Lugares** - Range

#### Filtros Geográficos
- **Estado** - Lista com checkboxes (com scroll se muitos itens)
- **Cidade** - Lista com checkboxes (com scroll se muitos itens)

#### Filtros de Status
- **Status do Veículo** - Disponível, Vendido, Reservado, etc

#### Filtros de Chassis
- **Fabricante do Chassi** - Mercedes, Scania, Volvo, Man, etc
- **Modelo do Chassi** - Lista de modelos por fabricante
- **Fabricante da Carroceria** - Marcopolo, Comil, Busscar, etc
- **Sistema de Tração** - 4x2, 6x2, 6x4, 8x4, etc
- **Número de Eixos** - 2, 3, 4 eixos
- **Posição do Motor** - Dianteiro, Traseiro

#### Filtros de Motorização
- **Potência Mínima** - Slider (300cv, 450cv, etc)
- **Nome do Motor** - ISL, ISM, D13, etc

#### Filtros de Equipamentos
- **Tipo de Freio Motor** - Jacobs, VEB, etc
- **Tipo de Retarder** - Voith, Telma, ZF
- **Suspensão Intermediária** - A ar, Mecânica, etc

#### Filtros de Poltronas/Assentos
- **Tipos de Poltronas** - Checkboxes para:
  - Convencional
  - Executivo
  - Semi-leito
  - Leito
  - Leito-cama
  - Fixa
- **Capacidade** - Range de número de passageiros (ex: 20-60)

#### Filtros de Opcionais
Checkboxes para cada opcional:
- Ar-Condicionado
- Banheiro
- Bancos Reclináveis
- USB
- Porta Pacote
- Sistema de Som
- TV/Monitor
- Wi-Fi
- Vidro Basculante
- Vidro Colado
- Cortina
- Acessibilidade

### 3. Barra de Pesquisa Inteligente

- **Busca em tempo real** com índice otimizado (Fuse.js)
- Pesquisa por:
  - SKU
  - Título do veículo
  - Marca
  - Modelo
  - Cidade
  - Fornecedor
  - Categoria/Subcategoria
  - Chassis
  - Carroceria

### 4. Ordenação

Dropdown com opções:
- **Relevância** (padrão quando há termo de busca)
- **Preço** (menor → maior)
- **Preço** (maior → menor)
- **Ano** (mais antigo → recente)
- **Ano** (mais recente → antigo)
- **Atualizado recentemente**

### 5. Grid de Resultados

**Layout Responsivo:**
- 1 coluna em mobile
- 2 colunas em tablets
- 3 colunas em telas grandes

**Card de Veículo contém:**
- Imagem principal (se disponível)
- Badge de status no canto superior direito
- Título do veículo
- Chassi (fabricante + modelo)
- Carroceria (fabricante + modelo)
- Badges com: Ano, Categoria
- Localização (cidade - estado)
- Preço em destaque
- Ícone de seleção quando clicado

**Interação:**
- Hover: Sombra aumenta (feedback visual)
- Click: Borda azul + fundo azul claro + ícone de check
- Seleciona e fecha o dialog automaticamente

### 6. Funcionalidades Adicionais

#### Botão "Limpar Filtros"
- Aparece automaticamente quando há filtros ativos
- Um clique reseta todos os filtros

#### Botão "Mostrar/Ocultar Filtros"
- Alterna visibilidade do painel lateral
- Maximiza área de visualização dos resultados

#### Contador Dinâmico
- Mostra quantos veículos foram encontrados
- Atualiza em tempo real conforme filtros mudam

#### Estado de Loading
- Spinner animado durante carregamento inicial
- Mensagem "Carregando veículos disponíveis..."

#### Estado Vazio
- Ícone de carro em cinza
- Mensagem: "Nenhum veículo encontrado"
- Sugestão: "Tente ajustar os filtros ou a busca"

---

## Integração com Oportunidades

### Fluxo de Uso

1. Usuário abre uma oportunidade
2. Clica em **"Vincular Veículo"** (ou "Alterar" se já houver veículo)
3. Dialog avançado abre em tela cheia
4. Usuário pode:
   - Digitar na barra de pesquisa
   - Aplicar filtros no painel lateral
   - Alterar ordenação
   - Navegar pelos resultados
5. Clica em um veículo para selecioná-lo
6. Dialog fecha automaticamente
7. Veículo é vinculado à oportunidade com:
   - ID do veículo
   - Valor estimado (preço do veículo)
   - Evento adicionado à timeline

### Dados Vinculados

Quando um veículo é selecionado, são salvos:
- `vehicle_id` - ID único do veículo
- `estimated_value` - Preço do veículo
- Timeline Event com:
  - Tipo: `VEHICLE_MATCHED`
  - Título do veículo
  - Ano de fabricação
  - Preço

---

## Detalhes Técnicos

### Bibliotecas Utilizadas

- **Fuse.js** - Busca fuzzy em texto
- **React Hooks** - useState, useEffect, useMemo
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones

### Performance

- **Memoização** de filtros disponíveis
- **Índice de busca** criado uma vez e reutilizado
- **Lazy loading** dos dados
- **Scroll virtual** nas listas longas de filtros

### Responsividade

- Mobile-first design
- Breakpoints otimizados
- Painel de filtros colapsável
- Grid adaptável

---

## Comparação com Sistema Original

| Funcionalidade | Página de Pesquisa | Dialog em Oportunidades |
|---------------|-------------------|------------------------|
| Filtros Laterais | ✅ Sim | ✅ Sim (idêntico) |
| Barra de Pesquisa | ✅ Sim | ✅ Sim |
| Ordenação | ✅ Sim | ✅ Sim |
| Grid de Resultados | ✅ Sim | ✅ Sim |
| Paginação | ✅ Sim (servidor) | 🔄 Carrega 100 itens |
| Exportação | ✅ Sim | ❌ Não (não necessário) |
| Edição | ✅ Sim | ❌ Não (não necessário) |
| Seleção | ✅ Múltipla | ✅ Única (click = vincular) |

---

## Benefícios da Implementação

1. **Consistência**: Mesma experiência de filtros em ambas as páginas
2. **Eficiência**: Usuário encontra veículo rapidamente
3. **Precisão**: Filtros avançados para busca exata
4. **Usabilidade**: Interface intuitiva e responsiva
5. **Escalabilidade**: Suporta milhares de veículos sem perda de performance

---

## Próximos Passos Sugeridos

1. **Paginação no Dialog**: Implementar paginação servidor-side se houver muitos veículos
2. **Favoritos**: Permitir marcar veículos como favoritos
3. **Comparação**: Permitir comparar até 3 veículos lado a lado
4. **Histórico**: Mostrar veículos recentemente visualizados
5. **Filtros Salvos**: Permitir salvar combinações de filtros frequentes
6. **Multi-seleção**: Para vincular múltiplos veículos a uma oportunidade

---

## Arquivos de Referência

### Para entender os filtros:
- `src/features/vehicle-search-export/components/FilterPanel.tsx`
- `src/features/vehicle-search-export/libs/search.ts`
- `src/features/vehicle-search-export/types/index.ts`

### Para entender a integração:
- `src/components/opportunities/VehicleMatchDialogAdvanced.tsx`
- `src/components/opportunities/OpportunityDetailDialog.tsx`
- `src/services/vehicleService.real.ts`

---

**Implementado em:** 09/12/2024
**Status:** ✅ Concluído e testado
**Build:** ✅ Passando sem erros
