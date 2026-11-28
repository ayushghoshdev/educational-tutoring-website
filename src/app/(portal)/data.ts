import { getPortalAvatarUrl } from "@/lib/utils";

export interface StudentAttendee {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string;
}

export interface PortalClassItem {
  id: number;
  title: string;
  teacher: string;
  teacherAvatar: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "Online" | "Offline";
  status: "pending" | "completed";
  attendees: StudentAttendee[];
}

export interface PortalExamItem {
  id: number;
  title: string;
  teacher: string;
  teacherAvatar: string;
  mode: "Online" | "Offline";
  date?: string;
  startTime?: string;
  endTime?: string;
  grade?: string;
  marks?: string;
}

export interface PortalAssignmentItem {
  id: number;
  title: string;
  teacher: string;
  teacherAvatar: string;
  mode: "Online" | "Offline";
  dueDate?: string;
  time?: string;
  grade?: string;
  marks?: string;
}

export interface PortalDoubtItem {
  id: number;
  title: string;
  teacher: string;
  teacherAvatar: string;
  askedTime: string;
  status: "resolved" | "unresolved";
}

export interface PortalResourceItem {
  id: number;
  title: string;
  teacher: string;
  teacherAvatar: string;
  sharedTime: string;
  fileUrl: string;
  category?: string;
}

export const mockStudents: StudentAttendee[] = [
  {
    id: "s1",
    name: "Student 1",
    initials: "S1",
    avatarUrl: getPortalAvatarUrl("S1", "00B4D8"),
  },
  {
    id: "s2",
    name: "Student 2",
    initials: "S2",
    avatarUrl: getPortalAvatarUrl("S2", "F72585"),
  },
  {
    id: "s3",
    name: "Student 3",
    initials: "S3",
    avatarUrl: getPortalAvatarUrl("S3", "FFB703", "000000"),
  },
  {
    id: "s4",
    name: "Student 4",
    initials: "S4",
    avatarUrl: getPortalAvatarUrl("S4", "8B5CF6"),
  },
  {
    id: "s5",
    name: "Student 5",
    initials: "S5",
    avatarUrl: getPortalAvatarUrl("S5", "10B981"),
  },
];

export const initialClasses: PortalClassItem[] = [
  {
    id: 1,
    title: "Class name",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    date: "Today",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    mode: "Offline",
    status: "pending",
    attendees: [mockStudents[0], mockStudents[1], mockStudents[2]],
  },
  {
    id: 2,
    title: "A really long class name",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    date: "Tomorrow",
    startTime: "12:30 PM",
    endTime: "2:00 PM",
    mode: "Online",
    status: "pending",
    attendees: [
      mockStudents[1],
      mockStudents[2],
      mockStudents[3],
      mockStudents[4],
    ],
  },
  {
    id: 3,
    title: "Class name",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    date: "This Friday",
    startTime: "2:30 PM",
    endTime: "4:00 PM",
    mode: "Online",
    status: "pending",
    attendees: [mockStudents[0], mockStudents[3], mockStudents[4]],
  },
  {
    id: 4,
    title: "Class #4",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    date: "Yesterday",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    mode: "Online",
    status: "completed",
    attendees: [mockStudents[0], mockStudents[1], mockStudents[2]],
  },
  {
    id: 5,
    title: "Class #5",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    date: "3 days ago",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    mode: "Offline",
    status: "completed",
    attendees: [mockStudents[1], mockStudents[3], mockStudents[4]],
  },
  {
    id: 6,
    title: "Class #6",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    date: "Last week",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    mode: "Offline",
    status: "completed",
    attendees: [
      mockStudents[0],
      mockStudents[2],
      mockStudents[3],
      mockStudents[4],
    ],
  },
  {
    id: 7,
    title: "Class #7",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    date: "2 weeks ago",
    startTime: "9:30 AM",
    endTime: "11:00 AM",
    mode: "Online",
    status: "completed",
    attendees: [mockStudents[0], mockStudents[1], mockStudents[4]],
  },
];

export const initialExams: PortalExamItem[] = [
  {
    id: 1,
    title: "Exam name",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    date: "Today",
    startTime: "7:30 PM",
    endTime: "9:00 PM",
    mode: "Online",
  },
  {
    id: 2,
    title: "Exam name",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    date: "Tomorrow",
    startTime: "8:50 PM",
    endTime: "10:20 PM",
    mode: "Offline",
  },
  {
    id: 3,
    title: "Exam title",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    mode: "Online",
    grade: "A",
  },
  {
    id: 4,
    title: "Exam title",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    mode: "Offline",
    marks: "92/100",
  },
  {
    id: 5,
    title: "Exam title",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    mode: "Online",
    marks: "74/100",
  },
];

export const initialAssignments: PortalAssignmentItem[] = [
  {
    id: 1,
    title: "Assignment title",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    dueDate: "Tomorrow",
    time: "6:00 PM",
    mode: "Online",
  },
  {
    id: 2,
    title: "Assignment title",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    dueDate: "December 2",
    time: "12:00 PM",
    mode: "Offline",
  },
  {
    id: 3,
    title: "Assignment title",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    dueDate: "December 5",
    time: "5:00 PM",
    mode: "Online",
  },
  {
    id: 4,
    title: "Assignment title",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    dueDate: "December 8",
    time: "11:59 PM",
    mode: "Offline",
  },
  {
    id: 5,
    title: "Assignment title",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    mode: "Online",
    grade: "B+",
  },
  {
    id: 6,
    title: "Assignment title",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    mode: "Offline",
    marks: "88/100",
  },
];

export const initialDoubts: PortalDoubtItem[] = [
  {
    id: 1,
    title: "Doubt title",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    askedTime: "10 hours ago",
    status: "resolved",
  },
  {
    id: 2,
    title: "Doubt title",
    teacher: "Teacher name",
    teacherAvatar: getPortalAvatarUrl("Teacher Name"),
    askedTime: "2 days ago",
    status: "unresolved",
  },
  {
    id: 3,
    title: "Doubt title",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    askedTime: "3 days ago",
    status: "resolved",
  },
  {
    id: 4,
    title: "Doubt title",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    askedTime: "1 week ago",
    status: "unresolved",
  },
];

export const initialResources: PortalResourceItem[] = [
  {
    id: 1,
    title: "Resource #1",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    sharedTime: "10 minutes ago",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 2,
    title: "Resource #2",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    sharedTime: "yesterday",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 3,
    title: "Resource #3",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    sharedTime: "this friday",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 4,
    title: "Resource #4",
    teacher: "Teacher 2",
    teacherAvatar: getPortalAvatarUrl("Teacher 2"),
    sharedTime: "last week",
    fileUrl: "/resource_example.pdf",
  },
  {
    id: 5,
    title: "Resources #5",
    teacher: "Teacher 1",
    teacherAvatar: getPortalAvatarUrl("Teacher 1"),
    sharedTime: "2 weeks ago",
    fileUrl: "/resource_example.pdf",
  },
];
