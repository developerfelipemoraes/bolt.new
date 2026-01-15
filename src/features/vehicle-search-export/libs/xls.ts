import * as XLSX from 'xlsx';
import { NormalizedVehicle, SearchFilters } from '../types';

function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hour}${minute}`;
}

function formatFilters(filters: SearchFilters): Array<{ Filtro: string, Valor: string }> {
  const formatted: Array<{ Filtro: string, Valor: string }> = [];

  // Categorias
  if (filters.categories && filters.categories.length > 0) {
    formatted.push({ Filtro: 'Categorias', Valor: filters.categories.join(', ') });
  }

  // Subcategorias
  if (filters.subcategories && filters.subcategories.length > 0) {
    formatted.push({ Filtro: 'Sub-Categorias', Valor: filters.subcategories.join(', ') });
  }

  // Ano Fabricação
  if (filters.yearRange && (filters.yearRange[0] > 0 || filters.yearRange[1] < 9999)) {
    formatted.push({ Filtro: 'Ano Fabricação', Valor: `${filters.yearRange[0]} - ${filters.yearRange[1]}` });
  }

  // Ano Modelo
  if (filters.modelYearRange && (filters.modelYearRange[0] > 0 || filters.modelYearRange[1] < 9999)) {
    formatted.push({ Filtro: 'Ano Modelo', Valor: `${filters.modelYearRange[0]} - ${filters.modelYearRange[1]}` });
  }

  // Preço
  if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity)) {
    const max = filters.priceRange[1] === Infinity ? 'Infinito' : filters.priceRange[1];
    formatted.push({ Filtro: 'Preço', Valor: `R$ ${filters.priceRange[0]} - R$ ${max}` });
  }

  // Cidades e Estados
  if (filters.cities && filters.cities.length > 0) {
    formatted.push({ Filtro: 'Cidades', Valor: filters.cities.join(', ') });
  }
  if (filters.states && filters.states.length > 0) {
    formatted.push({ Filtro: 'Estados', Valor: filters.states.join(', ') });
  }

  // Status
  if (filters.status && filters.status.length > 0) {
    formatted.push({ Filtro: 'Status', Valor: filters.status.join(', ') });
  }

  // Ranges Numéricos
  if (filters.quantityRange && (filters.quantityRange[0] > 0 || filters.quantityRange[1] < 999)) {
    formatted.push({ Filtro: 'Quantidade', Valor: `${filters.quantityRange[0]} - ${filters.quantityRange[1]}` });
  }
  if (filters.doorCountRange && (filters.doorCountRange[0] > 0 || filters.doorCountRange[1] < 99)) {
    formatted.push({ Filtro: 'Portas', Valor: `${filters.doorCountRange[0]} - ${filters.doorCountRange[1]}` });
  }
  if (filters.totalSeatsRange && (filters.totalSeatsRange[0] > 0 || filters.totalSeatsRange[1] < 999)) {
    formatted.push({ Filtro: 'Total de Assentos', Valor: `${filters.totalSeatsRange[0]} - ${filters.totalSeatsRange[1]}` });
  }

  // Chassis Filters
  if (filters.chassisFilters) {
    const {
      tracaoSystems, axlesVehicles, engineLocations,
      chassisManufacturers, chassisModels, bodyManufacturers, bodyModels
    } = filters.chassisFilters;

    if (tracaoSystems && tracaoSystems.length > 0) formatted.push({ Filtro: 'Tração', Valor: tracaoSystems.join(', ') });
    if (axlesVehicles && axlesVehicles.length > 0) formatted.push({ Filtro: 'Eixos', Valor: axlesVehicles.join(', ') });
    if (engineLocations && engineLocations.length > 0) formatted.push({ Filtro: 'Posição do Motor', Valor: engineLocations.join(', ') });
    if (chassisManufacturers && chassisManufacturers.length > 0) formatted.push({ Filtro: 'Fab. Chassi', Valor: chassisManufacturers.join(', ') });
    if (chassisModels && chassisModels.length > 0) formatted.push({ Filtro: 'Modelo Chassi', Valor: chassisModels.join(', ') });
    if (bodyManufacturers && bodyManufacturers.length > 0) formatted.push({ Filtro: 'Fab. Carroceria', Valor: bodyManufacturers.join(', ') });
    if (bodyModels && bodyModels.length > 0) formatted.push({ Filtro: 'Modelo Carroceria', Valor: bodyModels.join(', ') });
  }

  // Power Filter
  if (filters.powerFilter) {
    if (filters.powerFilter.minPower > 0 || filters.powerFilter.maxPower > 0) {
      formatted.push({ Filtro: 'Potência (cv)', Valor: `${filters.powerFilter.minPower} - ${filters.powerFilter.maxPower}` });
    }
  }

  // Equipment Filters
  if (filters.equipmentFilters) {
    const { engineBrakeTypes, retarderTypes, suspensionTypes } = filters.equipmentFilters;
    if (engineBrakeTypes && engineBrakeTypes.length > 0) formatted.push({ Filtro: 'Freio Motor', Valor: engineBrakeTypes.join(', ') });
    if (retarderTypes && retarderTypes.length > 0) formatted.push({ Filtro: 'Retarder', Valor: retarderTypes.join(', ') });
    if (suspensionTypes && suspensionTypes.length > 0) formatted.push({ Filtro: 'Suspensão', Valor: suspensionTypes.join(', ') });
  }

  // Motor Filter
  if (filters.motorFilter && filters.motorFilter.engineNames && filters.motorFilter.engineNames.length > 0) {
    formatted.push({ Filtro: 'Motor', Valor: filters.motorFilter.engineNames.join(', ') });
  }

  // Opcionais
  if (filters.optionals) {
    const activeOptionals = Object.entries(filters.optionals)
      .filter(([_, value]) => value === true)
      .map(([key]) => {
        const labels: Record<string, string> = {
          airConditioning: 'Ar Condicionado',
          bathroom: 'Banheiro',
          reclinableSeats: 'Bancos Reclináveis',
          usb: 'USB',
          packageHolder: 'Porta Pacote',
          soundSystem: 'Som',
          tv: 'TV',
          wifi: 'Wifi',
          tiltingGlass: 'Vidro Basculante',
          gluedGlass: 'Vidro Colado',
          curtain: 'Cortina',
          accessibility: 'Acessibilidade'
        };
        return labels[key] || key;
      });

    if (activeOptionals.length > 0) {
      formatted.push({ Filtro: 'Opcionais', Valor: activeOptionals.join(', ') });
    }
  }

  return formatted;
}

export function exportToExcel(vehicles: NormalizedVehicle[], filters?: SearchFilters): void {
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
    'Categoria': v.category,
    'Sub-Categoria': v.subcategory,
    'Fab. Chassi': v.chassisManufacturer,
    'Modelo Chassi': v.chassisModel,
    'Fab. Carroceria': v.bodyManufacturer,
    'Modelo Carroceria': v.bodyModel,
    'Ano Fabricação': v.fabricationYear,
    'Ano Modelo': v.modelYear,
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

  if (filters) {
    const filterData = formatFilters(filters);
    if (filterData.length > 0) {
      const filterSheet = XLSX.utils.json_to_sheet(filterData);
      filterSheet['!cols'] = [{ wch: 30 }, { wch: 50 }]; // Adjust widths for filter sheet
      XLSX.utils.book_append_sheet(workbook, filterSheet, 'Filtros Ativos');
    }
  }

  const filename = `Aurovel-PESQUISA-${formatDate()}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
