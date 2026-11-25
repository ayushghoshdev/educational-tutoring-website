import { ArrowUpRight } from "lucide-react";
import ClassCard from "./ClassCard";
import ExamCard from "./ExamCard";
import AssignmentCard from "./AssignmentCard";
import DoubtCard from "./DoubtCard";
import GreetingHeading from "./GreetingHeading";
import Link from "next/link";
import { getCurrentUserProfile } from "@/app/actions/authActions";
import {
  initialClasses,
  initialExams,
  initialAssignments,
  initialDoubts,
} from "./dashboardData";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { session, profile } = await getCurrentUserProfile();
  const role = profile?.role || session?.role || "student";
  const isTeacher = role === "teacher";

  const fullName =
    profile?.full_name?.trim() ||
    (session?.name && session.name !== "User" ? session.name.trim() : "");

  return (
    <div className="px-2 py-5 mr-2">
      <GreetingHeading fullName={fullName} />

      {/* Top Bento Row: Classes & Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        {/* Classes Panel */}
        <section className="lg:col-span-7 bg-sidebar rounded-lg px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h2 className="text-lg flex items-center gap-2">
              Classes
              <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
              <span className="text-muted-foreground">
                {initialClasses.length}
              </span>
            </h2>
            <Link
              href="/time-table"
              className="inline-flex items-center gap-1 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {initialClasses.map((cls) => (
              <ClassCard key={cls.id} {...cls} />
            ))}
          </div>
        </section>

        {/* Exams Panel */}
        <section className="lg:col-span-5 bg-sidebar rounded-lg px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h2 className="text-lg flex items-center gap-2">
              Exams
              <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
              <span className="text-muted-foreground">
                {initialExams.length}
              </span>
            </h2>
            <Link
              href="/exams"
              className="inline-flex items-center gap-1 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {initialExams.map((exam) => (
              <ExamCard key={exam.id} {...exam} />
            ))}
          </div>
        </section>
      </div>

      {/* Assignments Panel */}
      <section className="bg-sidebar rounded-lg px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            Assignments
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {initialAssignments.length}
            </span>
          </h2>
          <Link
            href="/assignments"
            className="inline-flex items-center gap-1 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {initialAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} {...assignment} />
          ))}
        </div>
      </section>

      {/* Doubts Panel */}
      <section className="bg-sidebar rounded-lg px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 sm:pt-3 mt-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="text-lg flex items-center gap-2">
            {isTeacher ? "Doubts asked to you" : "Your doubts"}
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            <span className="text-muted-foreground">
              {initialDoubts.length}
            </span>
          </h2>
          <Link
            href="/doubts"
            className="inline-flex items-center gap-1 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {initialDoubts.map((doubt) => (
            <DoubtCard key={doubt.id} {...doubt} isTeacher={isTeacher} />
          ))}
        </div>
      </section>
    </div>
  );
}
