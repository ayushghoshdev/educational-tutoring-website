import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="space-y-2 text-center pb-2">
        <h1 className="text-2xl font-medium tracking-tight">Register</h1>
      </div>
      <div className="flex flex-col gap-2 bg-secondary rounded-xl p-2">
        <Link href="/register/student">
          <div className="bg-card hover:bg-card/80 rounded-xl p-5 transition-all">
            <h2 className="text-xl tracking-tight">Register as Student</h2>
          </div>
        </Link>
        <Link href="/register/teacher">
          <div className="bg-card hover:bg-card/80 rounded-xl p-5 transition-all">
            <h2 className="text-xl tracking-tight">Register as Teacher</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default RegisterPage;
