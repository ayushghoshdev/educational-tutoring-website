"use client";

import { useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudentItem {
  id: string;
  name: string;
}

export const sampleStudents: StudentItem[] = [
  { id: "student-1", name: "Student 1" },
  { id: "student-2", name: "Student 2" },
  { id: "student-3", name: "Student 3" },
  { id: "student-4", name: "Student 4" },
  { id: "student-5", name: "Student 5" },
  { id: "student-6", name: "Student 6" },
];

interface StudentAllotmentSelectorProps {
  selectedStudentIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  students?: StudentItem[];
  className?: string;
}

export function StudentAllotmentSelector({
  selectedStudentIds,
  onChange,
  label = "Allot to Students",
  students = sampleStudents,
  className,
}: StudentAllotmentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      onChange(selectedStudentIds.filter((item) => item !== id));
    } else {
      onChange([...selectedStudentIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      onChange([]);
    } else {
      onChange(students.map((s) => s.id));
    }
  };

  return (
    <div className={cn("pt-1", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-1 text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {selectedStudentIds.length > 0 && (
            <span className="text-xs text-muted-foreground font-normal">
              ({selectedStudentIds.length} selected)
            </span>
          )}
        </div>
        <ChevronRight
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            isOpen && "rotate-90",
          )}
        />
      </button>

      {isOpen && (
        <div className="mt-1 space-y-1 max-h-35 overflow-y-auto overflow-x-hidden pr-2">
          {students.map((s) => {
            const isSelected = selectedStudentIds.includes(s.id);
            return (
              <div
                key={s.id}
                onClick={() => toggleStudent(s.id)}
                className="flex items-center justify-between py-1.5 px-1 cursor-pointer transition-colors text-sm hover:text-foreground select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      s.name,
                    )}&background=0A0A0A&color=fff`}
                    width={20}
                    height={20}
                    alt={s.name}
                    className="rounded-full shrink-0"
                  />
                  <span
                    className={cn(
                      "text-sm transition-colors truncate",
                      isSelected
                        ? "text-foreground font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {s.name}
                  </span>
                </div>
                <div className="shrink-0 mr-1 flex items-center">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleStudent(s.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
