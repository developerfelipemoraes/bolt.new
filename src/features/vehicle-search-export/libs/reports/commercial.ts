import jsPDF from 'jspdf';
import { NormalizedVehicle } from '../../types';
import { ReportMetadata } from '../../types/reports';
import { loadAndResizeImage } from '../image-helpers';
import { getVehicleUrl } from '../pdf-utils';

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function addHeader(pdf: jsPDF, metadata: ReportMetadata, yPos: number): number {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;

  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, 0, pageWidth, yPos + 5, 'F');

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(metadata.title, margin, yPos);

  yPos += 8;
  if (metadata.subtitle) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(metadata.subtitle, margin, yPos);
    yPos += 6;
  }

  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);
  pdf.text(`Data: ${formatDate()}`, margin, yPos);

  if (metadata.validUntil) {
    const validUntil = new Date(metadata.validUntil).toLocaleDateString('pt-BR');
    pdf.text(`Válido até: ${validUntil}`, pageWidth / 2, yPos);
  }

  return yPos + 10;
}

export async function generateCommercialProposal(
  vehicles: NormalizedVehicle[],
  metadata: ReportMetadata
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  let yPos = addHeader(pdf, {
    title: 'PROPOSTA COMERCIAL',
    subtitle: metadata.companyName || 'Aurovel Veículos',
    validUntil: metadata.validUntil || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  }, 20);

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Prezado Cliente,', margin, yPos);
  yPos += 6;
  pdf.text('Segue nossa proposta comercial para os veículos selecionados:', margin, yPos);
  yPos += 12;

  let totalValue = 0;

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];

    if (yPos > pageHeight - 80) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 70, 'F');

    if (vehicle.primaryImage) {
      const imageData = await loadAndResizeImage(vehicle.primaryImage, 300, 250);
      if (imageData) {
        pdf.addImage(imageData, 'JPEG', margin + 5, yPos, 50, 35);
        const vehicleUrl = getVehicleUrl(vehicle);
        pdf.link(margin + 5, yPos, 50, 35, { url: vehicleUrl });
      }
    }

    const textX = margin + 60;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(vehicle.title, textX, yPos + 5);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`SKU: ${vehicle.sku}`, textX, yPos + 11);
    pdf.text(`Ano: ${vehicle.fabricationYear}/${vehicle.modelYear}`, textX, yPos + 16);
    pdf.text(`Localização: ${vehicle.city}/${vehicle.state}`, textX, yPos + 21);
    pdf.text(`Quantidade: ${vehicle.quantity}`, textX, yPos + 26);

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 120, 0);
    pdf.text(`Valor: ${vehicle.priceFormatted}`, textX, yPos + 34);

    totalValue += vehicle.price * vehicle.quantity;

    yPos += 75;
  }

  if (yPos > pageHeight - 60) {
    pdf.addPage();
    yPos = margin;
  }

  yPos += 10;
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  const totalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalValue);

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Valor Total: ${totalFormatted}`, margin, yPos);

  yPos += 15;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Condições de Pagamento:', margin, yPos);
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('• À vista com desconto', margin + 5, yPos);
  yPos += 5;
  pdf.text('• Parcelado em até 12x', margin + 5, yPos);
  yPos += 5;
  pdf.text('• Financiamento disponível', margin + 5, yPos);

  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Condições Gerais:', margin, yPos);
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('• Garantia de fábrica', margin + 5, yPos);
  yPos += 5;
  pdf.text('• Documentação inclusa', margin + 5, yPos);
  yPos += 5;
  pdf.text('• Entrega em todo território nacional', margin + 5, yPos);

  if (metadata.terms) {
    yPos += 10;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const lines = pdf.splitTextToSize(metadata.terms, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 15) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.text(line, margin, yPos);
      yPos += 4;
    });
  }

  pdf.addPage();
  yPos = margin + 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Contato', margin, yPos);
  yPos += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  if (metadata.contactInfo?.phone) {
    pdf.text(`Telefone: ${metadata.contactInfo.phone}`, margin, yPos);
    yPos += 7;
  }
  if (metadata.contactInfo?.email) {
    pdf.text(`Email: ${metadata.contactInfo.email}`, margin, yPos);
    yPos += 7;
  }
  if (metadata.contactInfo?.website) {
    pdf.setTextColor(0, 102, 204);
    pdf.text(`Website: ${metadata.contactInfo.website}`, margin, yPos);
  }

  const filename = `Proposta-Comercial-${Date.now()}.pdf`;
  pdf.save(filename);
}

export async function generateComparison(vehicles: NormalizedVehicle[]): Promise<void> {
  if (vehicles.length > 4) {
    throw new Error('Máximo de 4 veículos para comparação');
  }

  const pdf = new jsPDF('l', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = margin;

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('COMPARATIVO DE VEÍCULOS', margin, yPos);
  yPos += 10;

  const colWidth = (pageWidth - 2 * margin - 40) / vehicles.length;
  const labelWidth = 40;

  yPos += 5;
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    const x = margin + labelWidth + i * colWidth;

    if (vehicle.primaryImage) {
      const imageData = await loadAndResizeImage(vehicle.primaryImage, 250, 200);
      if (imageData) {
        pdf.addImage(imageData, 'JPEG', x, yPos, colWidth - 2, 30);
        const vehicleUrl = getVehicleUrl(vehicle);
        pdf.link(x, yPos, colWidth - 2, 30, { url: vehicleUrl });
      }
    }

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(vehicle.title, colWidth - 4);
    pdf.text(titleLines[0], x + 1, yPos + 35);
  }

  yPos += 45;

  const specs = [
    { label: 'SKU', getValue: (v: NormalizedVehicle) => v.sku },
    { label: 'Preço', getValue: (v: NormalizedVehicle) => v.priceFormatted },
    { label: 'Ano Fabricação', getValue: (v: NormalizedVehicle) => v.fabricationYear.toString() },
    { label: 'Ano Modelo', getValue: (v: NormalizedVehicle) => v.modelYear.toString() },
    { label: 'Categoria', getValue: (v: NormalizedVehicle) => v.category },
    { label: 'Subcategoria', getValue: (v: NormalizedVehicle) => v.subcategory },
    { label: 'Chassi', getValue: (v: NormalizedVehicle) => `${v.chassisManufacturer} ${v.chassisModel}` },
    { label: 'Carroceria', getValue: (v: NormalizedVehicle) => `${v.bodyManufacturer} ${v.bodyModel}` },
    { label: 'Localização', getValue: (v: NormalizedVehicle) => `${v.city}/${v.state}` },
    { label: 'Ar-Condicionado', getValue: (v: NormalizedVehicle) => v.hasAirConditioning ? 'Sim' : 'Não' },
    { label: 'Banheiro', getValue: (v: NormalizedVehicle) => v.hasBathroom ? 'Sim' : 'Não' },
    { label: 'Wi-Fi', getValue: (v: NormalizedVehicle) => v.hasWifi ? 'Sim' : 'Não' },
    { label: 'Quantidade', getValue: (v: NormalizedVehicle) => v.quantity.toString() }
  ];

  pdf.setFontSize(8);

  specs.forEach((spec, index) => {
    const bgColor = index % 2 === 0 ? 250 : 255;
    pdf.setFillColor(bgColor, bgColor, bgColor);
    pdf.rect(margin, yPos - 4, pageWidth - 2 * margin, 6, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.text(spec.label, margin + 2, yPos);

    pdf.setFont('helvetica', 'normal');
    vehicles.forEach((vehicle, i) => {
      const x = margin + labelWidth + i * colWidth;
      const value = spec.getValue(vehicle);
      pdf.text(value, x + 1, yPos);
    });

    yPos += 6;
  });

  const filename = `Comparativo-Veiculos-${Date.now()}.pdf`;
  pdf.save(filename);
}

export async function generateAvailability(vehicles: NormalizedVehicle[]): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  let yPos = addHeader(pdf, {
    title: 'RELATÓRIO DE DISPONIBILIDADE',
    subtitle: 'Estoque Atualizado'
  }, 20);

  const groupedByCategory: { [key: string]: NormalizedVehicle[] } = {};
  vehicles.forEach(vehicle => {
    if (!groupedByCategory[vehicle.category]) {
      groupedByCategory[vehicle.category] = [];
    }
    groupedByCategory[vehicle.category].push(vehicle);
  });

  Object.entries(groupedByCategory).forEach(([category, categoryVehicles]) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(category, margin, yPos);
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');

    categoryVehicles.forEach(vehicle => {
      if (yPos > pageHeight - 15) {
        pdf.addPage();
        yPos = margin;
      }

      const statusColor = vehicle.status === 'Disponível' ? [0, 150, 0] :
                         vehicle.status === 'Reservado' ? [255, 140, 0] : [200, 0, 0];

      pdf.setTextColor(...statusColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`● ${vehicle.status}`, margin + 2, yPos);

      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${vehicle.title} - SKU: ${vehicle.sku}`, margin + 15, yPos);
      pdf.text(`Qtd: ${vehicle.quantity}`, pageWidth - margin - 30, yPos);
      yPos += 5;
    });

    yPos += 5;
  });

  const filename = `Disponibilidade-Estoque-${Date.now()}.pdf`;
  pdf.save(filename);
}
