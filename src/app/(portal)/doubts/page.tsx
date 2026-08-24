"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DoubtCard from "./DoubtCard";
import { NewDoubtDialog } from "./NewDoubtDialog";

const unresolvedDoubts = [
  {
    id: 1,
    title: "Doubt title",
    teacher: "Teacher name",
    askedTime: "10 hours ago",
  },
  {
    id: 2,
    title: "Doubt title",
    teacher: "Teacher name",
    askedTime: "2 days ago",
  },
];

const resolvedDoubts = [
  {
    id: 1,
    title: "Doubt title",
    teacher: "Teacher name",
    askedTime: "3 days ago",
  },
  {
    id: 2,
    title: "Doubt title",
    teacher: "Teacher name",
    askedTime: "1 week ago",
  },
];

export default function DoubtsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="px-2 py-5 mr-2">
      <div className="flex items-center gap-3">
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          Your <span className="text-foreground/90">Doubts</span>
        </h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus /> New
        </Button>
      </div>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg flex items-center gap-2">
            Unresolved{" "}
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            {unresolvedDoubts.length}
          </h2>
          <div className="flex gap-2 mt-1 mb-2">
            {unresolvedDoubts.map((doubt) => (
              <DoubtCard key={doubt.id} {...doubt} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg flex items-center gap-2">
            Resolved{" "}
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            {resolvedDoubts.length}
          </h2>
          <div className="flex gap-2 mt-1 mb-2">
            {resolvedDoubts.map((doubt) => (
              <DoubtCard key={doubt.id} {...doubt} />
            ))}
          </div>
        </div>
      </section>

      <NewDoubtDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
