import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight } from "lucide-react";
import ClassCard from "./ClassCard";
import Link from "next/link";
import ExamCard from "./ExamCard";
import AssignmentCard from "./AssignmentCard";
import { title } from "process";
import CourseCard from "./CourseCard";
import DoubtCard from "./DoubtCard";

const classes = [
  {
    id: 1,
    name: "Class name",
    teacher: "Teacher name",
    time: "10:00 AM",
    mode: "Offline",
  },
  {
    id: 2,
    name: "A really long class name",
    teacher: "Teacher name",
    time: "12:30 PM",
    mode: "Online",
  },
  {
    id: 3,
    name: "Class name",
    teacher: "Teacher name",
    time: "2:30 PM",
    mode: "Online",
  },
];

const exams = [
  {
    id: 1,
    name: "Exam name",
    teacher: "Teacher name",
    time: "7:30 PM",
    mode: "Online",
  },
  {
    id: 2,
    name: "Exam name",
    teacher: "Teacher name",
    time: "8:50 PM",
    mode: "Offline",
  },
];

const assignments = [
  {
    id: 1,
    title: "Assignment title",
    teacher: "Teacher name",
    time: "5:00 PM",
    mode: "Online",
  },
  {
    id: 2,
    title: "Assignment title",
    teacher: "Teacher name",
    time: "5:00 PM",
    mode: "Offline",
  },
];

const courses = [
  {
    id: 1,
    title: "Course title",
    teacher: "Teacher name",
    mode: "Offline",
  },
  {
    id: 2,
    title: "Course title",
    teacher: "Teacher name",
    mode: "Online",
  },
  {
    id: 3,
    title: "Course title",
    teacher: "Teacher name",
    mode: "Online / Offline",
  },
];

const doubts = [
  {
    id: 1,
    title: "Doubt title",
    teacher: "Teacher name",
    askedTime: "10 hours ago",
  },
  {
    id: 2,
    title: "Doubt title",
    teacher: "Teacher name",
    askedTime: "2 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="px-2 py-5 mr-2">
      <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
        Welcome, <span className="text-foreground/90">Full Name</span>
      </h1>

      <section className="bg-sidebar rounded-lg px-4 py-2 mt-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg">Your agenda</h2>
          <Select defaultValue="today">
            <SelectTrigger className="hover:bg-muted/65!">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center justify-between mt-1">
            <h3 className="flex items-center gap-2">
              Classes{" "}
              <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
              {classes.length}
            </h3>
            <Link href="/time-table">
              <Button variant="ghost">
                View all classes
                <ArrowUpRight />
              </Button>
            </Link>
          </div>
          <div className="flex gap-2 mt-1 mb-2">
            {classes.map((cls) => (
              <ClassCard key={cls.id} {...cls} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mt-1">
            <h3 className="flex items-center gap-2">
              Exams{" "}
              <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
              {exams.length}
            </h3>
            <Link href="/time-table">
              <Button variant="ghost">
                View all exams
                <ArrowUpRight />
              </Button>
            </Link>
          </div>
          <div className="flex gap-2 mt-1 mb-2">
            {exams.map((cls) => (
              <ExamCard key={cls.id} {...cls} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mt-1">
            <h3 className="flex items-center gap-2">
              Assignments{" "}
              <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
              {assignments.length}
            </h3>
            <Link href="/time-table">
              <Button variant="ghost">
                View all assignments
                <ArrowUpRight />
              </Button>
            </Link>
          </div>
          <div className="flex gap-2 mt-1 mb-2">
            {assignments.map((cls) => (
              <AssignmentCard key={cls.id} {...cls} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sidebar rounded-lg px-4 py-2 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg flex items-center gap-2">
            Your doubts{" "}
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            {doubts.length}
          </h2>
          <Link href="/courses">
            <Button variant="ghost">
              View all doubts
              <ArrowUpRight />
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 mt-1 mb-2">
          {doubts.map((cls) => (
            <DoubtCard key={cls.id} {...cls} />
          ))}
        </div>
      </section>

      <section className="bg-sidebar rounded-lg px-4 py-2 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">You might also like</h2>
          <Link href="/courses">
            <Button variant="ghost">
              View more courses
              <ArrowUpRight />
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 mt-1 mb-2">
          {courses.map((cls) => (
            <CourseCard key={cls.id} {...cls} />
          ))}
        </div>
      </section>
    </div>
  );
}
