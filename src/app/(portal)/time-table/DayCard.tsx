import { cn } from "@/lib/utils";

type DayCardProps = {
  day: number;
  classes?: number;
  exams?: number;
  variant?: "past" | "current" | "normal" | "next";
};

export function DayCard({
  day,
  classes = 0,
  exams = 0,
  variant = "normal",
}: DayCardProps) {
  const isCurrent = variant === "current";

  return (
    <div
      className={cn(
        "h-28 rounded-lg bg-accent/65 p-3 flex flex-col transition-colors duration-200 cursor-pointer",
        isCurrent
          ? "bg-primary hover:bg-primary/80 text-primary-foreground"
          : "hover:bg-accent",
        variant === "past" && "opacity-38",
        variant === "next" && "opacity-64",
      )}
    >
      <span
        className={cn(
          "text-xl font-medium",
          isCurrent
            ? "text-primary-foreground"
            : variant === "past"
              ? "text-muted-foreground"
              : variant === "next"
                ? "text-foreground/70"
                : "text-foreground",
        )}
      >
        {day}
      </span>

      <div className="mt-auto space-y-0.5">
        {classes > 0 && (
          <p
            className={cn(
              "text-sm",
              isCurrent
                ? "text-primary-foreground"
                : variant === "past"
                  ? "text-muted-foreground"
                  : variant === "next"
                    ? "text-foreground/65"
                    : "text-foreground/90",
            )}
          >
            {classes} class{classes > 1 && "es"}
          </p>
        )}

        {exams > 0 && (
          <p
            className={cn(
              "text-sm",
              isCurrent
                ? "text-primary-foreground"
                : variant === "past"
                  ? "text-muted-foreground"
                  : variant === "next"
                    ? "text-foreground/65"
                    : "text-foreground/90",
            )}
          >
            {exams} exam{exams > 1 && "s"}
          </p>
        )}
      </div>
    </div>
  );
}
