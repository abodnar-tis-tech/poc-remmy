import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is required" },
      { status: 400 }
    );
  }

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v17.0/me/conversations?fields=participants,messages{message,from,created_time}`,
      {
        params: { access_token: accessToken },
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "Failed to fetch messages:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
