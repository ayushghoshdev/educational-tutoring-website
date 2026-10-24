"use client";

import { useState } from "react";
import ResourceCard from "./ResourceCard";
import { ResourceDialog, ResourceItem } from "./ResourceDialog";

const resources: ResourceItem[] = [
  {
    id: 1,
    title: "Resource #1",
    teacher: "Teacher 1",
    sharedTime: "10 minutes ago",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 2,
    title: "Resource #2",
    teacher: "Teacher 2",
    sharedTime: "yesterday",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 3,
    title: "Resource #3",
    teacher: "Teacher 1",
    sharedTime: "this friday",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 4,
    title: "Resource #4",
    teacher: "Teacher 2",
    sharedTime: "last week",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 5,
    title: "Resources #5",
    teacher: "Teacher 1",
    sharedTime: "2 weeks ago",
    fileUrl: "/resource_example.pdf",
  },
];

export default function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleResourceClick = (resource: ResourceItem) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  return (
    <div className="px-2 py-5 mr-2">
      <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
        Your <span className="text-foreground/90">Resources</span>
      </h1>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">All Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-1 mb-2">
            {resources.map((res) => (
              <ResourceCard
                key={res.id}
                title={res.title}
                teacher={res.teacher}
                sharedTime={res.sharedTime}
                onClick={() => handleResourceClick(res)}
              />
            ))}
          </div>
        </div>
      </section>

      <ResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        resource={selectedResource}
      />
    </div>
  );
}
