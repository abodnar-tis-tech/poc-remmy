"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const fetchEmails = async (service: "gmail" | "outlook") => {
    const accessToken =
      service === "gmail"
        ? session?.googleAccessToken
        : session?.outlookAccessToken;

    if (!accessToken) {
      console.error(`No access token available for ${service}`);
      return;
    }

    try {
      const res = await fetch(`/api/emails/${service}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch emails from ${service}`);
      }

      const data = await res.json();
      console.log(`${service.toUpperCase()} Emails:`, data);
    } catch (error) {
      console.error(`Error fetching ${service} emails:`, error);
    }
  };

  return (
    <div>
      {!session ? (
        <>
          <button onClick={() => signIn("google")}>Login with Google</button>
          <button onClick={() => signIn("azure-ad")}>Login with Outlook</button>
        </>
      ) : (
        <>
          <p>Logged in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Logout</button>
          <div>
            <button onClick={() => fetchEmails("gmail")}>
              Fetch Gmail Emails
            </button>
            <button onClick={() => fetchEmails("outlook")}>
              Fetch Outlook Emails
            </button>
          </div>
        </>
      )}
    </div>
  );
}
