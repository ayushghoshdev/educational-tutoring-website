"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DatePickerDropdowns,
  TimePickerDropdowns,
  MONTHS,
} from "@/components/DateTimePickers";

type NewClassDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClass?: (classData: any) => void;
};

const sampleStudents = [
  { id: "student-1", name: "Student 1" },
  { id: "student-2", name: "Student 2" },
  { id: "student-3", name: "Student 3" },
  { id: "student-4", name: "Student 4" },
  { id: "student-5", name: "Student 5" },
  { id: "student-6", name: "Student 6" },
];

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
  const [studentsDropdownOpen, setStudentsDropdownOpen] = useState(false);

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

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === sampleStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(sampleStudents.map((s) => s.id));
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
    setStudentsDropdownOpen(false);
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

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Allot to Students
            </label>
            <button
              type="button"
              onClick={() => setStudentsDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 outline-none cursor-pointer"
            >
              <span>
                {selectedStudentIds.length === 0
                  ? "Select students..."
                  : `${selectedStudentIds.length} student${
                      selectedStudentIds.length > 1 ? "s" : ""
                    } selected`}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  studentsDropdownOpen && "rotate-180",
                )}
              />
            </button>

            {studentsDropdownOpen && (
              <div className="mt-2 rounded-lg bg-secondary border border-border/50 p-2 space-y-1 max-h-44 overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground border-b border-border/40 pb-1.5 mb-1">
                  <span>Assign to examinees / students</span>
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-primary hover:underline font-medium text-xs cursor-pointer"
                  >
                    {selectedStudentIds.length === sampleStudents.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
                {sampleStudents.map((s) => {
                  const isSelected = selectedStudentIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleStudent(s.id)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-sm",
                        isSelected
                          ? "bg-muted/70 text-foreground"
                          : "hover:bg-muted/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            s.name,
                          )}&background=0A0A0A&color=fff`}
                          width={20}
                          height={20}
                          alt={s.name}
                          className="rounded-full shrink-0"
                        />
                        <span className="font-medium">{s.name}</span>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleStudent(s.id)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
