import { LoaderFunction, redirect } from "@remix-run/node";
import { createHeaders, getSession } from "~/session";
import { SpotifyClient } from "~/spotify";
import { createState } from "~/state";

const SCOPES = [
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-modify-playback-state',
  'user-read-private',
  'user-read-email',
];

export const loader: LoaderFunction = async ({ request, context }) => {
  const session = await getSession(request.headers);
  const state = session?.state ?? createState();
  const headers = await createHeaders({ state });
  const url = SpotifyClient.generateAuthorizeUri(
    state,
    SCOPES,
    {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      redirectUri: process.env.SPOTIFY_REDIRECT_URL as string,
    }
  );
  return redirect(url, { headers });
};
