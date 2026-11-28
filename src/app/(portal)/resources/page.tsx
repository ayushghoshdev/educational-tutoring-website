"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ResourceCard from "./ResourceCard";
import { ResourceDialog, ResourceItem } from "./ResourceDialog";
import { NewResourceDialog } from "./NewResourceDialog";
import { usePortalUser } from "@/components/PortalUserProvider";
import { getPortalAvatarUrl } from "@/lib/utils";
import { initialResources, type PortalResourceItem } from "../data";

export default function ResourcesPage() {
  const { isTeacher, profile, user } = usePortalUser();
  const [resourcesList, setResourcesList] =
    useState<PortalResourceItem[]>(initialResources);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(
    null,
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const handleResourceClick = (resource: PortalResourceItem) => {
    setSelectedResource(resource);
    setViewDialogOpen(true);
  };

  const handleAddResource = ({
    title,
    files,
  }: {
    title: string;
    files: File[];
  }) => {
    const teacherName = profile?.full_name || user?.name || "Teacher";
    const fileUrl =
      files && files.length > 0
        ? URL.createObjectURL(files[0])
        : "/resource_example.pdf";

    const newRes: PortalResourceItem = {
      id: Date.now(),
      title,
      teacher: teacherName,
      teacherAvatar: getPortalAvatarUrl(teacherName),
      sharedTime: "Just now",
      fileUrl,
    };
    setResourcesList((prev) => [newRes, ...prev]);
  };

  return (
    <div className="px-2 py-5 mr-2">
      <div className="flex items-center gap-3">
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          Your <span className="text-foreground/90">Resources</span>
        </h1>
        {isTeacher && (
          <Button onClick={() => setNewDialogOpen(true)}>
            <Plus /> New
          </Button>
        )}
      </div>

      <section className="rounded-lg bg-sidebar px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            All Resources
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {resourcesList.length}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {resourcesList.map((res) => (
            <ResourceCard
              key={res.id}
              title={res.title}
              teacher={res.teacher}
              teacherAvatar={res.teacherAvatar}
              sharedTime={res.sharedTime}
              onClick={() => handleResourceClick(res)}
            />
          ))}
        </div>
      </section>

      <ResourceDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        resource={selectedResource}
      />

      {isTeacher && (
        <NewResourceDialog
          open={newDialogOpen}
          onOpenChange={setNewDialogOpen}
          onAddResource={handleAddResource}
        />
      )}
    </div>
  );
}
