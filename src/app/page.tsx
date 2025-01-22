import LandingBackground from "@/components/landingbg";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function Page() {
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

        <div className="mt-10 space-x-4 ">
          <Button
            variant="secondary"
            className="px-4 rounded-button bg-white text-black "
          >
            Get Started
          </Button>
          <Button className="px-6 rounded-button bg-[#171717] ">Log in</Button>
        </div>
        <div className="-z-10 absolute bottom-0 md:bottom-0">
          <LandingBackground />
        </div>
      </div>
    </div>
  );
}
