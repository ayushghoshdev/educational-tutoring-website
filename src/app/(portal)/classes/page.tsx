"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClassCard from "./ClassCard";
import { NewClassDialog } from "./NewClassDialog";
import { usePortalUser } from "@/components/PortalUserProvider";
import { computeEndTime, getPortalAvatarUrl } from "@/lib/utils";
import {
  initialClasses,
  mockStudents,
  type PortalClassItem,
} from "../data";

export default function ClassesPage() {
  const { isTeacher, profile, user } = usePortalUser();
  const [classesList, setClassesList] =
    useState<PortalClassItem[]>(initialClasses);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddClass = (data: {
    className: string;
    mode: string;
    date: string;
    time: string;
    duration: string;
  }) => {
    const teacherName = profile?.full_name || user?.name || "Teacher";
    const startTime = data.time || "10:00 AM";
    const endTime = computeEndTime(startTime, data.duration || "60");

    const newClass: PortalClassItem = {
      id: Date.now(),
      title: data.className,
      teacher: teacherName,
      teacherAvatar: getPortalAvatarUrl(teacherName),
      date: data.date || "Upcoming",
      startTime,
      endTime,
      mode: data.mode === "Offline" ? "Offline" : "Online",
      status: "pending",
      attendees: [mockStudents[0], mockStudents[1], mockStudents[2]],
    };
    setClassesList((prev) => [newClass, ...prev]);
  };

  const upcomingClasses = classesList.filter((c) => c.status === "pending");
  const completedClasses = classesList.filter((c) => c.status === "completed");

  return (
    <div className="px-2 py-5 mr-2">
      <div className="flex items-center gap-3">
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          Your <span className="text-foreground/90">Classes</span>
        </h1>
        {isTeacher && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New
          </Button>
        )}
      </div>

      {/* Upcoming Classes */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Upcoming
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {upcomingClasses.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {upcomingClasses.map((c) => (
            <ClassCard key={c.id} {...c} />
          ))}
        </div>
      </section>

      {/* Completed Classes */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Completed
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {completedClasses.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {completedClasses.map((c) => (
            <ClassCard key={c.id} {...c} />
          ))}
        </div>
      </section>

      {isTeacher && (
        <NewClassDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddClass={handleAddClass}
        />
      )}
    </div>
  );
}
