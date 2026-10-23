"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventDetailsDialog } from "./EventDetailsDialog";
import { cn } from "@/lib/utils";

// Types
export type ScheduleEventType = "class" | "exam" | "assignment";

export interface ScheduleEvent {
  id: string;
  title: string;
  type: ScheduleEventType;
  startTime: string; // "HH:MM", 24-hr format
  endTime?: string; // "HH:MM", 24-hr format (for timed classes & exams)
  dueTime?: string; // "HH:MM", 24-hr format (for assignment deadlines)
  dateOffset: number; // Offset in days from today: 0 = today, 1 = tomorrow, -1 = yesterday, etc.
}

export interface DayColumn {
  date: Date;
  isToday: boolean;
  dayName: string;
  dayNumber: number;
  formattedHeader: string;
}

const START_HOUR = 0;
const END_HOUR = 23;
const HOUR_HEIGHT = 70; // px per hour slot

const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i,
);

const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Day 0: TODAY
  {
    id: "evt-today-1",
    title: "Class name 1",
    type: "class",
    startTime: "11:00",
    endTime: "12:30", // 1.5 hours stretched card
    dateOffset: 0,
  },
  {
    id: "evt-today-2",
    title: "Class name 2",
    type: "class",
    startTime: "12:30",
    endTime: "13:30", // 1 hour
    dateOffset: 0,
  },
  {
    id: "evt-today-3",
    title: "Class name 3",
    type: "class",
    startTime: "14:00",
    endTime: "16:00", // 2.0 hours stretched card
    dateOffset: 0,
  },
  {
    id: "evt-today-4",
    title: "Exam name 1",
    type: "exam",
    startTime: "16:30",
    endTime: "18:00", // 1.5 hours exam
    dateOffset: 0,
  },
  {
    id: "evt-today-5",
    title: "Assignment name 1",
    type: "assignment",
    startTime: "19:00",
    dueTime: "19:00", // Deadline only (non-stretchable card)
    dateOffset: 0,
  },

  // Day 1: TOMORROW (+1)
  {
    id: "evt-d1-1",
    title: "Class name 4",
    type: "class",
    startTime: "10:30",
    endTime: "12:00", // 1.5 hours
    dateOffset: 1,
  },
  {
    id: "evt-d1-2",
    title: "Class name 5",
    type: "class",
    startTime: "12:30",
    endTime: "14:00", // 1.5 hours
    dateOffset: 1,
  },
  {
    id: "evt-d1-3",
    title: "Class name 6",
    type: "class",
    startTime: "14:30",
    endTime: "16:30", // 2.0 hours stretched card
    dateOffset: 1,
  },
  {
    id: "evt-d1-4",
    title: "Assignment name 2",
    type: "assignment",
    startTime: "17:00",
    dueTime: "17:00", // Deadline only
    dateOffset: 1,
  },

  // Day 2 (+2 days)
  {
    id: "evt-d2-1",
    title: "Class name 7",
    type: "class",
    startTime: "09:00",
    endTime: "10:30", // 1.5 hours
    dateOffset: 2,
  },
  {
    id: "evt-d2-2",
    title: "Class name 8",
    type: "class",
    startTime: "11:00",
    endTime: "12:00", // 1 hour
    dateOffset: 2,
  },
  {
    id: "evt-d2-3",
    title: "Class name 9",
    type: "class",
    startTime: "13:00",
    endTime: "14:30", // 1.5 hours
    dateOffset: 2,
  },
  {
    id: "evt-d2-4",
    title: "Exam name 2",
    type: "exam",
    startTime: "15:00",
    endTime: "17:30", // 2.5 hours stretched exam
    dateOffset: 2,
  },

  // Day 3 (+3 days)
  {
    id: "evt-d3-1",
    title: "Class name 10",
    type: "class",
    startTime: "11:00",
    endTime: "12:30", // 1.5 hours
    dateOffset: 3,
  },
  {
    id: "evt-d3-2",
    title: "Class name 11",
    type: "class",
    startTime: "13:30",
    endTime: "15:30", // 2.0 hours
    dateOffset: 3,
  },
  {
    id: "evt-d3-3",
    title: "Class name 12",
    type: "class",
    startTime: "16:00",
    endTime: "17:00", // 1 hour
    dateOffset: 3,
  },
  {
    id: "evt-d3-4",
    title: "Assignment name 3",
    type: "assignment",
    startTime: "18:00",
    dueTime: "18:00", // Deadline only
    dateOffset: 3,
  },

  // Day 4 (+4 days)
  {
    id: "evt-d4-1",
    title: "Assignment name 4",
    type: "assignment",
    startTime: "11:00",
    dueTime: "11:00", // Deadline only
    dateOffset: 4,
  },
  {
    id: "evt-d4-2",
    title: "Class name 13",
    type: "class",
    startTime: "13:00",
    endTime: "14:30", // 1.5 hours
    dateOffset: 4,
  },
  {
    id: "evt-d4-3",
    title: "Exam name 3",
    type: "exam",
    startTime: "15:00",
    endTime: "17:00", // 2.0 hours exam
    dateOffset: 4,
  },

  // Day -1: YESTERDAY (when navigating back)
  {
    id: "evt-dm1-1",
    title: "Class name 14",
    type: "class",
    startTime: "10:00",
    endTime: "11:30", // 1.5 hours
    dateOffset: -1,
  },
  {
    id: "evt-dm1-2",
    title: "Class name 15",
    type: "class",
    startTime: "13:00",
    endTime: "14:00", // 1 hour
    dateOffset: -1,
  },
  {
    id: "evt-dm1-3",
    title: "Assignment name 5",
    type: "assignment",
    startTime: "16:00",
    dueTime: "16:00", // Deadline only
    dateOffset: -1,
  },

  // Day -2 (2 days ago)
  {
    id: "evt-dm2-1",
    title: "Exam name 4",
    type: "exam",
    startTime: "11:00",
    endTime: "13:00", // 2.0 hours
    dateOffset: -2,
  },
  {
    id: "evt-dm2-2",
    title: "Class name 16",
    type: "class",
    startTime: "14:00",
    endTime: "15:30", // 1.5 hours
    dateOffset: -2,
  },

  // Day 7 (Next week)
  {
    id: "evt-d7-1",
    title: "Class name 17",
    type: "class",
    startTime: "11:00",
    endTime: "13:00", // 2 hours
    dateOffset: 7,
  },
  {
    id: "evt-d7-2",
    title: "Class name 18",
    type: "class",
    startTime: "14:00",
    endTime: "15:30", // 1.5 hours
    dateOffset: 7,
  },
];

