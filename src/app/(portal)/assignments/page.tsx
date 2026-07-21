import AssignmentCard from "./AssignmentCard";

const assignments = [
  {
    id: 1,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Offline",
    due: "in 10 minutes",
  },
  {
    id: 2,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Online",
    due: "tomorrow",
  },
  {
    id: 3,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Online",
    due: "this friday",
  },
  {
    id: 4,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Online",
    grade: "A+",
  },
  {
    id: 5,
    title: "Assignment title",
    teacher: "Teacher name",
    mode: "Offline",
    marks: "81/100",
  },
];

export default function AssignmentsPage() {
  return (
    <div className="px-2 py-5 mr-2">
      <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
        Your <span className="text-foreground/90">Assignments</span>
      </h1>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Pending</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {assignments
              .filter((cls) => cls.due)
              .map((cls) => (
                <AssignmentCard key={cls.id} {...cls} />
              ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg">Completed</h2>
          <div className="flex gap-2 mt-1 mb-2">
            {assignments
              .filter((cls) => cls.grade || cls.marks)
              .map((cls) => (
                <AssignmentCard key={cls.id} {...cls} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
