"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PdfUploadZoneProps {
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  // single-file backwards compatibility
  file?: File | null;
  onFileSelect?: (file: File | null) => void;
  maxFiles?: number;
  className?: string;
  label?: string;
}

export function PdfUploadZone({
  files: propFiles,
  onFilesChange,
  file: singleFile,
  onFileSelect,
  maxFiles = 1,
  className,
  label = "Upload PDF",
}: PdfUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize files array from either propFiles or singleFile
  const currentFiles: File[] = propFiles
    ? propFiles
    : singleFile
      ? [singleFile]
      : [];

  const updateFiles = (nextFiles: File[]) => {
    if (onFilesChange) {
      onFilesChange(nextFiles);
    }
    if (onFileSelect) {
      onFileSelect(nextFiles[0] || null);
    }
  };

  const processIncomingFiles = (incomingList: FileList | File[]) => {
    setError(null);
    const incomingArray = Array.from(incomingList);
    if (incomingArray.length === 0) return;

    const validPdfs: File[] = [];
    let hasNonPdf = false;

    for (const f of incomingArray) {
      const isPdf =
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        validPdfs.push(f);
      } else {
        hasNonPdf = true;
      }
    }

    if (hasNonPdf) {
      setError("Only PDF files are allowed.");
      toast.error("Only PDF files are allowed.");
    }

    if (validPdfs.length === 0) return;

    const totalCount = currentFiles.length + validPdfs.length;
    if (totalCount > maxFiles) {
      const message =
        maxFiles === 3
          ? "Max 3 files are allowed per resource"
          : `Max ${maxFiles} file${maxFiles > 1 ? "s are" : " is"} allowed`;

      toast(message, {
        id: "max-files-limit",
      });
    }

    const availableSlots = Math.max(0, maxFiles - currentFiles.length);
    const filesToAdd = validPdfs.slice(0, availableSlots);

    if (filesToAdd.length > 0) {
      updateFiles([...currentFiles, ...filesToAdd]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
    }
  };

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = currentFiles.filter((_, i) => i !== index);
    updateFiles(updated);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Render list of selected files */}
      {currentFiles.length > 0 && (
        <div className="space-y-1.5">
          {currentFiles.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary transition-all duration-200"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate max-w-[280px] sm:max-w-[340px]">
                    {f.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(f.size)} • PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleRemove(idx, e)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2 cursor-pointer"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Render dropzone if below maxFiles limit */}
      {currentFiles.length < maxFiles && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "w-full p-5 rounded-lg border-2 border-dashed text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-foreground/30",
          )}
        >
          <div className="p-2.5 rounded-full bg-background/60 text-muted-foreground">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {currentFiles.length > 0 ? "Add another PDF" : label}
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground/80">
            PDF files only {maxFiles > 1 ? `(max ${maxFiles} files)` : ""}
          </span>
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
