"use client";

import { UserType } from "@/types/types";
import { createContext, useContext, useState } from "react";

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
  currentUser,
}: {
  children: React.ReactNode;
}) {
  const [user] = useState({ user: { id: 1 } });
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  console.log({ context });
  if (!context) {
    throw new Error("Please, use this hook in UserContextProvider");
  }
  return context;
}
