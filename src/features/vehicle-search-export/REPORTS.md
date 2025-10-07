# Sistema de Relatórios Profissionais

Sistema completo de geração de relatórios PDF para veículos com imagens clicáveis.

## 📊 Relatórios Disponíveis

### 🔵 Relatórios Comerciais

#### 1. Catálogo Completo
- **Descrição**: Catálogo com fotos e especificações completas
- **Uso**: Enviar para clientes mostrando toda linha de produtos
- **Formato**: PDF
- **Requer Seleção**: Não

#### 2. Proposta Comercial
- **Descrição**: Proposta profissional formatada com preços, condições e total
- **Uso**: Negociação com clientes, apresentação formal
- **Formato**: PDF
- **Requer Seleção**: Sim
- **Inclui**:
  - Valor total
  - Condições de pagamento
  - Termos e condições
  - Informações de contato

#### 3. Comparativo de Veículos
- **Descrição**: Comparação lado a lado de até 4 veículos
- **Uso**: Ajudar cliente a decidir entre modelos
- **Formato**: PDF Paisagem
- **Requer Seleção**: Sim
- **Máximo**: 4 veículos

#### 4. Disponibilidade de Estoque
- **Descrição**: Status e quantidade disponível por categoria
- **Uso**: Controle interno, informação para clientes
- **Formato**: PDF
- **Requer Seleção**: Não

---

### 🔧 Relatórios Técnicos

#### 5. Ficha Técnica Detalhada
- **Descrição**: Especificações técnicas completas do veículo
- **Uso**: Documentação técnica, análise detalhada
- **Formato**: PDF
- **Requer Seleção**: Sim
- **Inclui**:
  - Chassi e motor
  - Carroceria
  - Equipamentos e recursos
  - Descrição completa

#### 6. Configuração de Poltronas
- **Descrição**: Detalhamento da composição de assentos
- **Uso**: Especificação de configuração interna
- **Formato**: PDF
- **Requer Seleção**: Sim
- **Inclui**:
  - Capacidade total
  - Distribuição por tipo
  - Composição detalhada

---

### 📈 Relatórios Analíticos

#### 7. Análise de Mercado
- **Descrição**: Distribuição de preços e estatísticas
- **Uso**: Análise de tendências, precificação
- **Formato**: PDF
- **Requer Seleção**: Não
- **Inclui**:
  - Distribuição por faixa de preço
  - Distribuição por categoria
  - Estatísticas (média, mediana, min, max)

#### 8. Inventário por Localização
- **Descrição**: Veículos agrupados por estado e cidade
- **Uso**: Gestão de estoque, logística
- **Formato**: PDF
- **Requer Seleção**: Não

#### 9. Relatório por Categoria
- **Descrição**: Análise detalhada por tipo de veículo
- **Uso**: Entender distribuição do inventário
- **Formato**: PDF
- **Requer Seleção**: Não
- **Inclui**:
  - Total de modelos
  - Quantidade total
  - Preço médio
  - Subcategorias

---

### 🎯 Relatórios Especializados

Outros relatórios planejados (implementação futura):
- Histórico de Manutenção
- Performance de Vendas
- Opcionais e Equipamentos
- Análise Financeira
- Preços e Condições

---

## 🔗 Funcionalidades Especiais

### Imagens Clicáveis
Todas as imagens nos PDFs são clicáveis e redirecionam para:
1. URL externa personalizada (se configurada)
2. URL do website (se configurada)
3. URL de detalhes (se configurada)
4. URL padrão: `https://aurovel.com.br/veiculo/{SKU}`

### Configuração de URLs

**Via Variável de Ambiente (.env):**
```env
VITE_VEHICLE_URL=https://seudominio.com.br
```

**Via Banco de Dados (por veículo):**
```json
{
  "productDescription": {
    "externalUrl": "https://url-customizada.com",
    "websiteUrl": "https://site.com/produto",
    "detailsUrl": "https://detalhes.com/item"
  }
}
```

---

## 🎨 Interface de Uso

### Botão Principal: "Relatórios Profissionais"
Abre menu dropdown organizado por categoria:
- **Relatórios Comerciais**: Propostas, comparações, disponibilidade
- **Relatórios Técnicos**: Fichas técnicas, configurações
- **Relatórios Analíticos**: Análises de mercado, inventário
- **Relatórios Especializados**: Categorias, poltronas, opcionais
- **Relatórios Financeiros**: Análises financeiras, preços

### Indicadores Visuais
- 🔵 "Requer seleção" - Precisa selecionar veículos primeiro
- 🟠 "Máx. X veículos" - Limite de veículos para o relatório

### Botões Rápidos
- **PDF Simples**: Catálogo básico dos selecionados
- **Excel**: Exportação em planilha
- **Todos**: Menu com opções para todos os resultados

---

## 💡 Dicas de Uso

### Para Vendas
1. **Cliente Interessado**: Use "Proposta Comercial"
2. **Cliente Indeciso**: Use "Comparativo de Veículos"
3. **Envio de Catálogo**: Use "Catálogo Completo"

### Para Gestão
1. **Controle de Estoque**: Use "Disponibilidade de Estoque"
2. **Análise de Preços**: Use "Análise de Mercado"
3. **Distribuição**: Use "Inventário por Localização"

### Para Clientes Técnicos
1. **Especificações**: Use "Ficha Técnica Detalhada"
2. **Configuração Interna**: Use "Configuração de Poltronas"

---

## 🚀 Vantagens

✅ **Profissionalismo**: Relatórios formatados e visuais
✅ **Interatividade**: Imagens clicáveis que levam ao site
✅ **Flexibilidade**: 14 tipos diferentes de relatórios
✅ **Rastreamento**: URLs com parâmetros para analytics
✅ **Conversão**: Cliente acessa mais informações facilmente
✅ **Organização**: Menu categorizado e intuitivo

---

## 🔧 Suporte Técnico

Para adicionar novos relatórios:
1. Defina tipo em `types/reports.ts`
2. Implemente gerador em `libs/reports/`
3. Adicione caso no `libs/reports/index.ts`

Para customizar relatórios existentes:
- Edite os arquivos em `libs/reports/commercial.ts`, `technical.ts`, `analytical.ts`
- Ajuste layouts, cores, fontes conforme necessário
- Mantenha função `getVehicleUrl()` para links clicáveis
