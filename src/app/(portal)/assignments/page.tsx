"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AssignmentCard from "./AssignmentCard";
import { NewAssignmentDialog } from "./NewAssignmentDialog";
import { usePortalUser } from "@/components/PortalUserProvider";
import { getPortalAvatarUrl } from "@/lib/utils";
import { initialAssignments, type PortalAssignmentItem } from "../data";

export default function AssignmentsPage() {
  const { isTeacher, profile, user } = usePortalUser();
  const [assignmentsList, setAssignmentsList] =
    useState<PortalAssignmentItem[]>(initialAssignments);
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

    const newAssignment: PortalAssignmentItem = {
      id: Date.now(),
      title: data.title,
      teacher: teacherName,
      teacherAvatar: getPortalAvatarUrl(teacherName),
      mode: data.submissionMode === "Offline" ? "Offline" : "Online",
      dueDate: data.dueDate || "Upcoming",
      time: data.dueTime || undefined,
    };
    setAssignmentsList((prev) => [newAssignment, ...prev]);
  };

  const upcomingAssignments = assignmentsList.filter(
    (a) => !a.grade && !a.marks,
  );
  const completedAssignments = assignmentsList.filter(
    (a) => a.grade || a.marks,
  );

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

      {/* Upcoming Assignments */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Upcoming
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {upcomingAssignments.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {upcomingAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} {...assignment} />
          ))}
        </div>
      </section>

      {/* Completed Assignments */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Completed
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {completedAssignments.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {completedAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} {...assignment} />
          ))}
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
