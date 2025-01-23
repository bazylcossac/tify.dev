"use client";

import { UserType } from "@/types/types";
import { createContext, useState } from "react";

type ContextTypes = {
  user: UserType | null;
};

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user] = useState<UserType | null>(null);
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
