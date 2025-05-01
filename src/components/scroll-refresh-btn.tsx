"use client";
import React from "react";
import { Button } from "./ui/button";
import { useUserContext } from "@/contexts/userContextProvider";
import { IoIosRefresh } from "react-icons/io";

function ScrollRefreshBtn() {
  const { refetch } = useUserContext();
  return (
    <div className="fixed z-20">
      <Button
        className="bg-blue-500 rounded-full p-[10px] hover:rotate-180 transition hover:bg-blue-500 active:rotate-180 focus:rotate-180"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          refetch();
        }}
      >
        <IoIosRefresh />
      </Button>
    </div>
  );
}

export default ScrollRefreshBtn;
