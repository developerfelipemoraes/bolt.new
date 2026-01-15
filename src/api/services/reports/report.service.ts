import { ApiFactory } from '@/api/factory/apiFactory';
import { ReportPayload } from './report.types';
import { API_CONFIG } from '@/api/config/api.config';

class ReportService {
  private api = ApiFactory.getInstance();

  async generatePdf(payload: ReportPayload): Promise<Blob> {
    const response = await this.api.post<Blob>(
      '/reports/pdf',
      payload,
      {
        baseURL: API_CONFIG.reports.baseURL,
        responseType: 'blob'
      }
    );
    return response.data;
  }
}

export const reportService = new ReportService();
