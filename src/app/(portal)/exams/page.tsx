"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ExamCard from "./ExamCard";
import { NewExamDialog } from "./NewExamDialog";
import { usePortalUser } from "@/components/PortalUserProvider";
import { computeEndTime, getPortalAvatarUrl } from "@/lib/utils";
import { initialExams, type PortalExamItem } from "../data";

export default function ExamsPage() {
  const { isTeacher, profile, user } = usePortalUser();
  const [examsList, setExamsList] = useState<PortalExamItem[]>(initialExams);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddExam = (data: {
    title: string;
    startDate: string;
    startTime: string;
    totalTime: string;
    mode: string;
    allottedStudents?: string[];
    file: File | null;
  }) => {
    const teacherName = profile?.full_name || user?.name || "Teacher";
    const startTime = data.startTime || "10:00 AM";
    const endTime = computeEndTime(startTime, data.totalTime || "60");

    const newExam: PortalExamItem = {
      id: Date.now(),
      title: data.title,
      teacher: teacherName,
      teacherAvatar: getPortalAvatarUrl(teacherName),
      mode: data.mode === "Offline" ? "Offline" : "Online",
      date: data.startDate || "Upcoming",
      startTime,
      endTime,
    };
    setExamsList((prev) => [newExam, ...prev]);
  };

  const upcomingExams = examsList.filter((e) => !e.grade && !e.marks);
  const completedExams = examsList.filter((e) => e.grade || e.marks);

  return (
    <div className="px-2 py-5 mr-2">
      <div className="flex items-center gap-3">
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          Your <span className="text-foreground/90">Exams</span>
        </h1>
        {isTeacher && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New
          </Button>
        )}
      </div>

      {/* Upcoming Exams */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Upcoming
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {upcomingExams.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {upcomingExams.map((exam) => (
            <ExamCard key={exam.id} {...exam} />
          ))}
        </div>
      </section>

      {/* Completed Exams */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Completed
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {completedExams.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {completedExams.map((exam) => (
            <ExamCard key={exam.id} {...exam} />
          ))}
        </div>
      </section>

      {isTeacher && (
        <NewExamDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddExam={handleAddExam}
        />
      )}
    </div>
  );
}
