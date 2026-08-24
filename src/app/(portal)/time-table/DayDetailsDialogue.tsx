import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type DayData = {
  day: number;
  classes?: number;
  exams?: number;
  variant?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: DayData | null;
};

export function DayDetailsDialog({ open, onOpenChange, day }: Props) {
  if (!day) return null;

  const hasEvents = (day.classes ?? 0) > 0 || (day.exams ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg ring-0! [&_button:focus]:ring-0! [&_button:focus]:ring-offset-0!">
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            {day.day} July 2026{" "}
            {day.variant === "current" && (
              <span className="rounded-full text-sm bg-muted px-2 py-1">
                Today
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {!hasEvents ? (
          <div className="flex h-48 items-center justify-center text-center text-muted-foreground">
            No classes or exams on this date.
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {(day.classes ?? 0) > 0 && (
              <section className="space-y-3">
                <h3 className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    Classes
                    <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />{" "}
                    {day.classes}
                  </div>
                </h3>

                {Array.from({ length: day.classes ?? 0 }).map((_, i) => (
                  <div
                    key={i}
                    className="cursor-pointer rounded-lg bg-accent/65 hover:bg-accent transition-all p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Class name</p>
                        <div className="flex items-center gap-1">
                          <Image
                            src="https://ui-avatars.com/api/?name=Teacher+Name&background=0A0A0A&color=fff"
                            width={18}
                            height={18}
                            alt="TN"
                            className="rounded-full shrink-0"
                          />
                          <p className="text-sm text-muted-foreground">
                            Teacher name
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-medium">{9 + i}:00 AM</span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {(day.exams ?? 0) > 0 && (
              <section className="space-y-3">
                <h3 className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    Exams{" "}
                    <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />{" "}
                    {day.exams}
                  </div>
                </h3>

                {Array.from({ length: day.exams ?? 0 }).map((_, i) => (
                  <div
                    key={i}
                    className="cursor-pointer rounded-lg bg-accent/65 hover:bg-accent transition-all p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Exam name</p>
                        <div className="flex items-center gap-1">
                          <Image
                            src="https://ui-avatars.com/api/?name=Teacher+Name&background=0A0A0A&color=fff"
                            width={18}
                            height={18}
                            alt="TN"
                            className="rounded-full shrink-0"
                          />
                          <p className="text-sm text-muted-foreground">
                            Teacher name
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-medium">
                        {12 + i}:30 PM
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
