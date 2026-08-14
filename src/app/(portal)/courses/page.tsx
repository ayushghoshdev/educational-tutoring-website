import CourseCard from "./CourseCard";

const currentCourses = [
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
    mode: "Online / Offline",
  },
];

const moreCourses = [
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

export default function CoursesPage() {
  return (
    <div className="px-2 py-5 mr-2">
      <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
        Your <span className="text-foreground/90">Courses</span>
      </h1>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg flex items-center gap-2">
            Current courses{" "}
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            {currentCourses.length}
          </h2>
          <div className="flex gap-2 mt-1 mb-2">
            {currentCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div>
          <h2 className="text-lg flex items-center gap-2">
            More courses{" "}
            <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
            {moreCourses.length}
          </h2>
          <div className="flex gap-2 mt-1 mb-2">
            {moreCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
