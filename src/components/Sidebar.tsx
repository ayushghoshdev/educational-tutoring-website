"use client";

import {
  CalendarClock,
  ClipboardClock,
  LayoutDashboard,
  MessageCircleQuestionMark,
  NotebookPen,
  Package,
  PanelLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/time-table", label: "Time Table", icon: CalendarClock },
  { href: "/assignments", label: "Assignments", icon: NotebookPen },
  { href: "/exams", label: "Exams", icon: ClipboardClock },
  { href: "/doubts", label: "Doubts", icon: MessageCircleQuestionMark },
  { href: "/courses", label: "Courses", icon: Package },
];

export default function StudentSidebar() {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <aside
      className={`${expanded ? "w-64" : "w-14"} h-[calc(100vh-32px)] bg-secondary/50 flex flex-col m-4 rounded-lg`}
    >
      <div className="flex justify-between items-center px-3 pb-2 pt-3">
        {expanded && <p className="text-lg ml-2">StudentSidebar</p>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <PanelLeft />
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center rounded-lg py-2 transition hover:bg-muted",
              expanded ? "justify-start gap-3 px-3" : "justify-center",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {expanded && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <div className={`flex items-center gap-3 ${expanded ? "p-2" : "p-0"}`}>
          <Image
            src="https://ui-avatars.com/api/?name=Student+Name&background=0A0A0A&color=fff"
            width="30"
            height="30"
            alt="SN"
            className="rounded-full"
          />
          <p className="font-medium">{expanded && "Student name"}</p>
        </div>
      </div>
    </aside>
  );
}
