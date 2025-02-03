import {} from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    hasAccess: boolean;
  }
  interface Session {
    userId: string;
  }
}
