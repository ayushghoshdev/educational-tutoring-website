import { GraduationCap, School } from "lucide-react";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="space-y-2 text-center pb-2">
        <h1 className="text-2xl font-medium tracking-tight">Register</h1>
      </div>
      <div className="flex flex-col gap-2 bg-secondary rounded-xl max-w-xs p-2">
        <Link href="/register/student">
          <div className="flex flex-col items-center justify-center bg-popover hover:bg-popover/50 rounded-xl px-5 py-10 transition-all">
            <GraduationCap />
            <h2 className="text-xl tracking-tight">Register as Student</h2>
            <p className="text-sm text-muted-foreground text-center">
              Enroll in courses, join classes, submit assignments, ask doubts
              and participate in exams
            </p>
          </div>
        </Link>
        <Link href="/register/teacher">
          <div className="flex flex-col items-center justify-center bg-popover hover:bg-popover/50 rounded-xl px-5 py-10 transition-all">
            <School />
            <h2 className="text-xl tracking-tight">Register as Teacher</h2>
            <p className="text-sm text-muted-foreground text-center">
              Create courses and classes, check assignments, grade exams and
              clear student's doubts
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default RegisterPage;
