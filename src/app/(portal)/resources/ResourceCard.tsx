import Image from "next/image";
import { FolderOpen } from "lucide-react";
import { getPortalAvatarUrl } from "@/lib/utils";

type ResourceCardProps = {
  title: string;
  teacher: string;
  teacherAvatar?: string;
  sharedTime: string;
  onClick: () => void;
};

export default function ResourceCard({
  title,
  teacher,
  teacherAvatar,
  sharedTime,
  onClick,
}: ResourceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left cursor-pointer rounded-lg bg-doubt-card hover:bg-doubt-card-hover px-3.5 py-3 transition-colors flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-9 w-9 rounded-lg bg-doubt-icon flex items-center justify-center shrink-0">
          <FolderOpen size={17} className="text-muted-foreground" />
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

      <div className="flex flex-col items-end shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Shared {sharedTime}
        </span>
      </div>
    </button>
  );
}
