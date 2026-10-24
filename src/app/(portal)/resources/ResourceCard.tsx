import Image from "next/image";

type ResourceCardProps = {
  title: string;
  teacher: string;
  sharedTime: string;
  onClick: () => void;
};

export default function ResourceCard({
  title,
  teacher,
  sharedTime,
  onClick,
}: ResourceCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex-1 min-w-0 cursor-pointer rounded-lg bg-accent/65 hover:bg-accent w-full px-3 py-2 transition-all"
    >
      <p className="text-lg truncate leading-6">{title}</p>
      <div className="flex items-center gap-1">
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            teacher,
          )}&background=0A0A0A&color=fff`}
          width={18}
          height={18}
          alt={teacher}
          className="rounded-full shrink-0"
        />
        <p className="text-sm text-muted-foreground">{teacher}</p>
      </div>
      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
        <p>Shared {sharedTime}</p>
      </div>
    </div>
  );
}

