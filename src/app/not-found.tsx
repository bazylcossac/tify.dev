import LandingBackground from "@/components/landingbg";
import Logo from "@/components/logo";
import Link from "next/link";

function NotFound() {
  return (
    <div className="relative min-h-screen ">
      <div className="p-4">
        <Logo />
      </div>
      <div className="flex items-center justify-center flex-col h-full pt-24">
        <p className="text-6xl font-bold">Page not found | 404</p>
        <Link href="/home" className="font-semibold pt-4">
          Go to home page
        </Link>
        <div className="-z-10 absolute bottom-0 md:bottom-0 min-w-full">
          <LandingBackground />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
