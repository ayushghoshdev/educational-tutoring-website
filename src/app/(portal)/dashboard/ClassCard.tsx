import Image from "next/image";

type ClassCardProps = {
  name: string;
  teacher: string;
  time: string;
  mode: string;
};

export default function ClassCard({
  name,
  teacher,
  time,
  mode,
}: ClassCardProps) {
  return (
    <div className="flex-1 min-w-0 cursor-pointer rounded-lg bg-accent/65 hover:bg-accent w-full px-3 py-2 transition-all">
      <p className="text-lg truncate leading-6">{name}</p>
      <div className="flex items-center gap-1">
        <Image
          src="https://ui-avatars.com/api/?name=Teacher+Name&background=0A0A0A&color=fff"
          width={18}
          height={18}
          alt="TN"
          className="rounded-full shrink-0"
        />
        <p className="text-sm text-muted-foreground">{teacher}</p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <p>{time}</p>
        <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
        <p>{mode}</p>
      </div>
    </div>
  );
}
