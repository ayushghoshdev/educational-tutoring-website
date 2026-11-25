export interface StudentAttendee {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string;
}

export interface ClassItem {
  id: number;
  name: string;
  teacher: string;
  teacherAvatar?: string;
  startTime: string;
  endTime: string;
  mode: "Online" | "Offline";
  attendees: StudentAttendee[];
}

export interface ExamItem {
  id: number;
  name: string;
  teacher: string;
  teacherAvatar?: string;
  startTime: string;
  endTime: string;
  mode: "Online" | "Offline";
}

export interface AssignmentItem {
  id: number;
  title: string;
  teacher: string;
  teacherAvatar?: string;
  dueDate: string;
  time: string;
  mode: "Online" | "Offline";
}

export interface DoubtItem {
  id: number;
  title: string;
  teacher: string;
  teacherAvatar?: string;
  askedTime: string;
  status: "resolved" | "unresolved" | string;
}
