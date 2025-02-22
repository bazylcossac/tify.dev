"use client";
import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#fffd00"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
}

export default Providers;
