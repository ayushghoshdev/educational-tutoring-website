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

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <aside
      className={`${expanded ? "w-64" : "w-14"} h-[calc(100vh-32px)] bg-secondary/50 flex flex-col m-4 rounded-lg`}
    >
      <div className="flex justify-between items-center px-3 pb-2 pt-3">
        {expanded && <p className="text-lg ml-2">Sidebar</p>}
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
              "flex items-center rounded-lg py-2 transition hover:bg-secondary",
              expanded ? "justify-start gap-3 px-3" : "justify-center",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {expanded && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <Link href="/profile">
        <div className="p-2">
          <div
            className={`cursor-pointer flex items-center gap-2 hover:bg-secondary rounded-lg transition-all ${expanded ? "p-2" : "p-0"}`}
          >
            <Image
              src="https://ui-avatars.com/api/?name=Full+Name&background=0A0A0A&color=fff"
              width="40"
              height="40"
              alt="FN"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-medium leading-5">{expanded && "Full Name"}</p>
              <p className="text-sm text-muted-foreground leading-4.5">
                {expanded && "B. Tech 1st Year"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </aside>
  );
}
