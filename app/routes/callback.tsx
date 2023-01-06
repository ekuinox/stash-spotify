import { LoaderFunction, redirect } from "@remix-run/node";
import { createHeaders } from "~/session";
import { SpotifyClient } from "~/spotify";
import { createState } from "~/state";

const SCOPES = [
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-modify-playback-state',
];

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (code == null) {
    return redirect('/');
  }

  const client = await SpotifyClient.fromCode(code, {
    clientId: process.env.SPOTIFY_CLIENT_ID as string,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    redirectUri: process.env.SPOTIFY_REDIRECT_URL as string,
  });
  const token = client.getAccessToken();
  const headers = await createHeaders(token);

  return redirect('/', { headers });
};
