import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import {
  Armchair,
  Bus,
  Star,
  Settings,
  Download,
  X,
  Loader2
} from 'lucide-react';

interface GeradorAnuncioProps {
  imagem_onibus: string;
  chassi_marca_modelo: string;
  carroceria_marca_modelo: string;
  ano_veiculo: string;
  preco: string;
  qtd_disponivel: number;
  qtd_lugares: number;
  opcionais: string[];
  onClose?: () => void;
}

export function GeradorAnuncioAurovel({
  imagem_onibus,
  chassi_marca_modelo,
  carroceria_marca_modelo,
  ano_veiculo,
  preco,
  qtd_disponivel,
  qtd_lugares,
  opcionais,
  onClose
}: GeradorAnuncioProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!adRef.current) return;

    try {
      setIsGenerating(true);
      const canvas = await html2canvas(adRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0b2c4d',
        width: 1080,
        height: 1080,
        onclone: (documentClone) => {
            // Ensure the clone has the correct size if hidden or scaled down in UI
            const element = documentClone.querySelector('[data-ad-container]') as HTMLElement;
            if (element) {
                element.style.transform = 'none';
                element.style.width = '1080px';
                element.style.height = '1080px';
            }
        }
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `anuncio-aurovel-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Process optionals: take top 5 to fit layout
  const displayOptionals = opcionais.slice(0, 5);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 w-full justify-end">
        <Button variant="outline" onClick={onClose} disabled={isGenerating}>
          <X className="w-4 h-4 mr-2" />
          Fechar
        </Button>
        <Button onClick={handleDownload} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Baixar Imagem
        </Button>
      </div>

      {/* Container Preview - Scaled down for UI but rendered at 1080p */}
      <div className="overflow-hidden border rounded-lg shadow-xl" style={{ maxWidth: '100%', maxHeight: '80vh' }}>
        <div
          style={{
            width: '1080px',
            height: '1080px',
            transform: 'scale(0.4)', // Scale for preview
            transformOrigin: 'top left',
            marginBottom: '-648px', // Compensate for scale (1080 * 0.6)
            marginRight: '-648px'   // Compensate for scale
          }}
        >
          <div
            ref={adRef}
            data-ad-container
            className="w-[1080px] h-[1080px] relative flex flex-col"
            style={{
              backgroundColor: '#0b2c4d', // Navy Blue
              color: 'white',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {/* Background Elements / Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b2c4d] to-[#06182a]" />

            {/* Header */}
            <header className="relative z-10 px-16 pt-12 flex justify-between items-center h-[180px]">
              {/* Logo Placeholder */}
              <div className="flex flex-col">
                <h1 className="text-6xl font-bold tracking-wider text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  AUROVEL
                </h1>
                <span className="text-xl text-gray-300 tracking-[0.3em] mt-2">VEÍCULOS E PEÇAS</span>
              </div>

              {/* Badge */}
              <div className="bg-[#fbbf24] text-black px-8 py-4 rounded-lg transform rotate-2 shadow-lg border-4 border-white/20">
                <span className="block text-xl font-bold uppercase tracking-wide text-center">Restam</span>
                <span className="block text-5xl font-black text-center leading-none my-1">{qtd_disponivel}</span>
                <span className="block text-xl font-bold uppercase tracking-wide text-center">Unidades</span>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 px-16 py-8 flex flex-col gap-8">

              {/* Image Frame */}
              <div className="bg-white p-4 rounded-xl shadow-2xl relative">
                <div className="aspect-[16/9] w-full bg-gray-200 rounded overflow-hidden relative">
                  {imagem_onibus ? (
                    <img
                      src={imagem_onibus}
                      alt="Veículo"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                      Sem Imagem
                    </div>
                  )}

                  {/* Floating Specs on Image */}
                  <div className="absolute bottom-6 right-6 flex gap-4">
                    <div className="bg-blue-600/90 backdrop-blur text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
                      <Armchair className="w-8 h-8" />
                      <div className="flex flex-col">
                        <span className="text-sm uppercase font-bold text-blue-100">Lugares</span>
                        <span className="text-2xl font-bold leading-none">{qtd_lugares}</span>
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur text-blue-900 px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg border-l-4 border-yellow-400">
                      <div className="flex flex-col">
                        <span className="text-sm uppercase font-bold text-gray-500">Ano</span>
                        <span className="text-2xl font-bold leading-none">{ano_veiculo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex justify-center mt-4">
                <div className="text-center">
                  <p className="text-blue-300 uppercase tracking-widest text-xl mb-2 font-medium">Investimento</p>
                  <div className="text-yellow-400 text-8xl font-black drop-shadow-lg tracking-tight">
                    {preco}
                  </div>
                </div>
              </div>

            </main>

            {/* Footer Technical Specs */}
            <footer className="relative z-10 bg-black/20 backdrop-blur-sm mt-auto border-t border-white/10">
              <div className="px-16 py-10 grid grid-cols-3 gap-8 text-white">

                {/* Chassis */}
                <div className="flex gap-4 items-start border-r border-white/10 pr-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-300 text-lg font-bold uppercase mb-1">Chassi</h3>
                    <p className="text-2xl font-semibold leading-tight">{chassi_marca_modelo}</p>
                  </div>
                </div>

                {/* Bodywork */}
                <div className="flex gap-4 items-start border-r border-white/10 pr-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Bus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-300 text-lg font-bold uppercase mb-1">Carroceria</h3>
                    <p className="text-2xl font-semibold leading-tight">{carroceria_marca_modelo}</p>
                  </div>
                </div>

                {/* Optionals */}
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-300 text-lg font-bold uppercase mb-1">Opcionais</h3>
                    <ul className="text-lg leading-snug space-y-1">
                      {displayOptionals.length > 0 ? displayOptionals.map((opt, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                          <span className="truncate">{opt}</span>
                        </li>
                      )) : (
                         <li className="text-gray-400">Nenhum opcional listado</li>
                      )}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Bottom Bar */}
              <div className="bg-[#06182a] py-4 px-16 flex justify-between items-center text-sm text-gray-400">
                <span>www.aurovel.com.br</span>
                <span>(XX) XXXX-XXXX</span>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}
