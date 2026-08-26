import ExamCard from "./ExamCard";

const exams = [
  {
    id: 1,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Offline",
    due: "in 10 minutes",
  },
  {
    id: 2,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Online",
    due: "tomorrow",
  },
  {
    id: 3,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Online",
    due: "this friday",
  },
  {
    id: 4,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Online",
    grade: "A+",
  },
  {
    id: 5,
    title: "Exam title",
    teacher: "Teacher name",
    mode: "Offline",
    marks: "81/100",
  },
];

export default function ExamsPage() {
  return (
    <div className="px-2 py-5 mr-2">
      <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
        Your <span className="text-foreground/90">Exams</span>
      </h1>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Pending</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {exams
              .filter((exam) => exam.due)
              .map((exam) => (
                <ExamCard key={exam.id} {...exam} />
              ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Completed</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {exams
              .filter((exam) => exam.grade || exam.marks)
              .map((exam) => (
                <ExamCard key={exam.id} {...exam} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
