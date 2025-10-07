import { NormalizedVehicle } from '../../types';
import { ReportType, ReportMetadata } from '../../types/reports';
import { generateCommercialProposal, generateComparison, generateAvailability } from './commercial';
import { generateTechnicalSheet, generateSeatsConfiguration } from './technical';
import { generateMarketAnalysis, generateInventoryByLocation, generateCategoryReport } from './analytical';
import { generateVehiclePDF, generateBatchPDF } from '../pdf';
import { toast } from 'sonner';

export async function generateReport(
  type: ReportType,
  vehicles: NormalizedVehicle[],
  metadata?: ReportMetadata
): Promise<void> {
  try {
    switch (type) {
      case 'catalog':
        if (vehicles.length === 1) {
          await generateVehiclePDF(vehicles[0]);
        } else {
          await generateBatchPDF(vehicles);
        }
        break;

      case 'commercial-proposal':
        await generateCommercialProposal(vehicles, metadata || {
          title: 'Proposta Comercial',
          companyName: 'Aurovel Veículos',
          contactInfo: {
            phone: '(11) 9999-9999',
            email: 'contato@aurovel.com.br',
            website: 'www.aurovel.com.br'
          }
        });
        break;

      case 'comparison':
        if (vehicles.length > 4) {
          toast.error('Selecione no máximo 4 veículos para comparação');
          return;
        }
        await generateComparison(vehicles);
        break;

      case 'availability':
        await generateAvailability(vehicles);
        break;

      case 'technical-sheet':
        if (vehicles.length === 1) {
          await generateTechnicalSheet(vehicles[0]);
        } else {
          for (const vehicle of vehicles) {
            await generateTechnicalSheet(vehicle);
          }
        }
        break;

      case 'seats-configuration':
        if (vehicles.length === 1) {
          await generateSeatsConfiguration(vehicles[0]);
        } else {
          for (const vehicle of vehicles) {
            await generateSeatsConfiguration(vehicle);
          }
        }
        break;

      case 'market-analysis':
        await generateMarketAnalysis(vehicles);
        break;

      case 'inventory-location':
        await generateInventoryByLocation(vehicles);
        break;

      case 'category-report':
        await generateCategoryReport(vehicles);
        break;

      case 'maintenance-history':
      case 'sales-performance':
      case 'optionals-equipment':
      case 'financial-analysis':
      case 'pricing-conditions':
        toast.info(`Relatório "${type}" será implementado em breve`);
        break;

      default:
        toast.error('Tipo de relatório não reconhecido');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}
