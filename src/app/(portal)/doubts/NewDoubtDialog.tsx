"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NewDoubtDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const teachers = [
  { id: "teacher-1", name: "Teacher Name 1" },
  { id: "teacher-2", name: "Teacher Name 2" },
];

export function NewDoubtDialog({ open, onOpenChange }: NewDoubtDialogProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const justClosedSelectRef = useRef(false);

  const handleSelectOpenChange = (isOpen: boolean) => {
    setSelectOpen(isOpen);
    if (!isOpen) {
      justClosedSelectRef.current = true;
      setTimeout(() => {
        justClosedSelectRef.current = false;
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => {
          if (selectOpen || justClosedSelectRef.current) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (selectOpen || justClosedSelectRef.current) {
            e.preventDefault();
          }
        }}
        className="sm:max-w-lg ring-0! [&_button:focus]:ring-0! [&_button:focus]:ring-offset-0!"
      >
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            Ask a Doubt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <input
            type="text"
            placeholder="Doubt title"
            maxLength={50}
            className="w-full px-3 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200 outline-none"
          />

          <textarea
            placeholder="Doubt description"
            maxLength={400}
            rows={4}
            className="w-full px-3 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200 outline-none resize-none"
          />

          <Select
            defaultValue="teacher-1"
            open={selectOpen}
            onOpenChange={handleSelectOpenChange}
          >
            <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          t.name,
                        )}&background=0A0A0A&color=fff`}
                        width={18}
                        height={18}
                        alt={t.name}
                        className="rounded-full shrink-0"
                      />
                      <span>{t.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex pt-2">
            <Button
              className="w-full"
              size="lg"
              onClick={() => onOpenChange(false)}
            >
              Ask
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
