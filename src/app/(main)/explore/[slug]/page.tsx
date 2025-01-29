"use client";
import { useParams } from "next/navigation";
import React from "react";

function Page() {
  const params = useParams();
  const slug = params?.slug;

  return <div>{slug} page</div>;
}

export default Page;
