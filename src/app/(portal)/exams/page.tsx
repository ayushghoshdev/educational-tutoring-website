"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ExamCard from "./ExamCard";
import { NewExamDialog } from "./NewExamDialog";
import { usePortalUser } from "@/components/PortalUserProvider";

const initialExams = [
  {
    id: 1,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Offline",
    due: "in 10 minutes",
  },
  {
    id: 2,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Online",
    due: "tomorrow",
  },
  {
    id: 3,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Online",
    due: "this friday",
  },
  {
    id: 4,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Online",
    grade: "A+",
  },
  {
    id: 5,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Offline",
    marks: "81/100",
  },
];

export default function ExamsPage() {
  const { isTeacher, profile, user } = usePortalUser();
  const [examsList, setExamsList] = useState(initialExams);
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
    let formattedDue = "Upcoming";
    if (data.startDate && data.startTime) {
      formattedDue = `${data.startDate}, ${data.startTime}`;
    } else if (data.startDate) {
      formattedDue = data.startDate;
    }

    const newExam = {
      id: Date.now(),
      title: data.title,
      teacher: teacherName,
      mode: data.mode,
      due: formattedDue,
    };
    setExamsList((prev) => [newExam, ...prev]);
  };

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

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Pending</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {examsList
              .filter((exam) => exam.due)
              .map((exam) => (
                <ExamCard key={exam.id} {...exam} />
              ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Completed</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {examsList
              .filter((exam) => exam.grade || exam.marks)
              .map((exam) => (
                <ExamCard key={exam.id} {...exam} />
              ))}
          </div>
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
