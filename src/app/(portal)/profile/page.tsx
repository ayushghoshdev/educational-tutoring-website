import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="px-2 py-5 mr-2">
      <h1 className="font-medium text-[26px] tracking-tight text-muted-foreground">
        Your <span className="text-foreground/90">Profile</span>
      </h1>

      <section className="flex items-center gap-5 py-2 mt-4">
        <div>
          <Image
            src="https://ui-avatars.com/api/?name=Full+Name&background=1B1B1B&color=fff"
            width={100}
            height={100}
            alt="FN"
            className="rounded-full shrink-0"
          />
        </div>
        <div>
          <h2 className="text-xl">Full name</h2>
          <p>B. Tech</p>
          <p>1st Year</p>
          <p>mail@gmail.com</p>
        </div>
      </section>
    </div>
  );
}
