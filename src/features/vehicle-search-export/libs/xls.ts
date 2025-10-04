import * as XLSX from 'xlsx';
import { NormalizedVehicle } from '../types';

function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hour}${minute}`;
}

export function exportToExcel(vehicles: NormalizedVehicle[]): void {
  const data = vehicles.map(v => ({
    'SKU': v.sku,
    'Nome do Produto': v.title,
    'Status do Produto': v.status,
    'Preço': v.price,
    'Cidade do Produto': v.city,
    'Estado': v.state,
    'Quantidade Disp.': v.quantity,
    'Fornecedor': v.supplierContact,
    'Telefone Fornecedor': v.supplierPhone,
    'Empresa Fornecedor': v.supplierCompany,
    'Ano Fabricação': v.fabricationYear,
    'Ano Modelo': v.modelYear,
    'Fab. Chassi': v.chassisManufacturer,
    'Modelo Chassi': v.chassisModel,
    'Fab. Carroceria': v.bodyManufacturer,
    'Modelo Carroceria': v.bodyModel,
    'Categoria': v.category,
    'Sub-Categoria': v.subcategory,
    'Sistema de Tração': v.driveSystem,
    'Posição de Motor': v.enginePosition,
    'Opcionais do Produto': v.optionalsList,
    'Tem Ar-Condicionado?': v.hasAirConditioning,
    'Tem Banheiro?': v.hasBathroom,
    'Tem Bancos Reclináveis?': v.hasReclinableSeats,
    'Tem USB?': v.hasUsb,
    'Tem Porta Pacote?': v.hasPackageHolder,
    'Tem Sistema de Som?': v.hasSoundSystem,
    'Tem TV?': v.hasTv,
    'Tem Wifi?': v.hasWifi,
    'Tem Vidro Basculante?': v.hasTiltingGlass,
    'Tem Vidro Colado?': v.hasGluedGlass,
    'Tem Cortina?': v.hasCurtain,
    'Acessibilidade?': v.hasAccessibility,
    'Imagem Principal': v.primaryImage,
    'Link Anúncio': v.announcementLink
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 15 },
    { wch: 40 },
    { wch: 15 },
    { wch: 12 },
    { wch: 20 },
    { wch: 8 },
    { wch: 10 },
    { wch: 30 },
    { wch: 15 },
    { wch: 30 },
    { wch: 12 },
    { wch: 12 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 40 },
    { wch: 15 },
    { wch: 12 },
    { wch: 18 },
    { wch: 10 },
    { wch: 15 },
    { wch: 18 },
    { wch: 10 },
    { wch: 10 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 40 },
    { wch: 40 }
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Veículos');

  const filename = `Aurovel-PESQUISA-${formatDate()}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
