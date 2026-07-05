"use client";

import { Search, Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function FloatingTopRightBar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-sidebar rounded-full p-1.5"
    >
      <button
        onClick={() => setNotificationsOpen(false)}
        className="cursor-pointer flex h-8 w-8 items-center justify-center text-foreground/85 hover:text-foreground hover:bg-accent rounded-full transition"
      >
        <Search size={20} />
      </button>

      <div className="relative">
        <button
          onClick={() => setNotificationsOpen((prev) => !prev)}
          className="cursor-pointer flex h-8 w-8 items-center justify-center text-foreground/85 hover:text-foreground hover:bg-accent rounded-full transition"
        >
          <Bell size={20} />
        </button>

        {notificationsOpen && (
          <div className="absolute -right-2 -top-2 w-68 rounded-lg bg-sidebar">
            <button
              onClick={() => setNotificationsOpen(false)}
              className="cursor-pointer absolute top-3 right-3 rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="flex h-45 items-center justify-center text-sm text-muted-foreground">
              No new notifications
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
