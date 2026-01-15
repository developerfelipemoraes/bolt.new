import jsPDF from 'jspdf';
import { NormalizedVehicle } from '../types';
import { loadAndResizeImage, getPlaceholderImage } from './image-helpers';
import { getVehicleUrl, slugify } from './pdf-utils';

function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hour}${minute}`;
}

export async function generateVehiclePDF(vehicle: NormalizedVehicle): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Aurovel - Relatório de Veículo', margin, yPos);
  yPos += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`SKU: ${vehicle.sku}`, margin, yPos);
  yPos += 7;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(vehicle.title, margin, yPos);
  yPos += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Status: ${vehicle.status}`, margin, yPos);
  yPos += 6;
  pdf.text(`Preço: ${vehicle.priceFormatted}`, margin, yPos);
  yPos += 6;
  pdf.text(`Localização: ${vehicle.city}/${vehicle.state}`, margin, yPos);
  yPos += 6;
  pdf.text(`Quantidade Disponível: ${vehicle.quantity}`, margin, yPos);
  yPos += 6;
  pdf.text(`Fornecedor: ${vehicle.supplierContact} - ${vehicle.supplierPhone}`, margin, yPos);
  yPos += 10;

  if (vehicle.primaryImage) {
    const imageData = await loadAndResizeImage(vehicle.primaryImage, 500, 400);
    if (imageData) {
      const imgWidth = 180;
      const imgHeight = 120;
      pdf.addImage(imageData, 'JPEG', margin, yPos, imgWidth, imgHeight);

      const vehicleUrl = getVehicleUrl(vehicle);
      pdf.link(margin, yPos, imgWidth, imgHeight, { url: vehicleUrl });

      pdf.setFontSize(8);
      pdf.setTextColor(0, 102, 204);
      pdf.text('🔗 Clique na imagem para mais detalhes', margin, yPos + imgHeight + 4);
      pdf.setTextColor(0, 0, 0);

      yPos += imgHeight + 10;
    }
  }

  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ficha Técnica', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const specs = [
    `Ano Fabricação: ${vehicle.fabricationYear}`,
    `Ano Modelo: ${vehicle.modelYear}`,
    `Fabricante Chassi: ${vehicle.chassisManufacturer}`,
    `Modelo Chassi: ${vehicle.chassisModel}`,
    `Fabricante Carroceria: ${vehicle.bodyManufacturer}`,
    `Modelo Carroceria: ${vehicle.bodyModel}`,
    `Categoria: ${vehicle.category}`,
    `Subcategoria: ${vehicle.subcategory}`,
    `Sistema de Tração: ${vehicle.driveSystem}`,
    `Posição de Motor: ${vehicle.enginePosition}`
  ];

  specs.forEach(spec => {
    if (yPos > pageHeight - 15) {
      pdf.addPage();
      yPos = margin;
    }
    pdf.text(spec, margin, yPos);
    yPos += 6;
  });

  if (yPos > pageHeight - 60) {
    pdf.addPage();
    yPos = margin;
  }

  yPos += 5;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Opcionais', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const optionals = [
    { label: 'Ar-Condicionado', value: vehicle.hasAirConditioning },
    { label: 'Banheiro', value: vehicle.hasBathroom },
    { label: 'Bancos Reclináveis', value: vehicle.hasReclinableSeats },
    { label: 'USB', value: vehicle.hasUsb },
    { label: 'Porta Pacote', value: vehicle.hasPackageHolder },
    { label: 'Sistema de Som', value: vehicle.hasSoundSystem },
    { label: 'TV/Monitor', value: vehicle.hasTv },
    { label: 'Wi-Fi', value: vehicle.hasWifi },
    { label: 'Vidro Basculante', value: vehicle.hasTiltingGlass },
    { label: 'Vidro Colado', value: vehicle.hasGluedGlass },
    { label: 'Cortina', value: vehicle.hasCurtain },
    { label: 'Acessibilidade', value: vehicle.hasAccessibility }
  ];

  optionals.forEach(opt => {
    if (yPos > pageHeight - 15) {
      pdf.addPage();
      yPos = margin;
    }
    pdf.text(`${opt.label}: ${opt.value ? 'Sim' : 'Não'}`, margin, yPos);
    yPos += 6;
  });

  // Incluir a mesma primeira imagem tratada exibida no grid.
  // `allImages` já prioriza `treatedPhotos` antes de `originalPhotos`.
  // Antes pulávamos o índice 0 aqui; agora incluímos para garantir que
  // a imagem mostrada no grid também apareça na galeria do PDF.
  const galleryImages = vehicle.allImages.slice(0, 11);
  if (galleryImages.length > 0) {
    pdf.addPage();
    yPos = margin;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Galeria de Fotos', margin, yPos);
    yPos += 10;

    const vehicleUrl = getVehicleUrl(vehicle);

    for (let i = 0; i < galleryImages.length; i += 2) {
      if (yPos > pageHeight - 100) {
        pdf.addPage();
        yPos = margin;
      }

      const img1 = await loadAndResizeImage(galleryImages[i], 400, 300);
      if (img1) {
        pdf.addImage(img1, 'JPEG', margin, yPos, 85, 60);
        pdf.link(margin, yPos, 85, 60, { url: vehicleUrl });
      }

      if (i + 1 < galleryImages.length) {
        const img2 = await loadAndResizeImage(galleryImages[i + 1], 400, 300);
        if (img2) {
          pdf.addImage(img2, 'JPEG', pageWidth - margin - 85, yPos, 85, 60);
          pdf.link(pageWidth - margin - 85, yPos, 85, 60, { url: vehicleUrl });
        }
      }

      yPos += 70;
    }
  }

  if (vehicle.description) {
    pdf.addPage();
    yPos = margin;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Descrição', margin, yPos);
    yPos += 8;

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

  const filename = `Aurovel-RELATORIO-${vehicle.sku}-${slugify(vehicle.title)}-${formatDate()}.pdf`;
  pdf.save(filename);
}

export async function generateBatchPDF(vehicles: NormalizedVehicle[]): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  for (let i = 0; i < vehicles.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    const vehicle = vehicles[i];
    let yPos = margin;

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Aurovel - Relatório de Veículo', margin, yPos);
    yPos += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`SKU: ${vehicle.sku}`, margin, yPos);
    yPos += 6;

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(vehicle.title, margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const summary = [
      `Preço: ${vehicle.priceFormatted}`,
      `Localização: ${vehicle.city}/${vehicle.state}`,
      `Ano: ${vehicle.fabricationYear}/${vehicle.modelYear}`,
      `Categoria: ${vehicle.category} - ${vehicle.subcategory}`,
      `Fornecedor: ${vehicle.supplierContact}`
    ];

    summary.forEach(line => {
      pdf.text(line, margin, yPos);
      yPos += 5;
    });

    yPos += 5;
    if (vehicle.primaryImage) {
      const imageData = await loadAndResizeImage(vehicle.primaryImage, 400, 300);
      if (imageData) {
        const imgWidth = 160;
        const imgHeight = 100;
        pdf.addImage(imageData, 'JPEG', margin, yPos, imgWidth, imgHeight);

        const vehicleUrl = getVehicleUrl(vehicle);
        pdf.link(margin, yPos, imgWidth, imgHeight, { url: vehicleUrl });
      }
    }
  }

  const filename = `Aurovel-RELATORIOS-${formatDate()}.pdf`;
  pdf.save(filename);
}
