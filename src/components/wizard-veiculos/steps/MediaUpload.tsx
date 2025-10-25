import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, X } from 'lucide-react';
import { ImageUpload } from '../../ui/image-upload';
import { MediaUpload as MediaUploadType } from '../../../types/vehicle';

interface MediaUploadProps {
  data: MediaUploadType;
  onChange: (data: MediaUploadType) => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ data, onChange }) => {
  const videoRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onChange({
      ...data,
      video: files[0]
    });
  };

  const removeVideo = () => {
    onChange({
      ...data,
      video: undefined,
      videoUrl: undefined
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Upload de Mídia</h3>
        <p className="text-gray-600">Adicione fotos e vídeos do seu veículo</p>
      </div>

      {/* Fotos Originais Internas */}
      <ImageUpload
        files={data.originalPhotosInterior || []}
        existingUrls={data.originalPhotosInteriorUrls || []}
        onChange={(files) => onChange({ ...data, originalPhotosInterior: files })}
        onExistingUrlsChange={(urls) => onChange({ ...data, originalPhotosInteriorUrls: urls })}
        title="Fotos Originais Internas (Uso Interno)"
        description="Fotos do interior do veículo. Não serão publicadas, mas podem ser compartilhadas por WhatsApp ou e-mail."
        showHighlight={false}
      />

      {/* Fotos Originais Externas */}
      <ImageUpload
        files={data.originalPhotosExterior || []}
        existingUrls={data.originalPhotosExteriorUrls || []}
        onChange={(files) => onChange({ ...data, originalPhotosExterior: files })}
        onExistingUrlsChange={(urls) => onChange({ ...data, originalPhotosExteriorUrls: urls })}
        title="Fotos Originais Externas (Uso Interno)"
        description="Fotos da parte externa do veículo. Não serão publicadas, mas podem ser compartilhadas por WhatsApp ou e-mail."
        showHighlight={false}
      />

      {/* Fotos Originais de Instrumentos */}
      <ImageUpload
        files={data.originalPhotosInstruments || []}
        existingUrls={data.originalPhotosInstrumentsUrls || []}
        onChange={(files) => onChange({ ...data, originalPhotosInstruments: files })}
        onExistingUrlsChange={(urls) => onChange({ ...data, originalPhotosInstrumentsUrls: urls })}
        title="Fotos Originais de Instrumentos (Uso Interno)"
        description="Fotos do painel e instrumentos do veículo. Não serão publicadas, mas podem ser compartilhadas por WhatsApp ou e-mail."
        showHighlight={false}
      />

      {/* Fotos Tratadas */}
      <ImageUpload
        files={data.treatedPhotos || []}
        existingUrls={data.treatedPhotosUrls || []}
        onChange={(files) => onChange({ ...data, treatedPhotos: files })}
        onExistingUrlsChange={(urls) => onChange({ ...data, treatedPhotosUrls: urls })}
        title="Fotos Tratadas (Para Publicação)"
        description="Primeira foto será o destaque. Resolução mínima: 600x600px."
        showHighlight={true}
      />

      {/* Fotos de Documentos */}
      <ImageUpload
        files={data.documentPhotos || []}
        existingUrls={data.documentPhotosUrls || []}
        onChange={(files) => onChange({ ...data, documentPhotos: files })}
        onExistingUrlsChange={(urls) => onChange({ ...data, documentPhotosUrls: urls })}
        title="Fotos de Documentos"
        description="Adicione fotos dos documentos do veículo (CRLV, nota fiscal, etc.)."
        showHighlight={false}
      />

      {/* Upload de Vídeo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          <Label className="text-lg font-medium">Vídeo (Opcional)</Label>
        </div>
        <p className="text-sm text-gray-600">
          Adicione um vídeo do veículo para mostrar mais detalhes.
        </p>
        
        {!data.video && !data.videoUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">Selecione um vídeo</p>
            <Button
              variant="outline"
              onClick={() => videoRef.current?.click()}
            >
              Selecionar Vídeo
            </Button>
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleVideoUpload(e.target.files)}
            />
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium">
                      {data.video ? data.video.name : 'Vídeo existente'}
                    </p>
                    {data.video && (
                      <p className="text-sm text-gray-500">
                        {(data.video.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
                    {data.videoUrl && !data.video && (
                      <p className="text-sm text-gray-500">URL: {data.videoUrl}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeVideo}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};