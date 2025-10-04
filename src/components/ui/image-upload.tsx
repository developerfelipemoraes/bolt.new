import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Star, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  title: string;
  description?: string;
  showHighlight?: boolean;
  maxFiles?: number;
  acceptedTypes?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  files,
  onChange,
  title,
  description,
  showHighlight = false,
  maxFiles,
  acceptedTypes = 'image/*'
}) => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Converte arquivos em objetos com preview
  React.useEffect(() => {
    const convertFilesToImageFiles = async () => {
      const newImageFiles = await Promise.all(
        files.map(async (file, index) => ({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${index}-${Date.now()}`
        }))
      );
      
      // Limpar URLs antigas para evitar memory leaks
      imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
      setImageFiles(newImageFiles);
    };

    convertFilesToImageFiles();

    // Cleanup function
    return () => {
      imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [files]);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB max
    );

    if (maxFiles && files.length + validFiles.length > maxFiles) {
      const remainingSlots = maxFiles - files.length;
      onChange([...files, ...validFiles.slice(0, remainingSlots)]);
    } else {
      onChange([...files, ...validFiles]);
    }
  }, [files, onChange, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= files.length) return;
    
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    onChange(newFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5" />
        <h4 className="text-lg font-medium">{title}</h4>
      </div>
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">
          Arraste e solte as imagens ou clique para selecionar
        </p>
        <p className="text-xs text-gray-500">
          Formatos suportados: JPG, PNG, GIF. Máximo 10MB por imagem.
          {maxFiles && ` Máximo ${maxFiles} imagens.`}
        </p>
        <Button type="button" variant="outline" className="mt-2">
          Selecionar Imagens
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Image Grid with Preview */}
      {imageFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Imagens Selecionadas ({imageFiles.length})</h5>
            {showHighlight && imageFiles.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span>Primeira imagem será o destaque</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {imageFiles.map((imageFile, index) => (
              <Card key={imageFile.id} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    {/* Image Preview */}
                    <img
                      src={imageFile.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        // Opcional: fazer algo quando a imagem carregar
                      }}
                    />

                    {/* Highlight Badge */}
                    {showHighlight && index === 0 && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Destaque
                      </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {/* Move Left Button */}
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(index, index - 1);
                          }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      {/* Move Right Button */}
                      {index < imageFiles.length - 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(index, index + 1);
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Image Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                      <p className="text-xs truncate">{imageFile.file.name}</p>
                      <p className="text-xs text-gray-300">
                        {(imageFile.file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Dicas:</strong> Passe o mouse sobre as imagens para ver os controles de reordenação e remoção. 
              Use as setas para reorganizar a ordem das imagens.
              {showHighlight && " A primeira imagem será usada como destaque."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};