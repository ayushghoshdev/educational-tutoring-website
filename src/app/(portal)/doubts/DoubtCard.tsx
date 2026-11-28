import Image from "next/image";
import { Check, MessageCircleQuestionMark, X } from "lucide-react";
import { cn, getPortalAvatarUrl } from "@/lib/utils";

type DoubtCardProps = {
  title: string;
  teacher: string;
  teacherAvatar?: string;
  askedTime: string;
  status?: "resolved" | "unresolved" | string;
  isTeacher?: boolean;
};

export default function DoubtCard({
  title,
  teacher,
  teacherAvatar,
  askedTime,
  status,
  isTeacher = false,
}: DoubtCardProps) {
  const isResolved = status?.toLowerCase() === "resolved";
  const isUnresolved = status?.toLowerCase() === "unresolved";

  return (
    <button
      type="button"
      className={cn(
        "w-full text-left cursor-pointer rounded-lg bg-doubt-card hover:bg-doubt-card-hover px-3.5 py-3 transition-[background-color,opacity] flex items-center justify-between gap-3",
        isResolved && "opacity-70 hover:opacity-95",
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative h-9 w-9 rounded-lg bg-doubt-icon flex items-center justify-center shrink-0">
          <MessageCircleQuestionMark
            size={17}
            className="text-muted-foreground"
          />
          {isResolved && (
            <span
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center"
              aria-label="Resolved"
            >
              <Check size={10} strokeWidth={3} className="text-zinc-950" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate leading-5">
            {title}
          </p>
          {!isTeacher && (
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground min-w-0">
              <span className="shrink-0">Asked to</span>
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
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Asked {askedTime}
        </span>
        {status && (
          <span className="inline-flex items-center gap-1 text-xs text-foreground/80 whitespace-nowrap">
            {isResolved && <Check className="w-3.5 h-3.5" />}
            {isUnresolved && <X className="w-3.5 h-3.5" />}
            <span className="capitalize">{status}</span>
          </span>
        )}
      </div>
    </button>
  );
}
