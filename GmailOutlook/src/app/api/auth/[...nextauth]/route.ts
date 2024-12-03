import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          response_type: "code",
          prompt: "consent",
        },
      },
      checks: ["state", "pkce"],
    }),
    AzureADProvider({
      clientId: process.env.OUTLOOK_CLIENT_ID!,
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET!,
      tenantId: process.env.OUTLOOK_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid email profile offline_access Mail.Read",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        if (account.provider === "google") {
          token.googleAccessToken = account.access_token;
        }
        if (account.provider === "azure-ad") {
          token.outlookAccessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.googleAccessToken = token.googleAccessToken as string;
      session.outlookAccessToken = token.outlookAccessToken as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
