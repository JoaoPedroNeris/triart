"use client";

import { useState, useRef } from "react";
import { PhotoDocument } from "@/types/stand";
import { addPhoto, deletePhoto } from "@/lib/firebase/firestore";
import { uploadFile, deleteStorageFile } from "@/lib/firebase/storage";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StandPhotosProps {
  standId: number;
  photos: PhotoDocument[];
  readOnly: boolean;
}

export function StandPhotos({ standId, photos, readOnly }: StandPhotosProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setProgress(0);
    try {
      const path = `stands/stand_${standId}/photos/${Date.now()}_${file.name}`;
      const { url, storagePath } = await uploadFile(path, file, setProgress);
      await addPhoto(standId, {
        url,
        storagePath,
        uploadedAt: Timestamp.now(),
        uploadedBy: user.uid,
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(photo: PhotoDocument) {
    try {
      await deleteStorageFile(photo.storagePath);
    } catch { /* file may already be deleted */ }
    await deletePhoto(standId, photo.id);
  }

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            className="rounded-xl border-dashed border-2 border-triart-green/30 text-triart-green hover:bg-triart-green/5 h-12 w-full"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Camera className="w-4 h-4 mr-2" />
            )}
            {uploading ? "Enviando..." : "Adicionar Foto"}
          </Button>
          {uploading && <Progress value={progress} className="mt-2 h-1.5" />}
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-sm text-triart-gray text-center py-8">Nenhuma foto adicionada.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-triart-gray-light">
              <button
                onClick={() => setPreview(photo.url)}
                className="w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="Foto do stand"
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-[10px] text-white/80">
                  {photo.uploadedAt?.toDate
                    ? format(photo.uploadedAt.toDate(), "dd MMM yyyy, HH:mm", { locale: ptBR })
                    : ""}
                </p>
              </div>
              {!readOnly && (
                <button
                  onClick={() => handleDelete(photo)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
