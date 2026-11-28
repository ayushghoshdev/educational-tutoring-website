import Image from "next/image";
import { Check, NotebookPen } from "lucide-react";
import { cn, getPortalAvatarUrl } from "@/lib/utils";

export type AssignmentCardProps = {
  title: string;
  teacher: string;
  teacherAvatar?: string;
  mode: string;
  dueDate?: string;
  time?: string;
  grade?: string;
  marks?: string;
};

export default function AssignmentCard({
  title,
  teacher,
  teacherAvatar,
  mode,
  dueDate,
  time,
  grade,
  marks,
}: AssignmentCardProps) {
  const isCompleted = Boolean(grade || marks);

  return (
    <button
      type="button"
      className={cn(
        "w-full text-left cursor-pointer rounded-lg bg-assignment-card hover:bg-assignment-card-hover px-3.5 py-3 transition-[background-color,opacity] flex items-center justify-between gap-3",
        isCompleted && "opacity-70 hover:opacity-95",
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative h-9 w-9 rounded-lg bg-assignment-icon flex items-center justify-center shrink-0">
          <NotebookPen size={17} className="text-foreground/90" />
          {isCompleted && (
            <span
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center"
              aria-label="Completed"
            >
              <Check size={10} strokeWidth={3} className="text-zinc-950" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate leading-5">
            {title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground min-w-0">
            <Image
              src={teacherAvatar || getPortalAvatarUrl(teacher)}
              width={15}
              height={15}
              alt={teacher}
              className="rounded-full shrink-0"
              unoptimized
            />
            <span className="truncate">{teacher}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5 shrink-0">
        {isCompleted ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/90 tabular-nums whitespace-nowrap">
            {grade && <span>{grade}</span>}
            {grade && marks && (
              <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block shrink-0" />
            )}
            {marks && <span>{marks}</span>}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/90 whitespace-nowrap">
            {dueDate && <span>{dueDate}</span>}
            {dueDate && time && (
              <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block shrink-0" />
            )}
            {time && <span className="tabular-nums">{time}</span>}
          </div>
        )}
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {mode}
        </span>
      </div>
    </button>
  );
}
