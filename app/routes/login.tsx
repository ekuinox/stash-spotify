import { LoaderFunction, redirect } from "@remix-run/node";
import { SpotifyClient } from "~/spotify";
import { createHeaders, createState } from "~/state";

const SCOPES = [
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-modify-playback-state',
  'user-read-private',
  'user-read-email',
];

export const loader: LoaderFunction = async ({ request, context }) => {
  const state = createState();
  const url = SpotifyClient.generateAuthorizeUri(
    state,
    SCOPES,
    {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      redirectUri: process.env.SPOTIFY_REDIRECT_URL as string,
    }
  );
  const headers = await createHeaders(state);
  return redirect(url, { headers });
};
