import NextAuth from "next-auth"
import { UserData } from "../utils/interfaces";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    userData: UserData;
  }
}