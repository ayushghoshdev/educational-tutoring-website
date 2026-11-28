"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DoubtCard from "./DoubtCard";
import { NewDoubtDialog } from "./NewDoubtDialog";
import { usePortalUser } from "@/components/PortalUserProvider";
import { initialDoubts } from "../data";

const unresolvedDoubts = initialDoubts.filter((d) => d.status === "unresolved");
const resolvedDoubts = initialDoubts.filter((d) => d.status === "resolved");

export default function DoubtsPage() {
  const { isStudent, isTeacher } = usePortalUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="px-2 py-5 mr-2">
      <div className="flex items-center gap-3">
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          {isTeacher ? (
            <>
              Doubts <span className="text-foreground/90">Asked to You</span>
            </>
          ) : (
            <>
              Your <span className="text-foreground/90">Doubts</span>
            </>
          )}
        </h1>
        {isStudent && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New
          </Button>
        )}
      </div>

      {/* Unresolved Doubts */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Unresolved
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {unresolvedDoubts.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {unresolvedDoubts.map((doubt) => (
            <DoubtCard key={doubt.id} {...doubt} isTeacher={isTeacher} />
          ))}
        </div>
      </section>

      {/* Resolved Doubts */}
      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Resolved
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {resolvedDoubts.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {resolvedDoubts.map((doubt) => (
            <DoubtCard key={doubt.id} {...doubt} isTeacher={isTeacher} />
          ))}
        </div>
      </section>

      {isStudent && (
        <NewDoubtDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  );
}