// Helper to filter events for a specific date
function getEventsForDate(
  targetDate: Date,
  events: ScheduleEvent[],
): ScheduleEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return events.filter((evt) => evt.dateOffset === diffDays);
}

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
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

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
}

function formatTimetableTitle(startDate: Date, endDate: Date): string {
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const startMonth = startDate.toLocaleDateString("en-US", { month: "long" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "long" });
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  // Single day: "September 12, 2026"
  if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay}, ${startYear}`;
  }

  // Same month, same year: "September 12 – 16, 2026"
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
  }

  // Different month, same year: "September 28 – October 2, 2026"
  if (startYear === endYear) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  }

  // Different year: "December 29, 2026 – January 2, 2027"
  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
}

// Monotone card for all events (classes, exams, assignments) using the palette color
function TimetableEventCard({
  event,
  hourHeight = 70,
  startHour = 0,
  onClick,
}: {
  event: ScheduleEvent;
  hourHeight: number;
  startHour: number;
  onClick: () => void;
}) {
  const isAssignment = event.type === "assignment";

  let top = 0;
  let height = 0;
  let timeSubtext = "";

  if (isAssignment) {
    // Due assignments are deadlines: fixed non-stretchable card, no timer
    const dueTime = event.dueTime || event.startTime;
    const dueMinutes = parseTimeToMinutes(dueTime);
    const offsetMinutes = dueMinutes - startHour * 60;
    top = (offsetMinutes / 60) * hourHeight;
    height = 46; // Fixed non-stretchable compact card
    timeSubtext = `Due at ${formatTime12h(dueTime)}`;
  } else {
    // Classes and exams: stretch according to duration
    const startMinutes = parseTimeToMinutes(event.startTime);
    const endMinutes = parseTimeToMinutes(event.endTime || event.startTime);
    const offsetMinutes = startMinutes - startHour * 60;
    const durationMinutes = Math.max(endMinutes - startMinutes, 30);
    top = (offsetMinutes / 60) * hourHeight;
    height = Math.max((durationMinutes / 60) * hourHeight - 4, 40);
    timeSubtext = `${formatTime12h(event.startTime)} — ${formatTime12h(event.endTime || event.startTime)}`;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
      className={cn(
        "absolute inset-x-1.5 sm:inset-x-2 rounded-lg px-3 py-2",
        "flex flex-col justify-center transition-colors duration-150 cursor-pointer",
        "bg-accent/65 hover:bg-accent text-foreground select-none z-10",
        "focus-visible:outline-hidden",
      )}
    >
      <div className="font-medium text-xs sm:text-[13px] leading-tight truncate">
        {event.title}
      </div>
      <div className="text-[10px] sm:text-[11px] font-normal text-muted-foreground leading-tight mt-1 truncate">
        {timeSubtext}
      </div>
    </div>
  );
}

export default function TimeTablePage() {
  // Always starts from current day
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [visibleDaysCount, setVisibleDaysCount] = useState<number>(5);

  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Dynamically calculate visible days depending on available container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateColumns = (width: number) => {
      const timeAxisWidth = 60;
      const availableWidth = Math.max(width - timeAxisWidth, 120);
      // Allocate ~185px per column so it comfortably fits as many as possible
      const count = Math.max(1, Math.floor(availableWidth / 185));
      setVisibleDaysCount((prev) => (prev !== count ? count : prev));
    };

    calculateColumns(container.clientWidth || window.innerWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          calculateColumns(entry.contentRect.width);
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // On mount, scroll down inside the timetable to 8:00 AM so daytime schedule is immediately in view
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 8 * HOUR_HEIGHT;
    }
  }, []);

  const handlePrev = useCallback(() => {
    setStartDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - visibleDaysCount);
      return next;
    });
  }, [visibleDaysCount]);

  const handleNext = useCallback(() => {
    setStartDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + visibleDaysCount);
      return next;
    });
  }, [visibleDaysCount]);

  const handleToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);
  }, []);

  const endDate = useMemo(() => {
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + visibleDaysCount - 1);
    return end;
  }, [startDate, visibleDaysCount]);

  const dateTitle = useMemo(
    () => formatTimetableTitle(startDate, endDate),
    [startDate, endDate],
  );

  const dayColumns: DayColumn[] = useMemo(() => {
    const cols: DayColumn[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < visibleDaysCount; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      d.setHours(0, 0, 0, 0);

      const isToday = d.getTime() === today.getTime();
      const dayName = d
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      const dayNumber = d.getDate();

      cols.push({
        date: d,
        isToday,
        dayName,
        dayNumber,
        formattedHeader: `${dayName}, ${dayNumber}`,
      });
    }
    return cols;
  }, [startDate, visibleDaysCount]);

  const isTodayInView = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dayColumns.some((col) => col.date.getTime() === today.getTime());
  }, [dayColumns]);

  const totalGridHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <div className="h-[calc(100dvh+4px)] max-h-[calc(100dvh+4px)] flex flex-col px-2 py-5 mr-2 overflow-hidden space-y-3 box-border">
      <div className="shrink-0">
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          Your <span className="text-foreground/90">Time Table</span>
        </h1>
      </div>

      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              aria-label="Previous dates"
              className="size-8 sm:size-9 rounded-full hover:bg-accent text-foreground"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              aria-label="Next dates"
              className="size-8 sm:size-9 rounded-full hover:bg-accent text-foreground"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>

          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground select-none">
            {dateTitle}
          </h2>
        </div>
      </div>

      <section
        ref={containerRef}
        className="flex-1 min-h-0 flex flex-col rounded-lg bg-sidebar/70 overflow-hidden"
      >
        <div className="flex items-center bg-sidebar shrink-0 z-20">
          <div className="w-14 sm:w-16 shrink-0 py-3.5 px-2 text-center text-xs font-medium text-muted-foreground select-none" />
          <div
            className="flex-1 grid"
            style={{
              gridTemplateColumns: `repeat(${visibleDaysCount}, minmax(0, 1fr))`,
            }}
          >
            {dayColumns.map((col, idx) => (
              <div
                key={`${col.formattedHeader}-${idx}`}
                className={cn(
                  "py-3.5 px-2 text-center select-none",
                  col.isToday ? "bg-accent/20" : "",
                )}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className={cn(
                      "text-xs sm:text-[13px] font-bold tracking-wider",
                      col.isToday
                        ? "text-primary"
                        : "text-foreground/80 dark:text-foreground/90",
                    )}
                  >
                    {col.formattedHeader}
                  </span>
                  {col.isToday && (
                    <span className="hidden sm:inline-flex items-center text-[10px] font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-primary/15 text-primary">
                      Today
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable 24-Hour Grid Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
        >
          <div
            className="flex relative"
            style={{ height: `${totalGridHeight}px` }}
          >
            {/* Left Time Column (All 24 hours: 12 AM to 11 PM) */}
            <div
              className="w-14 sm:w-16 shrink-0 bg-sidebar select-none relative z-10"
              style={{ height: `${totalGridHeight}px` }}
            >
              {HOURS.map((hour, idx) => (
                <div
                  key={hour}
                  style={{
                    top: `${idx * HOUR_HEIGHT}px`,
                  }}
                  className="absolute inset-x-0 pr-2 sm:pr-3 text-right text-[11px] sm:text-xs font-medium text-muted-foreground/80 -translate-y-1/2"
                >
                  {formatHourLabel(hour)}
                </div>
              ))}
            </div>

            {/* Day Columns Grid */}
            <div
              className="flex-1 grid relative"
              style={{
                gridTemplateColumns: `repeat(${visibleDaysCount}, minmax(0, 1fr))`,
                height: `${totalGridHeight}px`,
              }}
            >
              {dayColumns.map((col, colIdx) => {
                const dayEvents = getEventsForDate(
                  col.date,
                  MOCK_SCHEDULE_EVENTS,
                );

                return (
                  <div
                    key={`col-${colIdx}`}
                    className={cn(
                      "relative border-l border-border/20",
                      col.isToday ? "bg-accent/10" : "",
                    )}
                    style={{ height: `${totalGridHeight}px` }}
                  >
                    {/* Horizontal Hour Lines */}
                    {HOURS.map((_, hIdx) => (
                      <div
                        key={`line-${colIdx}-${hIdx}`}
                        style={{
                          top: `${hIdx * HOUR_HEIGHT}px`,
                        }}
                        className="absolute inset-x-0 border-t border-border/20 pointer-events-none"
                      />
                    ))}

                    {/* Monotone Event Cards inside this day column */}
                    {dayEvents.map((evt) => (
                      <TimetableEventCard
                        key={evt.id}
                        event={evt}
                        hourHeight={HOUR_HEIGHT}
                        startHour={START_HOUR}
                        onClick={() => {
                          setSelectedEvent(evt);
                          setDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Dialog on card click */}
      <EventDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={selectedEvent}
      />
    </div>
  );
}
