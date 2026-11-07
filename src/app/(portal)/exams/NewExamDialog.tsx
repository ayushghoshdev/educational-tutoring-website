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
import { Info } from "lucide-react";
import {
  DatePickerDropdowns,
  TimePickerDropdowns,
  MONTHS,
} from "@/components/DateTimePickers";
import { StudentAllotmentSelector } from "@/components/StudentAllotmentSelector";

type NewExamDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExam?: (examData: any) => void;
};

export function NewExamDialog({
  open,
  onOpenChange,
  onAddExam,
}: NewExamDialogProps) {
  const [title, setTitle] = useState("");

  // Start Date state
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Start Time state
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("AM");

  const [totalTime, setTotalTime] = useState("60");
  const [mode, setMode] = useState("Online");
  const [file, setFile] = useState<File | null>(null);

  // Student selection
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

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

    if (onAddExam) {
      onAddExam({
        title: title.trim(),
        startDate: formattedDate,
        startTime: formattedTime,
        totalTime,
        mode,
        allottedStudents: selectedStudentIds,
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
            Schedule Exam
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Exam title"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200 outline-none"
          />

          {/* Exam Date Dropdowns: Day, Month, Year */}
          <DatePickerDropdowns
            day={day}
            month={month}
            year={year}
            onDayChange={setDay}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onSelectOpenChange={handleSelectOpenChange}
            label="Exam Date"
          />

          {/* Exam Start Time Dropdowns: Hour, Minute, AM/PM */}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Total Time
              </label>
              <Select
                value={totalTime}
                onValueChange={setTotalTime}
                onOpenChange={handleSelectOpenChange}
              >
                <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="150">2.5 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Exam Mode
              </label>
              <Select
                value={mode}
                onValueChange={setMode}
                onOpenChange={handleSelectOpenChange}
              >
                <SelectTrigger className="w-full bg-secondary! hover:bg-secondary/80! border-none">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <PdfUploadZone
            file={file}
            onFileSelect={setFile}
            label="Upload question paper"
          />

          <StudentAllotmentSelector
            selectedStudentIds={selectedStudentIds}
            onChange={setSelectedStudentIds}
          />

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/80 text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>
              Examinees won't be able to see the PDF until the exam starts.
            </span>
          </div>

          <div className="flex">
            <Button
              className="w-full cursor-pointer disabled:cursor-not-allowed"
              size="lg"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              Schedule Exam
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
