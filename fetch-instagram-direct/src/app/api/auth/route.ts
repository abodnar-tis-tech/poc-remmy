import { NextResponse } from "next/server";

export async function GET() {
  const { INSTAGRAM_APP_ID, INSTAGRAM_REDIRECT_URI } = process.env;

  const authURL = `https://api.instagram.com/oauth/authorize
    ?client_id=${INSTAGRAM_APP_ID}
    &redirect_uri=${INSTAGRAM_REDIRECT_URI}
    &scope=user_profile,user_media
    &response_type=code`.replace(/\s+/g, "");

  return NextResponse.redirect(authURL);
}
