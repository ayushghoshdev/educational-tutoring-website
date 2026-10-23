"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface ScheduleEvent {
  id: string;
  title: string;
  type: "class" | "exam" | "assignment";
  startTime: string; // "HH:MM"
  endTime?: string; // "HH:MM"
  dueTime?: string; // "HH:MM"
  dateOffset: number;
}

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: ScheduleEvent | null;
}

function formatTime12h(timeStr: string): string {
  const [hoursRaw, minutesRaw] = timeStr.split(":").map(Number);
  const hours = hoursRaw ?? 0;
  const minutes = minutesRaw ?? 0;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${period}`;
}

export function EventDetailsDialog({
  open,
  onOpenChange,
  event,
}: EventDetailsDialogProps) {
  if (!event) return null;

  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + event.dateOffset);

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime =
    event.type === "assignment"
      ? `Due at ${formatTime12h(event.dueTime || event.startTime)}`
      : `${formatTime12h(event.startTime)} – ${formatTime12h(event.endTime || event.startTime)}`;

  const dialogTitle =
    event.type === "class"
      ? "Class"
      : event.type === "exam"
        ? "Exam"
        : "Assignment";

  const actionText =
    event.type === "class"
      ? "Join class"
      : event.type === "exam"
        ? "View exam portal"
        : "Submit assignment";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md ring-0! [&_button:focus]:ring-0! [&_button:focus]:ring-offset-0!">
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div>
          <p className="text-lg font-medium text-foreground">{event.title}</p>

          <div className="flex items-center gap-1">
            <Image
              src="https://ui-avatars.com/api/?name=Teacher+Name&background=0A0A0A&color=fff"
              width={18}
              height={18}
              alt="TN"
              className="rounded-full shrink-0"
            />
            <p className="text-sm text-muted-foreground">Teacher name</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <p>{formattedDate}</p>
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <p>{formattedTime}</p>
          </div>

          <div className="flex mt-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => onOpenChange(false)}
            >
              {actionText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
