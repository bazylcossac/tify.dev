import {} from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
  }
  interface Session {
    userId: string;
  }
}
