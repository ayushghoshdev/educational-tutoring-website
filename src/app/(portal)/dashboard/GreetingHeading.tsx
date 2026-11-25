"use client";

import { useEffect, useState } from "react";

function getTimeGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function GreetingHeading({ fullName }: { fullName: string }) {
  const [greeting, setGreeting] = useState<string>("Hello");

  useEffect(() => {
    setGreeting(getTimeGreeting(new Date().getHours()));
  }, []);

  return (
    <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
      {fullName ? (
        <>
          {greeting}, <span className="text-foreground/90">{fullName}</span>
        </>
      ) : (
        <>
          Your <span className="text-foreground/90">dashboard</span>
        </>
      )}
    </h1>
  );
}
