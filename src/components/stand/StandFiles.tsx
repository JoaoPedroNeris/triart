"use client";

import { useState, useRef } from "react";
import { StandFile, DriveLink } from "@/types/stand";
import { addFile, deleteFile } from "@/lib/firebase/firestore";
import { uploadFile, deleteStorageFile } from "@/lib/firebase/storage";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Trash2,
  FileText,
  Download,
  ExternalLink,
  Link2,
  Plus,
  Loader2,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StandFilesProps {
  standId: number;
  files: StandFile[];
  driveLinks: DriveLink[];
  readOnly: boolean;
  onUpdateDriveLinks: (links: DriveLink[]) => Promise<void>;
}

export function StandFiles({
  standId,
  files,
  driveLinks,
  readOnly,
  onUpdateDriveLinks,
}: StandFilesProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setProgress(0);
    try {
      const path = `stands/stand_${standId}/files/${Date.now()}_${file.name}`;
      const { url, storagePath } = await uploadFile(path, file, setProgress);
      await addFile(standId, {
        name: file.name,
        url,
        storagePath,
        size: file.size,
        uploadedAt: Timestamp.now(),
        uploadedBy: user.uid,
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDeleteFile(f: StandFile) {
    try {
      await deleteStorageFile(f.storagePath);
    } catch { /* ignore */ }
    await deleteFile(standId, f.id);
  }

  async function handleAddLink() {
    if (!linkTitle.trim() || !linkUrl.trim() || !user) return;
    const newLink: DriveLink = {
      id: `link_${Date.now()}`,
      title: linkTitle.trim(),
      url: linkUrl.trim(),
      addedAt: Timestamp.now(),
      addedBy: user.uid,
    };
    await onUpdateDriveLinks([...driveLinks, newLink]);
    setLinkTitle("");
    setLinkUrl("");
  }

  async function handleRemoveLink(id: string) {
    await onUpdateDriveLinks(driveLinks.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-triart-black flex items-center gap-2">
          <FileText className="w-4 h-4 text-triart-green" />
          Arquivos
        </h3>
        {!readOnly && (
          <div>
            <input ref={inputRef} type="file" onChange={handleUpload} className="hidden" />
            <Button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              variant="outline"
              className="w-full h-10 rounded-xl border-dashed border-2 border-triart-green/30 text-triart-green hover:bg-triart-green/5"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? "Enviando..." : "Upload de Arquivo"}
            </Button>
            {uploading && <Progress value={progress} className="mt-2 h-1.5" />}
          </div>
        )}

        {files.length === 0 ? (
          <p className="text-xs text-triart-gray text-center py-4">Nenhum arquivo enviado.</p>
        ) : (
          <div className="space-y-1">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-triart-gray-light/50 transition-apple">
                <FileText className="w-5 h-5 text-triart-green shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-triart-black truncate">{f.name}</p>
                  <p className="text-[10px] text-triart-gray">
                    {formatFileSize(f.size)} &middot;{" "}
                    {f.uploadedAt?.toDate
                      ? format(f.uploadedAt.toDate(), "dd MMM yyyy", { locale: ptBR })
                      : ""}
                  </p>
                </div>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-8 h-8 bg-triart-green/10 rounded-lg flex items-center justify-center hover:bg-triart-green/20 transition-apple"
                >
                  <Download className="w-4 h-4 text-triart-green" />
                </a>
                {!readOnly && (
                  <button
                    onClick={() => handleDeleteFile(f)}
                    className="shrink-0 text-triart-gray hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drive Links */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-triart-black flex items-center gap-2">
          <Link2 className="w-4 h-4 text-triart-green" />
          Links do Drive
        </h3>
        {!readOnly && (
          <div className="flex gap-2">
            <Input
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Titulo"
              className="flex-1 h-9 bg-triart-gray-light/50 border-0 rounded-xl text-sm"
            />
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL do Drive"
              className="flex-1 h-9 bg-triart-gray-light/50 border-0 rounded-xl text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
            />
            <button
              onClick={handleAddLink}
              disabled={!linkTitle.trim() || !linkUrl.trim()}
              className="h-9 w-9 bg-triart-green hover:bg-triart-green-dark text-white rounded-xl flex items-center justify-center shrink-0 transition-apple disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {driveLinks.length === 0 ? (
          <p className="text-xs text-triart-gray text-center py-4">Nenhum link adicionado.</p>
        ) : (
          <div className="space-y-1">
            {driveLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-triart-gray-light/50 transition-apple">
                <ExternalLink className="w-4 h-4 text-triart-green shrink-0" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-triart-green hover:underline truncate"
                >
                  {link.title}
                </a>
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveLink(link.id)}
                    className="shrink-0 text-triart-gray hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
