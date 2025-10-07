import jsPDF from 'jspdf';
import { NormalizedVehicle } from '../../types';
import { loadAndResizeImage } from '../image-helpers';
import { getVehicleUrl, formatDate } from '../pdf-utils';

export async function generateTechnicalSheet(vehicle: NormalizedVehicle): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FICHA TÉCNICA DETALHADA', margin, yPos);
  yPos += 10;

  pdf.setFontSize(14);
  pdf.text(vehicle.title, margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`SKU: ${vehicle.sku}`, margin, yPos);
  yPos += 5;
  pdf.text(`Data: ${formatDate()}`, margin, yPos);
  yPos += 10;

  if (vehicle.primaryImage) {
    const imageData = await loadAndResizeImage(vehicle.primaryImage, 500, 400);
    if (imageData) {
      pdf.addImage(imageData, 'JPEG', margin, yPos, 100, 70);
      const vehicleUrl = getVehicleUrl(vehicle);
      pdf.link(margin, yPos, 100, 70, { url: vehicleUrl });
      yPos += 75;
    }
  }

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IDENTIFICAÇÃO', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const identification = [
    ['Ano de Fabricação', vehicle.fabricationYear.toString()],
    ['Ano do Modelo', vehicle.modelYear.toString()],
    ['Categoria', vehicle.category],
    ['Subcategoria', vehicle.subcategory],
    ['Status', vehicle.status]
  ];

  identification.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 60, yPos);
    yPos += 5;
  });

  yPos += 5;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CHASSI E MOTOR', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const chassis = [
    ['Fabricante do Chassi', vehicle.chassisManufacturer],
    ['Modelo do Chassi', vehicle.chassisModel],
    ['Sistema de Tração', vehicle.driveSystem || 'N/A'],
    ['Posição do Motor', vehicle.enginePosition || 'N/A']
  ];

  chassis.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 60, yPos);
    yPos += 5;
  });

  yPos += 5;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CARROCERIA', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const body = [
    ['Fabricante da Carroceria', vehicle.bodyManufacturer],
    ['Modelo da Carroceria', vehicle.bodyModel]
  ];

  body.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 60, yPos);
    yPos += 5;
  });

  if (yPos > pageHeight - 80) {
    pdf.addPage();
    yPos = margin;
  }

  yPos += 5;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EQUIPAMENTOS E RECURSOS', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const equipments = [
    ['Ar-Condicionado', vehicle.hasAirConditioning],
    ['Banheiro', vehicle.hasBathroom],
    ['Bancos Reclináveis', vehicle.hasReclinableSeats],
    ['USB', vehicle.hasUsb],
    ['Porta Pacote', vehicle.hasPackageHolder],
    ['Sistema de Som', vehicle.hasSoundSystem],
    ['TV/Monitor', vehicle.hasTv],
    ['Wi-Fi', vehicle.hasWifi],
    ['Vidro Basculante', vehicle.hasTiltingGlass],
    ['Vidro Colado', vehicle.hasGluedGlass],
    ['Cortina', vehicle.hasCurtain],
    ['Acessibilidade', vehicle.hasAccessibility]
  ];

  const midPoint = Math.ceil(equipments.length / 2);
  const col1 = equipments.slice(0, midPoint);
  const col2 = equipments.slice(midPoint);

  const startY = yPos;
  col1.forEach(([label, value], index) => {
    yPos = startY + index * 5;
    pdf.text(`${label}: ${value ? 'Sim' : 'Não'}`, margin + 5, yPos);
  });

  yPos = startY;
  col2.forEach(([label, value], index) => {
    yPos = startY + index * 5;
    pdf.text(`${label}: ${value ? 'Sim' : 'Não'}`, pageWidth / 2 + 5, yPos);
  });

  yPos = startY + midPoint * 5 + 5;

  if (vehicle.description) {
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESCRIÇÃO', margin, yPos);
    yPos += 7;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(vehicle.description, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 15) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
  }

  const filename = `Ficha-Tecnica-${vehicle.sku}-${Date.now()}.pdf`;
  pdf.save(filename);
}

export async function generateSeatsConfiguration(vehicle: NormalizedVehicle): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = margin;

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONFIGURAÇÃO DE POLTRONAS', margin, yPos);
  yPos += 10;

  pdf.setFontSize(12);
  pdf.text(vehicle.title, margin, yPos);
  yPos += 6;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`SKU: ${vehicle.sku}`, margin, yPos);
  yPos += 10;

  if (vehicle.primaryImage) {
    const imageData = await loadAndResizeImage(vehicle.primaryImage, 400, 300);
    if (imageData) {
      pdf.addImage(imageData, 'JPEG', margin, yPos, 80, 55);
      yPos += 60;
    }
  }

  const seatComp = vehicle.rawData.seatComposition;

  if (seatComp?.totalCapacity) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(230, 240, 255);
    pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 12, 'F');
    pdf.text(`Capacidade Total: ${seatComp.totalCapacity} lugares`, margin + 5, yPos + 3);
    yPos += 15;
  }

  if (seatComp?.totals) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Distribuição por Tipo:', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const seatTypes = [
      { label: 'Convencionais', value: seatComp.totals.conventional },
      { label: 'Executivos', value: seatComp.totals.executive },
      { label: 'Semi-Leito', value: seatComp.totals.semiSleeper },
      { label: 'Leito', value: seatComp.totals.sleeper },
      { label: 'Leito Cama', value: seatComp.totals.sleeperBed },
      { label: 'Fixos', value: seatComp.totals.fixed }
    ];

    seatTypes.forEach(({ label, value }) => {
      if (value && value > 0) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPos - 4, pageWidth - 2 * margin, 6, 'F');
        pdf.text(`${label}:`, margin + 5, yPos);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value.toString(), pageWidth - margin - 20, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 7;
      }
    });
  }

  if (seatComp?.composition && seatComp.composition.length > 0) {
    yPos += 5;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Composição Detalhada:', margin, yPos);
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');

    seatComp.composition.forEach(seat => {
      pdf.text(`• ${seat.type}: ${seat.quantity}`, margin + 5, yPos);
      if (seat.location) {
        pdf.setTextColor(100, 100, 100);
        pdf.text(`(${seat.location})`, margin + 50, yPos);
        pdf.setTextColor(0, 0, 0);
      }
      yPos += 5;
    });
  }

  if (seatComp?.compositionText) {
    yPos += 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Observações:', margin, yPos);
    yPos += 6;

    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(seatComp.compositionText, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
  }

  const filename = `Configuracao-Poltronas-${vehicle.sku}-${Date.now()}.pdf`;
  pdf.save(filename);
}
