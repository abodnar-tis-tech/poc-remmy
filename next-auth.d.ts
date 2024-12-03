import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    googleAccessToken?: string;
    outlookAccessToken?: string;
    idToken?: string;
    user?: DefaultUser & {
      creationTime?: string;
      uid: string;
      provider: "google" | "credentials";
    };
  }
  interface User extends DefaultUser {
    creationTime?: string;
    provider: "google" | "credentials";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    creationTime?: string;
    uid: string;
    provider: "google" | "credentials";
  }
}
