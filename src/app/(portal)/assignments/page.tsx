"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AssignmentCard from "./AssignmentCard";
import { NewAssignmentDialog } from "./NewAssignmentDialog";
import { usePortalUser } from "@/components/PortalUserProvider";

const initialAssignments = [
  {
    id: 1,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Offline",
    due: "in 10 minutes",
  },
  {
    id: 2,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Online",
    due: "tomorrow",
  },
  {
    id: 3,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Online",
    due: "this friday",
  },
  {
    id: 4,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Online",
    grade: "A+",
  },
  {
    id: 5,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Offline",
    marks: "81/100",
  },
];

export default function AssignmentsPage() {
  const { isTeacher, profile, user } = usePortalUser();
  const [assignmentsList, setAssignmentsList] = useState(initialAssignments);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddAssignment = (data: {
    title: string;
    dueDate: string;
    dueTime: string;
    submissionMode: string;
    allottedStudents?: string[];
    file: File | null;
  }) => {
    const teacherName = profile?.full_name || user?.name || "Teacher";
    let dueString = "Upcoming";
    if (data.dueDate && data.dueTime) {
      dueString = `${data.dueDate}, ${data.dueTime}`;
    } else if (data.dueDate) {
      dueString = data.dueDate;
    }

    const newAssignment = {
      id: Date.now(),
      title: data.title,
      teacher: teacherName,
      mode: data.submissionMode,
      due: dueString,
    };
    setAssignmentsList((prev) => [newAssignment, ...prev]);
  };

  return (
    <div className="px-2 py-5 mr-2">
      <div className="flex items-center gap-3">
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          Your <span className="text-foreground/90">Assignments</span>
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
            {assignmentsList
              .filter((cls) => cls.due)
              .map((cls) => (
                <AssignmentCard key={cls.id} {...cls} />
              ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Completed</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {assignmentsList
              .filter((cls) => cls.grade || cls.marks)
              .map((cls) => (
                <AssignmentCard key={cls.id} {...cls} />
              ))}
          </div>
        </div>
      </section>

      {isTeacher && (
        <NewAssignmentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddAssignment={handleAddAssignment}
        />
      )}
    </div>
  );
}
