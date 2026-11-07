"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DatePickerDropdowns,
  TimePickerDropdowns,
  MONTHS,
} from "@/components/DateTimePickers";
import { StudentAllotmentSelector } from "@/components/StudentAllotmentSelector";

type NewClassDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClass?: (classData: any) => void;
};

export function NewClassDialog({
  open,
  onOpenChange,
  onAddClass,
}: NewClassDialogProps) {
  const [className, setClassName] = useState("");
  const [mode, setMode] = useState("Online");

  // Date state
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Time state
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("AM");

  // Duration
  const [duration, setDuration] = useState("60");

  // Student selection
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Outside click guard for select dropdowns
  const [openSelectCount, setOpenSelectCount] = useState(0);
  const justClosedSelectRef = useRef(false);

  const handleSelectOpenChange = (isOpen: boolean) => {
    setOpenSelectCount((prev) => (isOpen ? prev + 1 : Math.max(0, prev - 1)));
    if (!isOpen) {
      justClosedSelectRef.current = true;
      setTimeout(() => {
        justClosedSelectRef.current = false;
      }, 200);
    }
  };

  const isSubmitDisabled =
    !className.trim() ||
    selectedStudentIds.length === 0 ||
    !day ||
    !month ||
    !year ||
    !hour ||
    !minute ||
    !period;

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    const monthObj = MONTHS.find((m) => m.value === month);
    const formattedDate = `${monthObj?.label || month} ${day}, ${year}`;
    const formattedTime = `${hour}:${minute} ${period}`;

    if (onAddClass) {
      onAddClass({
        className: className.trim(),
        mode,
        date: formattedDate,
        time: formattedTime,
        duration,
        allottedStudents: selectedStudentIds,
      });
    }

    setClassName("");
    setDay("");
    setMonth("");
    setYear("");
    setHour("");
    setMinute("");
    setPeriod("AM");
    setSelectedStudentIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => {
          if (openSelectCount > 0 || justClosedSelectRef.current) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (openSelectCount > 0 || justClosedSelectRef.current) {
            e.preventDefault();
          }
        }}
        className="sm:max-w-lg ring-0! [&_button:focus]:ring-0! [&_button:focus]:ring-offset-0!"
      >
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            Schedule a Class
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Class name"
            maxLength={80}
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200 outline-none"
          />

          <Select
            value={mode}
            onValueChange={setMode}
            onOpenChange={handleSelectOpenChange}
          >
            <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
              <SelectValue placeholder="Select class mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Online & Offline">
                  Online & Offline
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Date Dropdowns: Day, Month, Year */}
          <DatePickerDropdowns
            day={day}
            month={month}
            year={year}
            onDayChange={setDay}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onSelectOpenChange={handleSelectOpenChange}
            label="Class Date"
          />

          {/* Time Dropdowns: Hour, Minute, AM/PM */}
          <TimePickerDropdowns
            hour={hour}
            minute={minute}
            period={period}
            onHourChange={setHour}
            onMinuteChange={setMinute}
            onPeriodChange={setPeriod}
            onSelectOpenChange={handleSelectOpenChange}
            label="Start Time"
          />

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Class Duration
            </label>
            <Select
              value={duration}
              onValueChange={setDuration}
              onOpenChange={handleSelectOpenChange}
            >
              <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
                <SelectValue placeholder="Select how long class will go on" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <StudentAllotmentSelector
            selectedStudentIds={selectedStudentIds}
            onChange={setSelectedStudentIds}
          />

          <div className="flex">
            <Button
              className="w-full cursor-pointer disabled:cursor-not-allowed"
              size="lg"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              Schedule Class
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
