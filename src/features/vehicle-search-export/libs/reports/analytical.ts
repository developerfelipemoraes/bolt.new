import jsPDF from 'jspdf';
import { NormalizedVehicle } from '../../types';
import { formatDate } from '../pdf-utils';

export async function generateMarketAnalysis(vehicles: NormalizedVehicle[]): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = margin;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ANÁLISE DE MERCADO', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${formatDate()} | Total de Veículos: ${vehicles.length}`, margin, yPos);
  yPos += 15;

  const priceRanges = [
    { label: 'Até R$ 100.000', min: 0, max: 100000, count: 0 },
    { label: 'R$ 100.000 - R$ 250.000', min: 100000, max: 250000, count: 0 },
    { label: 'R$ 250.000 - R$ 500.000', min: 250000, max: 500000, count: 0 },
    { label: 'R$ 500.000 - R$ 1.000.000', min: 500000, max: 1000000, count: 0 },
    { label: 'Acima de R$ 1.000.000', min: 1000000, max: Infinity, count: 0 }
  ];

  vehicles.forEach(v => {
    const range = priceRanges.find(r => v.price >= r.min && v.price < r.max);
    if (range) range.count++;
  });

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Distribuição por Faixa de Preço', margin, yPos);
  yPos += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const maxCount = Math.max(...priceRanges.map(r => r.count));
  const barWidth = pageWidth - 2 * margin - 80;

  priceRanges.forEach(range => {
    pdf.text(range.label, margin, yPos);

    const barLength = range.count > 0 ? (range.count / maxCount) * barWidth : 0;
    pdf.setFillColor(66, 135, 245);
    pdf.rect(margin + 80, yPos - 4, barLength, 6, 'F');

    pdf.text(`${range.count}`, margin + 85 + barLength, yPos);
    yPos += 8;
  });

  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Distribuição por Categoria', margin, yPos);
  yPos += 10;

  const categoryCount: { [key: string]: number } = {};
  vehicles.forEach(v => {
    categoryCount[v.category] = (categoryCount[v.category] || 0) + 1;
  });

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const percentage = ((count / vehicles.length) * 100).toFixed(1);
      pdf.text(`${category}:`, margin, yPos);
      pdf.text(`${count} (${percentage}%)`, pageWidth - margin - 30, yPos);
      yPos += 6;
    });

  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Estatísticas de Preços', margin, yPos);
  yPos += 10;

  const prices = vehicles.map(v => v.price).sort((a, b) => a - b);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];
  const medianPrice = prices[Math.floor(prices.length / 2)];

  const format = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const stats = [
    ['Preço Médio', format(avgPrice)],
    ['Preço Mediano', format(medianPrice)],
    ['Preço Mínimo', format(minPrice)],
    ['Preço Máximo', format(maxPrice)]
  ];

  stats.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 60, yPos);
    yPos += 6;
  });

  const filename = `Analise-Mercado-${Date.now()}.pdf`;
  pdf.save(filename);
}

export async function generateInventoryByLocation(vehicles: NormalizedVehicle[]): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVENTÁRIO POR LOCALIZAÇÃO', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${formatDate()} | Total: ${vehicles.length} veículos`, margin, yPos);
  yPos += 15;

  const byState: { [key: string]: { [key: string]: NormalizedVehicle[] } } = {};

  vehicles.forEach(v => {
    if (!byState[v.state]) byState[v.state] = {};
    if (!byState[v.state][v.city]) byState[v.state][v.city] = [];
    byState[v.state][v.city].push(v);
  });

  Object.entries(byState)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([state, cities]) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = margin;
      }

      const stateTotal = Object.values(cities).reduce((sum, cityVehicles) =>
        sum + cityVehicles.reduce((s, v) => s + v.quantity, 0), 0
      );

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(230, 240, 255);
      pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');
      pdf.text(`${state} - ${stateTotal} unidades`, margin + 3, yPos + 2);
      yPos += 12;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      Object.entries(cities)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([city, cityVehicles]) => {
          if (yPos > pageHeight - 15) {
            pdf.addPage();
            yPos = margin;
          }

          const cityTotal = cityVehicles.reduce((sum, v) => sum + v.quantity, 0);
          pdf.text(`  ${city}`, margin + 5, yPos);
          pdf.text(`${cityTotal}`, pageWidth - margin - 20, yPos);
          yPos += 6;

          cityVehicles.forEach(v => {
            if (yPos > pageHeight - 15) {
              pdf.addPage();
              yPos = margin;
            }

            pdf.setTextColor(100, 100, 100);
            pdf.setFontSize(9);
            pdf.text(`    • ${v.title} (${v.quantity})`, margin + 10, yPos);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            yPos += 5;
          });
        });

      yPos += 3;
    });

  const filename = `Inventario-Localizacao-${Date.now()}.pdf`;
  pdf.save(filename);
}

export async function generateCategoryReport(vehicles: NormalizedVehicle[]): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RELATÓRIO POR CATEGORIA', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${formatDate()}`, margin, yPos);
  yPos += 15;

  const byCategory: { [key: string]: NormalizedVehicle[] } = {};
  vehicles.forEach(v => {
    if (!byCategory[v.category]) byCategory[v.category] = [];
    byCategory[v.category].push(v);
  });

  Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, categoryVehicles]) => {
      if (yPos > pageHeight - 50) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 12, 'F');
      pdf.text(category, margin + 3, yPos + 3);
      yPos += 15;

      const totalQty = categoryVehicles.reduce((sum, v) => sum + v.quantity, 0);
      const avgPrice = categoryVehicles.reduce((sum, v) => sum + v.price, 0) / categoryVehicles.length;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total de modelos: ${categoryVehicles.length}`, margin + 5, yPos);
      yPos += 5;
      pdf.text(`Quantidade total: ${totalQty} unidades`, margin + 5, yPos);
      yPos += 5;

      const avgPriceFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(avgPrice);
      pdf.text(`Preço médio: ${avgPriceFormatted}`, margin + 5, yPos);
      yPos += 10;

      const subcats: { [key: string]: number } = {};
      categoryVehicles.forEach(v => {
        subcats[v.subcategory] = (subcats[v.subcategory] || 0) + 1;
      });

      if (Object.keys(subcats).length > 1) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Subcategorias:', margin + 5, yPos);
        yPos += 6;

        pdf.setFont('helvetica', 'normal');
        Object.entries(subcats).forEach(([subcat, count]) => {
          pdf.text(`  • ${subcat}: ${count}`, margin + 10, yPos);
          yPos += 5;
        });
      }

      yPos += 8;
    });

  const filename = `Relatorio-Categorias-${Date.now()}.pdf`;
  pdf.save(filename);
}
