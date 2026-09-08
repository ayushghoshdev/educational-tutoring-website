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
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { getCurrentUserProfile } from "@/app/actions/authActions";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/time-table", label: "Time Table", icon: CalendarClock },
  { href: "/assignments", label: "Assignments", icon: NotebookPen },
  { href: "/exams", label: "Exams", icon: ClipboardClock },
  { href: "/doubts", label: "Doubts", icon: MessageCircleQuestionMark },
  { href: "/courses", label: "Courses", icon: Package },
];

const isRouteActive = (pathname: string, href: string) => {
  if (pathname === href) return true;
  if (pathname.startsWith(`${href}/`)) return true;

  // Handle singular vs plural route variations (e.g. /assignment/my-assignment-1 matching /assignments)
  const hrefSingular = href.endsWith("s") ? href.slice(0, -1) : href;
  if (pathname === hrefSingular || pathname.startsWith(`${hrefSingular}/`)) {
    return true;
  }

  return false;
};

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    subtitle: string;
    avatarUrl: string;
  }>({
    name: "User Profile",
    subtitle: "View details",
    avatarUrl:
      "https://ui-avatars.com/api/?name=User&background=0A0A0A&color=fff",
  });

  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      try {
        const { session, profile } = await getCurrentUserProfile();
        if (session) {
          const name = profile?.full_name || session.name || "User";
          let subtitle = "Member";
          if (profile?.role === "student") {
            subtitle =
              `${profile.education_subcategory || profile.education_category || "Student"} ${
                profile.education_year ? `• ${profile.education_year}` : ""
              }`.trim();
          } else if (profile?.role === "teacher") {
            subtitle = `${profile.education_category || "Teacher"}${
              profile.degree_institute ? ` • ${profile.degree_institute}` : ""
            }`.trim();
          }

          setUserInfo({
            name,
            subtitle,
            avatarUrl:
              session.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name,
              )}&background=18181b&color=ffffff&bold=true`,
          });
        }
      } catch (err) {
        console.error("Failed to load user info for sidebar:", err);
      }
    }
    loadUser();
  }, [pathname]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <aside
      className={`${
        expanded ? "w-64" : "w-14"
      } sticky top-4 h-[calc(100vh-32px)] bg-sidebar flex flex-col m-4 rounded-lg transition-all`}
    >
      <div
        className={clsx(
          "flex justify-between items-center px-2 pb-2 pt-2",
          expanded ? "" : "px-3",
        )}
      >
        {expanded && (
          <p className="text-lg ml-2 font-medium tracking-tight">Portal</p>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <PanelLeft />
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = isRouteActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center rounded-lg py-2 transition-colors",
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-foreground/85 hover:text-foreground hover:bg-secondary",
                expanded ? "px-3 gap-3" : "px-2.5",
              )}
            >
              <div className="flex w-5 justify-center">
                <Icon className="h-4.5 w-4.5 shrink-0" />
              </div>

              <span
                className={clsx(
                  "overflow-hidden whitespace-nowrap transition-all duration-300 text-sm",
                  expanded ? "max-w-[150px] opacity-100" : "max-w-0 opacity-0",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Link href="/profile">
        <div className={expanded ? "p-2" : "p-1"}>
          <div
            className={clsx(
              "cursor-pointer flex items-center rounded-lg transition-all",
              isRouteActive(pathname, "/profile")
                ? "bg-secondary text-foreground"
                : "hover:bg-secondary",
              expanded ? "p-2 gap-2" : "p-2",
            )}
          >
            <Image
              src={userInfo.avatarUrl}
              width={36}
              height={36}
              alt={userInfo.name}
              className="rounded-full shrink-0"
            />
            <div
              className={clsx(
                "overflow-hidden whitespace-nowrap transition-all duration-300",
                expanded ? "max-w-40 opacity-100" : "max-w-0 opacity-0",
              )}
            >
              <p className="font-medium text-sm leading-5 truncate">
                {userInfo.name}
              </p>
              <p className="text-xs text-muted-foreground leading-4 truncate">
                {userInfo.subtitle}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </aside>
  );
}
