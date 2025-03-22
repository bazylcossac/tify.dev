import React from "react";
import Image from "next/image";

function LandingBackground() {
  return (
    <Image
      src="/images/landingbg.png"
      alt="landing page background"
      width={1920}
      height={1080}
      quality={100}
      priority
    />
  );
}

export default LandingBackground;
