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
import { PdfUploadZone } from "@/components/PdfUploadZone";
import {
  DatePickerDropdowns,
  TimePickerDropdowns,
  MONTHS,
} from "@/components/DateTimePickers";

type NewAssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAssignment?: (assignmentData: any) => void;
};

export function NewAssignmentDialog({
  open,
  onOpenChange,
  onAddAssignment,
}: NewAssignmentDialogProps) {
  const [title, setTitle] = useState("");
  const [submissionMode, setSubmissionMode] = useState("Online");
  const [file, setFile] = useState<File | null>(null);

  // Due Date state
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Due Time state
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("AM");

  // Outside click guard
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
    !title.trim() ||
    !file ||
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

    if (onAddAssignment) {
      onAddAssignment({
        title: title.trim(),
        dueDate: formattedDate,
        dueTime: formattedTime,
        submissionMode,
        file,
      });
    }

    setTitle("");
    setDay("");
    setMonth("");
    setYear("");
    setHour("");
    setMinute("");
    setPeriod("AM");
    setFile(null);
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
            New Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Assignment title"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200 outline-none"
          />

          {/* Due Date Dropdowns: Day, Month, Year */}
          <DatePickerDropdowns
            day={day}
            month={month}
            year={year}
            onDayChange={setDay}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onSelectOpenChange={handleSelectOpenChange}
            label="Due Date"
          />

          {/* Due Time Dropdowns: Hour, Minute, AM/PM */}
          <TimePickerDropdowns
            hour={hour}
            minute={minute}
            period={period}
            onHourChange={setHour}
            onMinuteChange={setMinute}
            onPeriodChange={setPeriod}
            onSelectOpenChange={handleSelectOpenChange}
            label="Due Time"
          />

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Submission Mode
            </label>
            <Select
              value={submissionMode}
              onValueChange={setSubmissionMode}
              onOpenChange={handleSelectOpenChange}
            >
              <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
                <SelectValue placeholder="Select submission mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Online">Online submission</SelectItem>
                  <SelectItem value="Offline">Offline submission</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <PdfUploadZone
            file={file}
            onFileSelect={setFile}
            label="Upload assignment"
          />

          <div className="flex">
            <Button
              className="w-full cursor-pointer disabled:cursor-not-allowed"
              size="lg"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              Create Assignment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
