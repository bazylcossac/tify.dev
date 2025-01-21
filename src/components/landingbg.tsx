import React from "react";
import Image from "next/image";

function LandingBackground() {
  return (
    <Image
      src="/images/landingbg.png"
      alt="landing page background"
      width={1920}
      height={1920}
      quality={100}
    />
  );
}

export default LandingBackground;
