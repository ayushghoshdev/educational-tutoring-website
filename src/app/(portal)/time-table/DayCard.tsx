import { cn } from "@/lib/utils";

export type DayCardVariant = "past" | "current" | "normal" | "next";

export type DayCardProps = {
  day: number;
  classes?: number;
  exams?: number;
  variant?: DayCardVariant;
  onClick?: () => void;
};

export function DayCard({
  day,
  classes = 0,
  exams = 0,
  variant = "normal",
  onClick,
}: DayCardProps) {
  const isCurrent = variant === "current";
  const isOtherMonth = variant === "past" || variant === "next";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "group relative aspect-square w-full rounded-xl p-2.5 pt-1 flex flex-col justify-between transition-all duration-200 cursor-pointer select-none text-left overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isCurrent
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : isOtherMonth
            ? "bg-accent/20 opacity-40 hover:opacity-75 hover:bg-accent/40"
            : "bg-card/75 hover:bg-accent/60",
      )}
    >
      <div className="flex items-center justify-between w-full">
        <span
          className={cn(
            "text-sm sm:text-base md:text-lg font-semibold tracking-tight transition-colors",
            isCurrent
              ? "text-primary-foreground"
              : isOtherMonth
                ? "text-muted-foreground"
                : "text-foreground group-hover:text-foreground",
          )}
        >
          {day}
        </span>

        {isCurrent && (
          <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground">
            <p className="mt-[1px]">Today</p>
          </span>
        )}

        {isCurrent && (
          <span className="sm:hidden size-1.5 rounded-full bg-primary-foreground" />
        )}
      </div>

      <div className="w-full space-y-1 sm:space-y-1.5 mt-auto">
        {classes > 0 && (
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 rounded-md px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs font-medium truncate transition-colors",
              isCurrent
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "bg-primary/10 text-primary-foreground/90 dark:text-foreground/90",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full shrink-0",
                isCurrent ? "bg-primary-foreground" : "bg-primary",
              )}
            />
            <span className="truncate">
              {classes}{" "}
              <span className="hidden sm:inline">
                class{classes > 1 ? "es" : ""}
              </span>
              <span className="sm:hidden">cl</span>
            </span>
          </div>
        )}

        {exams > 0 && (
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 rounded-md px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs font-medium truncate transition-colors",
              isCurrent
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-destructive/15 text-destructive dark:text-destructive-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full shrink-0",
                isCurrent ? "bg-primary-foreground" : "bg-destructive",
              )}
            />
            <span className="truncate">
              {exams}{" "}
              <span className="hidden sm:inline">
                exam{exams > 1 ? "s" : ""}
              </span>
              <span className="sm:hidden">ex</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
