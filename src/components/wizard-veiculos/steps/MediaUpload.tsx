import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, FileText } from 'lucide-react';
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
      video: undefined
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Upload de Mídia</h3>
        <p className="text-gray-600">Adicione fotos e vídeos do seu veículo</p>
      </div>

      {/* Fotos Originais */}
      <ImageUpload
        files={data.originalPhotos}
        onChange={(files) => onChange({ ...data, originalPhotos: files })}
        title="Fotos Originais (Uso Interno)"
        description="Estas fotos não serão publicadas, mas podem ser compartilhadas por WhatsApp ou e-mail."
        showHighlight={false}
      />

      {/* Fotos Tratadas */}
      <ImageUpload
        files={data.treatedPhotos}
        onChange={(files) => onChange({ ...data, treatedPhotos: files })}
        title="Fotos Tratadas (Para Publicação)"
        description="Primeira foto será o destaque. Resolução mínima: 600x600px."
        showHighlight={true}
      />

      {/* Fotos de Documentos */}
      <ImageUpload
        files={data.documentPhotos}
        onChange={(files) => onChange({ ...data, documentPhotos: files })}
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
        
        {!data.video ? (
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
              onChange={(e) => handleFileUpload(e.target.files, 'video')}
            />
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{data.video.name}</p>
                    <p className="text-sm text-gray-500">
                      {(data.video.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
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