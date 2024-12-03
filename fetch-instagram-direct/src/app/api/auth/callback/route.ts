import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, INSTAGRAM_REDIRECT_URI } =
    process.env;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code missing" },
      { status: 400 }
    );
  }

  try {
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      null,
      {
        params: {
          client_id: INSTAGRAM_APP_ID,
          client_secret: INSTAGRAM_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: INSTAGRAM_REDIRECT_URI,
          code,
        },
      }
    );

    const { access_token, user_id } = tokenResponse.data;

    return NextResponse.json({ access_token, user_id });
  } catch (error: any) {
    console.error(
      "Failed to fetch access token:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch access token" },
      { status: 500 }
    );
  }
}
