import Image from "next/image";
import { ClipboardClock } from "lucide-react";
import { ExamItem } from "./types";

export default function ExamCard({
  name,
  teacher,
  teacherAvatar,
  startTime,
  endTime,
  mode,
}: ExamItem) {
  return (
    <button
      type="button"
      className="w-full text-left cursor-pointer rounded-lg bg-exam-card hover:bg-exam-card-hover px-3.5 py-3 transition-colors flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-9 w-9 rounded-lg bg-exam-icon flex items-center justify-center shrink-0">
          <ClipboardClock size={17} className="text-foreground/90" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate leading-5">
            {name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground min-w-0">
            {teacherAvatar && (
              <Image
                src={teacherAvatar}
                width={15}
                height={15}
                alt={teacher}
                className="rounded-full shrink-0"
                unoptimized
              />
            )}
            <span className="truncate">{teacher}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-xs font-medium text-foreground/90 tabular-nums whitespace-nowrap">
          {startTime}{" "}
          <span className="text-muted-foreground font-normal">-</span>{" "}
          {endTime}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {mode}
        </span>
      </div>
    </button>
  );
}
