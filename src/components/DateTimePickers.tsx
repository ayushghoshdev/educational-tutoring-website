"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const getDaysInMonth = (
  year?: string | number,
  month?: string | number,
) => {
  const y = Number(year) || new Date().getFullYear();
  const m = Number(month) || 1;
  return new Date(y, m, 0).getDate();
};

const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: 6 }, (_, i) =>
  String(currentYear + i),
);

export const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
export const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
export const PERIODS = ["AM", "PM"];

interface DatePickerDropdownsProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (val: string) => void;
  onMonthChange: (val: string) => void;
  onYearChange: (val: string) => void;
  onSelectOpenChange?: (isOpen: boolean) => void;
  label?: string;
}

export function DatePickerDropdowns({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  onSelectOpenChange,
  label = "Date",
}: DatePickerDropdownsProps) {
  const maxDays = getDaysInMonth(year, month);

  const handleMonthChange = (val: string) => {
    onMonthChange(val);
    const newMax = getDaysInMonth(year, val);
    if (day && Number(day) > newMax) {
      onDayChange(String(newMax));
    }
  };

  const handleYearChange = (val: string) => {
    onYearChange(val);
    const newMax = getDaysInMonth(val, month);
    if (day && Number(day) > newMax) {
      onDayChange(String(newMax));
    }
  };

  return (
    <div>
      {label && (
        <label className="text-xs text-muted-foreground mb-1 block">
          {label}
        </label>
      )}
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={day}
          onValueChange={onDayChange}
          onOpenChange={onSelectOpenChange}
        >
          <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            <SelectGroup>
              <SelectLabel>Day</SelectLabel>
              {Array.from({ length: maxDays }, (_, i) => String(i + 1)).map(
                (d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ),
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={month}
          onValueChange={handleMonthChange}
          onOpenChange={onSelectOpenChange}
        >
          <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            <SelectGroup>
              <SelectLabel>Month</SelectLabel>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={year}
          onValueChange={handleYearChange}
          onOpenChange={onSelectOpenChange}
        >
          <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface TimePickerDropdownsProps {
  hour: string;
  minute: string;
  period: string;
  onHourChange: (val: string) => void;
  onMinuteChange: (val: string) => void;
  onPeriodChange: (val: string) => void;
  onSelectOpenChange?: (isOpen: boolean) => void;
  label?: string;
}

export function TimePickerDropdowns({
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onSelectOpenChange,
  label = "Time",
}: TimePickerDropdownsProps) {
  return (
    <div>
      {label && (
        <label className="text-xs text-muted-foreground mb-1 block">
          {label}
        </label>
      )}
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={hour}
          onValueChange={onHourChange}
          onOpenChange={onSelectOpenChange}
        >
          <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            <SelectGroup>
              <SelectLabel>Hour</SelectLabel>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={minute}
          onValueChange={onMinuteChange}
          onOpenChange={onSelectOpenChange}
        >
          <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            <SelectGroup>
              <SelectLabel>Minute</SelectLabel>
              {MINUTES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={period}
          onValueChange={onPeriodChange}
          onOpenChange={onSelectOpenChange}
        >
          <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            <SelectGroup>
              <SelectLabel>AM / PM</SelectLabel>
              {PERIODS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

