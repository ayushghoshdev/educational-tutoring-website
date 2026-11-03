"use client";

import { useEffect, useState } from "react";
import { TextMorph } from "torph/react";
import { GraduationCap, NotebookPen, ClipboardCheck } from "lucide-react";

const morphItems = [
  {
    key: "classes",
    text: "Classes",
    icon: GraduationCap,
  },
  {
    key: "assignments",
    text: "Assignments",
    icon: NotebookPen,
  },
  {
    key: "exams",
    text: "Exams",
    icon: ClipboardCheck,
  },
];

export function MorphingHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % morphItems.length);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const current = morphItems[index];
  const CurrentIcon = current.icon;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12]">
        <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap">
          <div
            key={current.key}
            className="flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-secondary/80 text-foreground transition-all duration-300"
          >
            <CurrentIcon className="size-6 sm:size-7" />
          </div>
          <TextMorph as="span" className="text-foreground inline-block">
            {current.text}
          </TextMorph>
        </div>
        <span className="block mt-2 sm:mt-3 text-muted-foreground font-normal">
          All in one place
        </span>
      </h1>
    </div>
  );
}

export default MorphingHeroText;
