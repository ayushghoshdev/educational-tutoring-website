import { Camera, MapPin } from "lucide-react";

export default function ModeBadge({ mode }: { mode: string }) {
  const lower = mode.toLowerCase();
  const hasOnline = lower.includes("online");
  const hasOffline = lower.includes("offline");

  if (hasOnline && hasOffline) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1">
          <Camera className="w-4 h-4 shrink-0" />
          <span>Online</span>
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>Offline</span>
        </span>
      </span>
    );
  }

  if (hasOnline) {
    return (
      <span className="inline-flex items-center gap-1">
        <Camera className="w-4 h-4 shrink-0" />
        <span>{mode}</span>
      </span>
    );
  }

  if (hasOffline) {
    return (
      <span className="inline-flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span>{mode}</span>
      </span>
    );
  }

  return <span>{mode}</span>;
}
