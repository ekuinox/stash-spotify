import { LoaderFunction, redirect } from "@remix-run/node";
import { createHeaders, encryptToken, getSession } from "~/session";
import { SpotifyClient } from "~/spotify";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const session = await getSession(request.headers);
  if (session == null) {
    console.error('session null');
    return redirect('/');
  }
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (code == null) {
    console.error('code null');
    return redirect('/');
  }
  const state = url.searchParams.get('state');
  if (state !== session.state) {
    console.error('state incorrect or null');
    return redirect('/');
  }

  const client = await SpotifyClient.fromCode(code, {
    clientId: process.env.SPOTIFY_CLIENT_ID as string,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    redirectUri: process.env.SPOTIFY_REDIRECT_URL as string,
  });
  const token = client.getAccessToken();
  const headers = await createHeaders({
    token: encryptToken(token),
    state: session.state,
  });

  return redirect('/', { headers });
};
