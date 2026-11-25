import {
  ClassItem,
  ExamItem,
  AssignmentItem,
  DoubtItem,
  StudentAttendee,
} from "./types";

export function getApiAvatarUrl(
  name: string,
  background: string = "0A0A0A",
  color: string = "ffffff",
): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=${background}&color=${color}&size=120&bold=true`;
}

// Student attendees using s1, s2, s3... generated via ui-avatars API
export const mockStudents: StudentAttendee[] = [
  {
    id: "s1",
    name: "Student 1",
    initials: "S1",
    avatarUrl: getApiAvatarUrl("S1", "00B4D8", "ffffff"),
  },
  {
    id: "s2",
    name: "Student 2",
    initials: "S2",
    avatarUrl: getApiAvatarUrl("S2", "F72585", "ffffff"),
  },
  {
    id: "s3",
    name: "Student 3",
    initials: "S3",
    avatarUrl: getApiAvatarUrl("S3", "FFB703", "000000"),
  },
  {
    id: "s4",
    name: "Student 4",
    initials: "S4",
    avatarUrl: getApiAvatarUrl("S4", "8B5CF6", "ffffff"),
  },
  {
    id: "s5",
    name: "Student 5",
    initials: "S5",
    avatarUrl: getApiAvatarUrl("S5", "10B981", "ffffff"),
  },
];

export const initialClasses: ClassItem[] = [
  {
    id: 1,
    name: "Class name",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    mode: "Offline",
    attendees: [mockStudents[0], mockStudents[1], mockStudents[2]],
  },
  {
    id: 2,
    name: "A really long class name",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    startTime: "12:30 PM",
    endTime: "2:00 PM",
    mode: "Online",
    attendees: [
      mockStudents[1],
      mockStudents[2],
      mockStudents[3],
      mockStudents[4],
    ],
  },
  {
    id: 3,
    name: "Class name",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    startTime: "2:30 PM",
    endTime: "4:00 PM",
    mode: "Online",
    attendees: [mockStudents[0], mockStudents[3], mockStudents[4]],
  },
];

export const initialExams: ExamItem[] = [
  {
    id: 1,
    name: "Exam name",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    startTime: "7:30 PM",
    endTime: "9:00 PM",
    mode: "Online",
  },
  {
    id: 2,
    name: "Exam name",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    startTime: "8:50 PM",
    endTime: "10:20 PM",
    mode: "Offline",
  },
];

export const initialAssignments: AssignmentItem[] = [
  {
    id: 1,
    title: "Assignment title",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    dueDate: "Tomorrow",
    time: "6:00 PM",
    mode: "Online",
  },
  {
    id: 2,
    title: "Assignment title",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    dueDate: "December 2",
    time: "12:00 PM",
    mode: "Offline",
  },
];

export const initialDoubts: DoubtItem[] = [
  {
    id: 1,
    title: "Doubt title",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    askedTime: "10 hours ago",
    status: "resolved",
  },
  {
    id: 2,
    title: "Doubt title",
    teacher: "Teacher name",
    teacherAvatar: getApiAvatarUrl("Teacher Name", "0A0A0A", "ffffff"),
    askedTime: "2 days ago",
    status: "unresolved",
  },
];
