import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/messages?$top=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching emails: ${response.statusText}`);
    }

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emails = data.value.map((email: any) => ({
      id: email.id,
      subject: email.subject,
      from: email.from?.emailAddress?.address,
      receivedDateTime: email.receivedDateTime,
    }));

    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    console.error("Error fetching emails from Outlook:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
