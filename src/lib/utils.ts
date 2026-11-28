import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPortalAvatarUrl(
  name: string,
  background: string = "0A0A0A",
  color: string = "ffffff",
): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=${background}&color=${color}&size=120&bold=true`;
}

export function computeEndTime(
  startTime: string,
  durationMinutesStr: string,
): string {
  const match = startTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const minsToAdd = Number(durationMinutesStr) || 60;
  if (!match) return startTime;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const totalMinutes = (hours * 60 + minutes + minsToAdd) % (24 * 60);
  const endHour24 = Math.floor(totalMinutes / 60);
  const endMin = totalMinutes % 60;
  const endPeriod = endHour24 >= 12 ? "PM" : "AM";
  const endHour12 = endHour24 % 12 === 0 ? 12 : endHour24 % 12;

  return `${endHour12}:${endMin.toString().padStart(2, "0")} ${endPeriod}`;
}
