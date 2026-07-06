"use client";

import { useState } from "react";
import { DayCard } from "./DayCard";
import { DayDetailsDialog } from "./DayDetailsDialogue";

const days = [
  { day: 20, classes: 1, exams: 1, variant: "past" },
  { day: 21, variant: "past" },
  { day: 22, variant: "past" },
  { day: 23, classes: 2, variant: "past" },
  { day: 24, variant: "past" },
  { day: 25, classes: 1, exams: 1, variant: "past" },
  { day: 26, variant: "past" },

  { day: 27, classes: 4, variant: "current" },
  { day: 28, classes: 2, exams: 1 },
  { day: 29 },
  { day: 30 },
  { day: 31, exams: 2 },
  { day: 1, variant: "next" },
  { day: 2, classes: 1, variant: "next" },

  { day: 3, classes: 2, exams: 1, variant: "next" },
  { day: 4, variant: "next" },
  { day: 5, classes: 1, exams: 1, variant: "next" },
  { day: 6, classes: 1, variant: "next" },
  { day: 7, exams: 3, variant: "next" },
  { day: 8, variant: "next" },
  { day: 9, variant: "next" },
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export default function TimeTablePage() {
  const [selectedDay, setSelectedDay] = useState<(typeof days)[number] | null>(
    null,
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="px-2 py-5 mr-2">
      <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
        Your <span className="text-foreground/90">Time Table</span>
      </h1>

      <section className="mt-4 rounded-lg bg-sidebar p-5">
        <div className="mb-3 grid grid-cols-7 text-center text-sm font-medium text-muted-foreground">
          {weekDays.map((day, i) => (
            <span key={`${day}-${i}`}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {days.map((day) => (
            <DayCard
              key={`${day.day}-${day.variant ?? "normal"}`}
              day={day.day}
              classes={day.classes}
              exams={day.exams}
              variant={day.variant as any}
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
