"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClassCard from "./ClassCard";
import { NewClassDialog } from "./NewClassDialog";
import { usePortalUser } from "@/components/PortalUserProvider";

const initialClasses = [
  {
    id: 1,
    title: "Class #1",
    teacher: "Teacher 1",
    time: "In 15 minutes",
    mode: "Online",
    status: "pending",
  },
  {
    id: 2,
    title: "Class #2",
    teacher: "Teacher 2",
    time: "Tomorrow, 10:00 AM",
    mode: "Offline",
    status: "pending",
  },
  {
    id: 3,
    title: "Class #3",
    teacher: "Teacher 1",
    time: "This friday, 2:00 PM",
    mode: "Online",
    status: "pending",
  },
  {
    id: 4,
    title: "Class #4",
    teacher: "Teacher 2",
    time: "Yesterday, 11:00 AM",
    mode: "Online",
    status: "completed",
  },
  {
    id: 5,
    title: "Class #5",
    teacher: "Teacher 1",
    time: "3 days ago",
    mode: "Offline",
    status: "completed",
  },
  {
    id: 6,
    title: "Class #6",
    teacher: "Teacher 2",
    time: "Last week",
    mode: "Offline",
    status: "completed",
  },
];

export default function ClassesPage() {
  const { isTeacher, profile, user } = usePortalUser();
  const [classesList, setClassesList] = useState(initialClasses);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddClass = (data: {
    className: string;
    mode: string;
    date: string;
    time: string;
    duration: string;
  }) => {
    const teacherName = profile?.full_name || user?.name || "Teacher";
    let formattedTime = "Upcoming";
    if (data.date && data.time) {
      formattedTime = `${data.date}, ${data.time}`;
    } else if (data.time) {
      formattedTime = `Today, ${data.time}`;
    }

    const newClass = {
      id: Date.now(),
      title: data.className,
      teacher: teacherName,
      time: formattedTime,
      mode: data.mode,
      status: "pending",
    };
    setClassesList((prev) => [newClass, ...prev]);
  };

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

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Pending</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {classesList
              .filter((c) => c.status === "pending")
              .map((c) => (
                <ClassCard key={c.id} {...c} />
              ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Completed</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {classesList
              .filter((c) => c.status === "completed")
              .map((c) => (
                <ClassCard key={c.id} {...c} />
              ))}
          </div>
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
