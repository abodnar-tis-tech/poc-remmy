import { google, gmail_v1 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const messagesResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 500,
    });

    const messages = messagesResponse.data.messages || [];
    if (messages.length === 0) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const messageDetails = await Promise.all(
      messages.map(async (message) => {
        const messageResponse: gmail_v1.Schema$Message = (
          await gmail.users.messages.get({
            userId: "me",
            id: message.id!,
          })
        ).data;

        return {
          id: messageResponse.id,
          snippet: messageResponse.snippet,
        };
      })
    );

    return NextResponse.json(messageDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
