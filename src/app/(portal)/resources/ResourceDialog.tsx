"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export interface ResourceItem {
  id: number;
  title: string;
  teacher: string;
  sharedTime: string;
  fileUrl: string;
  category?: string;
}

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: ResourceItem | null;
}

export function ResourceDialog({
  open,
  onOpenChange,
  resource,
}: ResourceDialogProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl ring-0! [&_button:focus]:ring-0! [&_button:focus]:ring-offset-0!">
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            Resource
          </DialogTitle>
        </DialogHeader>

        <div>
          <p className="text-lg font-medium text-foreground">{resource.title}</p>

          <div className="flex items-center gap-1 mt-0.5">
            <Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                resource.teacher,
              )}&background=0A0A0A&color=fff`}
              width={18}
              height={18}
              alt={resource.teacher}
              className="rounded-full shrink-0"
            />
            <p className="text-sm text-muted-foreground">{resource.teacher}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <p>Shared {resource.sharedTime}</p>
          </div>

          <div className="mt-4 rounded-lg overflow-hidden border border-border bg-muted/20">
            <iframe
              src={resource.fileUrl}
              className="w-full h-[500px] border-0 block"
              title={resource.title}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

