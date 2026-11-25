import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { ClassItem } from "./types";

export default function ClassCard({
  name,
  teacher,
  teacherAvatar,
  startTime,
  endTime,
  mode,
  attendees = [],
}: ClassItem) {
  const visibleAttendees = attendees.slice(0, 3);
  const extraCount = Math.max(0, attendees.length - 3);

  return (
    <button
      type="button"
      className="w-full text-left cursor-pointer rounded-lg bg-class-card hover:bg-class-card-hover px-3.5 py-3 transition-colors flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-9 w-9 rounded-lg bg-class-icon flex items-center justify-center shrink-0">
          <GraduationCap size={17} className="text-foreground/90" />
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
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block shrink-0" />
            <span className="shrink-0">{mode}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-xs font-medium text-foreground/90 tabular-nums whitespace-nowrap">
          {startTime}{" "}
          <span className="text-muted-foreground font-normal">-</span>{" "}
          {endTime}
        </span>

        {attendees.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center -space-x-1.5">
              {visibleAttendees.map((student, i) => (
                <Image
                  key={student.id || i}
                  src={student.avatarUrl}
                  width={18}
                  height={18}
                  alt={student.initials}
                  title={student.name}
                  className="h-4.5 w-4.5 rounded-full object-cover shrink-0"
                  unoptimized
                />
              ))}
            </div>
            {extraCount > 0 && (
              <span className="text-[11px] text-muted-foreground tabular-nums">
                +{extraCount}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
