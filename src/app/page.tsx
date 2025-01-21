import LandingBackground from "@/components/landingbg";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <div className="p-4">
        <Logo />
      </div>
      <div className="flex items-center flex-col pt-56">
        <div className="text-center space-y-2">
          <h1 className="font-bold text-7xl tracking-tight">
            Social media app for all of you, devs
          </h1>
          <p className="text-[#565656] text-xl">
            for development, for tech news, for memes, for whatever you want
          </p>
        </div>

        <div className="mt-10 space-x-4">
          <Button variant="secondary" className="px-4 rounded-lg">
            Get Started
          </Button>
          <Button className="px-6 rounded-lg">Log in</Button>
        </div>
        <div className="-z-10 absolute bottom-0">
          <LandingBackground />
        </div>
      </div>
    </div>
  );
}
