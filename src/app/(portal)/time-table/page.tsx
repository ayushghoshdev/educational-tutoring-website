"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayCard, type DayCardVariant } from "./DayCard";
import { DayDetailsDialog } from "./DayDetailsDialogue";

const placeholderEventMap: Record<
  number,
  { classes?: number; exams?: number }
> = {
  2: { classes: 1 },
  3: { classes: 2, exams: 1 },
  5: { classes: 1, exams: 1 },
  6: { classes: 1 },
  7: { exams: 3 },
  12: { classes: 2 },
  15: { classes: 1, exams: 1 },
  20: { classes: 1, exams: 1 },
  23: { classes: 2 },
  25: { classes: 1, exams: 1 },
  27: { classes: 4 },
  28: { classes: 2, exams: 1 },
  31: { exams: 2 },
};

const weekDays = [
  { short: "S", full: "Sun" },
  { short: "M", full: "Mon" },
  { short: "T", full: "Tue" },
  { short: "W", full: "Wed" },
  { short: "T", full: "Thu" },
  { short: "F", full: "Fri" },
  { short: "S", full: "Sat" },
];

type CalendarDay = {
  day: number;
  date: Date;
  classes?: number;
  exams?: number;
  variant: DayCardVariant;
};

export default function TimeTablePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  // Month & Day calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  const { calendarDays, totalClasses, totalExams } = useMemo(() => {
    const today = new Date();
    const isSameDay = (d: Date, target: Date) =>
      d.getDate() === target.getDate() &&
      d.getMonth() === target.getMonth() &&
      d.getFullYear() === target.getFullYear();

    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const prevDays: CalendarDay[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const date = new Date(year, month - 1, dayNum);
      const placeholder = placeholderEventMap[dayNum];
      prevDays.push({
        day: dayNum,
        date,
        classes: placeholder?.classes,
        exams: placeholder?.exams,
        variant: "past",
      });
    }

    const currentDays: CalendarDay[] = [];
    let classesCount = 0;
    let examsCount = 0;

    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const date = new Date(year, month, d);
      const isCurrentDay = isSameDay(date, today);
      const placeholder = isCurrentDay
        ? { classes: 4, exams: 1 }
        : placeholderEventMap[d];

      if (placeholder?.classes) classesCount += placeholder.classes;
      if (placeholder?.exams) examsCount += placeholder.exams;

      currentDays.push({
        day: d,
        date,
        classes: placeholder?.classes,
        exams: placeholder?.exams,
        variant: isCurrentDay ? "current" : "normal",
      });
    }

    const totalSoFar = prevDays.length + currentDays.length;
    const remainingDays = (7 - (totalSoFar % 7)) % 7;
    const nextDays: CalendarDay[] = [];
    for (let d = 1; d <= remainingDays; d++) {
      const date = new Date(year, month + 1, d);
      const placeholder = placeholderEventMap[d];
      nextDays.push({
        day: d,
        date,
        classes: placeholder?.classes,
        exams: placeholder?.exams,
        variant: "next",
      });
    }

    return {
      calendarDays: [...prevDays, ...currentDays, ...nextDays],
      totalClasses: classesCount,
      totalExams: examsCount,
    };
  }, [year, month]);

  return (
    <div className="px-2 py-5 mr-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
            Your <span className="text-foreground/90">Time Table</span>
          </h1>
        </div>
      </div>

      <section className="mt-4 rounded-lg bg-sidebar/70 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1 pb-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-medium tracking-tight text-foreground flex items-center gap-1">
                {monthName}{" "}
                <span className="text-muted-foreground font-normal">
                  {year}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-accent/40 rounded-full p-0.5">
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="rounded-full"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="rounded-full"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Day-of-week header: S M T W T F S */}
        <div className="mb-3 grid grid-cols-7 gap-2 sm:gap-3 text-center text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {weekDays.map((day, i) => (
            <div key={`${day.short}-${i}`} className="py-1">
              <span className="sm:hidden">{day.short}</span>
              <span className="hidden sm:inline">{day.full}</span>
            </div>
          ))}
        </div>

        {/* 7-column Calendar Grid of square DayCards */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {calendarDays.map((day, idx) => (
            <DayCard
              key={`${day.date.toISOString()}-${idx}`}
              day={day.day}
              classes={day.classes}
              exams={day.exams}
              variant={day.variant}
              onClick={() => {
                setSelectedDay(day);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>

        <DayDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          day={selectedDay}
        />
      </section>
    </div>
  );
}
