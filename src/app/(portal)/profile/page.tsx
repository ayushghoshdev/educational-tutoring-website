import Image from "next/image";
import { getCurrentUserProfile } from "@/app/actions/authActions";
import SignOutButton from "@/components/SignOutButton";
import { redirect } from "next/navigation";
import { Mail, GraduationCap, School, Building } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { session, profile } = await getCurrentUserProfile();

  if (!session) {
    redirect("/login");
  }

  const fullName = profile?.full_name || session.name || "User";
  const email = profile?.email || session.email || "";
  const role = profile?.role || "student";
  const dobFormatted =
    profile?.dob_formatted ||
    (profile?.dob_day && profile?.dob_month && profile?.dob_year
      ? `${profile.dob_day}/${profile.dob_month}/${profile.dob_year}`
      : "Not provided");

  const avatarUrl =
    session.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName,
    )}&background=18181b&color=ffffff&size=200&bold=true`;

  return (
    <div className="px-2 py-5 mr-2">
      <div>
        <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
          Your <span className="text-foreground/90">Profile</span>
        </h1>
      </div>

      <section className="rounded-lg bg-sidebar p-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <Image
              src={avatarUrl}
              width={80}
              height={80}
              alt={fullName}
              className="rounded-full shrink-0"
              priority
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-medium tracking-tight">
                {fullName}
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                  role === "teacher"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {role}
              </span>
            </div>

            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 -mt-1">
              <span>{email}</span>
            </p>

            <p className="text-xs text-muted-foreground/90 font-medium">
              {role === "student" ? (
                <span>
                  {profile?.education_subcategory ||
                    profile?.education_category ||
                    "Student"}{" "}
                  {profile?.education_year ? `• ${profile.education_year}` : ""}
                </span>
              ) : (
                <span>
                  {profile?.education_category || "Teacher"}{" "}
                  {profile?.degree_institute
                    ? `from ${profile.degree_institute}`
                    : ""}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar px-4 py-2 mt-4">
        <div className="bg-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-6">
            <h3 className="font-medium text-base">Personal Information</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium">{fullName}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{email}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Account Type</span>
              <span className="font-medium capitalize">{role}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                Date of Birth
              </span>
              <span className="font-medium">{dobFormatted}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-base">
              {role === "teacher"
                ? "Teaching & Qualifications"
                : "Academic Information"}
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            {role === "student" ? (
              <>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Education Level
                  </span>
                  <span className="font-medium capitalize">
                    {profile?.education_category || "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Stream / Course</span>
                  <span className="font-medium">
                    {profile?.education_subcategory || "General / N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Year of Study
                  </span>
                  <span className="font-medium">
                    {profile?.education_year || "N/A"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Degree Qualification
                  </span>
                  <span className="font-medium">
                    {profile?.education_category || "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Graduated From
                  </span>
                  <span className="font-medium">
                    {profile?.degree_institute || "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Affiliated Institute
                  </span>
                  <span className="font-medium">
                    {profile?.affiliated_institute || "Not specified"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-sidebar p-4 mt-4">
        <SignOutButton />
      </section>
    </div>
  );
}
