import { auth } from "@/auth";
import LandingBackground from "@/components/landingbg";
import LoginButtons from "@/components/login-buttons";
import Logo from "@/components/logo";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="relative min-h-screen ">
      <div className="p-4">
        <Logo />
      </div>
      <div className="flex items-center flex-col pt-24 md:pt-56 px-4">
        <div className="text-center space-y-2">
          <h1 className="font-bold text-6xl tracking-tight md:text-7xl">
            Social media app for all of you, devs
          </h1>
          <p className="text-[#565656] text-xl font-semibold pt-4 md:pt-4">
            for development, for tech news, for memes, for whatever you want
          </p>
        </div>
        {session?.user ? (
          <Link
            href="/home"
            className="px-6 py-2 rounded-button bg-white text-black hover:bg-white/60 font-semibold mt-10"
          >
            Explore
          </Link>
        ) : (
          <LoginButtons />
        )}
        <div className="-z-10 absolute bottom-0 md:bottom-0 min-w-full">
          <LandingBackground />
        </div>
      </div>
    </div>
  );
}
