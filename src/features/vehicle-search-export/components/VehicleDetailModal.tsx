import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getVehicleUrl } from '../libs/pdf-utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NormalizedVehicle } from '../types';
import { Check, X } from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: NormalizedVehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDetailModal({ vehicle, isOpen, onClose }: VehicleDetailModalProps) {
  if (!vehicle) return null;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const renderBoolean = (value: boolean, label: string) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {value ? (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <Check className="w-3 h-3 mr-1" /> Sim
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-400 border-gray-200">
          <X className="w-3 h-3 mr-1" /> Não
        </Badge>
      )}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="col-span-2 text-sm text-gray-900 font-medium">{value || '-'}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b flex items-start justify-between">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {vehicle.title}
            <Badge variant="secondary" className="ml-2">{vehicle.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            ID: {vehicle.id} • SKU: {vehicle.sku}
          </DialogDescription>
          <div className="ml-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                if (!contentRef.current) return;
                setIsGenerating(true);
                try {
                  const canvas = await html2canvas(contentRef.current, { useCORS: true, scale: 2, backgroundColor: '#ffffff' });
                  const imgData = canvas.toDataURL('image/jpeg', 0.9);

                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const pageWidth = pdf.internal.pageSize.getWidth();
                  const margin = 15;
                  const maxWidth = pageWidth - margin * 2;

                  const img = new Image();
                  img.src = imgData;
                  await new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); });

                  const ratio = (img.width && img.height) ? (img.height / img.width) : 1;
                  const imgWidth = maxWidth;
                  const imgHeight = imgWidth * ratio;

                  pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
                  const vehicleUrl = getVehicleUrl(vehicle);
                  pdf.link(margin, margin, imgWidth, imgHeight, { url: vehicleUrl });

                  pdf.setFontSize(12);
                  pdf.text(`${vehicle.title} — ${vehicle.priceFormatted}`, margin, margin + imgHeight + 10);

                  const filename = `Proposta-Comercial-${vehicle.sku}-${Date.now()}.pdf`;
                  pdf.save(filename);
                } catch (err) {
                  console.error('Erro ao gerar proposta via captura:', err);
                  toast.error('Erro ao gerar proposta. Verifique CORS das imagens.');
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Gerar Proposta'}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6">
          <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Main Info & Image */}
            <div className="space-y-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                {vehicle.primaryImage ? (
                  <img
                    src={vehicle.primaryImage}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Sem imagem principal
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Informações de Venda</h3>
                <div className="space-y-1">
                  <InfoRow label="Preço" value={vehicle.priceFormatted} />
                  <InfoRow label="Qtd. Disponível" value={vehicle.quantity} />
                  <InfoRow label="Cidade/UF" value={`${vehicle.city} - ${vehicle.state}`} />
                  <InfoRow label="Contato" value={vehicle.supplierContact} />
                  <InfoRow label="Telefone" value={vehicle.supplierPhone} />
                  <InfoRow label="Empresa" value={vehicle.supplierCompany} />
                </div>
              </div>
            </div>

            {/* Right Column - Technical Details */}
            <div className="space-y-6">

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  Dados Técnicos
                </h3>
                <div className="bg-white rounded-lg border p-4 space-y-1">
                  <InfoRow label="Ano Fab./Mod." value={`${vehicle.fabricationYear} / ${vehicle.modelYear}`} />
                  <InfoRow label="Chassi" value={`${vehicle.chassisManufacturer} ${vehicle.chassisModel}`} />
                  <InfoRow label="Carroceria" value={`${vehicle.bodyManufacturer} ${vehicle.bodyModel}`} />
                  <InfoRow label="Categoria" value={vehicle.category} />
                  <InfoRow label="Subcategoria" value={vehicle.subcategory} />
                  <InfoRow label="Motor" value={`${vehicle.driveSystem} - ${vehicle.enginePosition}`} />
                  <InfoRow label="Lugares" value={vehicle.rawData.seatComposition?.totalCapacity} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Opcionais e Recursos</h3>
                <div className="bg-white rounded-lg border p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {renderBoolean(vehicle.hasAirConditioning, 'Ar Condicionado')}
                  {renderBoolean(vehicle.hasBathroom, 'Banheiro')}
                  {renderBoolean(vehicle.hasReclinableSeats, 'Bancos Reclináveis')}
                  {renderBoolean(vehicle.hasUsb, 'Entrada USB')}
                  {renderBoolean(vehicle.hasPackageHolder, 'Porta Pacotes')}
                  {renderBoolean(vehicle.hasSoundSystem, 'Sistema de Som')}
                  {renderBoolean(vehicle.hasTv, 'TV / Monitor')}
                  {renderBoolean(vehicle.hasWifi, 'Wi-Fi')}
                  {renderBoolean(vehicle.hasAccessibility, 'Acessibilidade')}
                  {renderBoolean(vehicle.hasTiltingGlass, 'Vidro Basculante')}
                  {renderBoolean(vehicle.hasGluedGlass, 'Vidro Colado')}
                  {renderBoolean(vehicle.hasCurtain, 'Cortinas')}
                </div>
              </div>

              {vehicle.optionalsList && (
                 <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Lista de Opcionais (Texto)</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                      {vehicle.optionalsList}
                    </p>
                 </div>
              )}

            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
