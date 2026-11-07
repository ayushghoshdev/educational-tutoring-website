"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PdfUploadZone } from "@/components/PdfUploadZone";

type NewResourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddResource?: (resource: { title: string; files: File[] }) => void;
};

export function NewResourceDialog({
  open,
  onOpenChange,
  onAddResource,
}: NewResourceDialogProps) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = () => {
    if (!title.trim() || files.length === 0) return;

    if (onAddResource) {
      onAddResource({ title: title.trim(), files });
    }
    setTitle("");
    setFiles([]);
    onOpenChange(false);
  };

  const isSubmitDisabled = !title.trim() || files.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg ring-0! [&_button:focus]:ring-0! [&_button:focus]:ring-offset-0!">
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            Upload Resource
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Resource title"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200 outline-none"
          />

          <PdfUploadZone
            files={files}
            onFilesChange={setFiles}
            maxFiles={3}
            label="Upload resource"
          />

          <div className="flex pt-2">
            <Button
              className="w-full cursor-pointer disabled:cursor-not-allowed"
              size="lg"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              Add Resource
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
