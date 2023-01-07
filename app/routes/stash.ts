import { ActionFunction, json, redirect } from "@remix-run/node";
import { createStash, getStashes } from "~/services/stash";
import { getSession, createHeaders, decryptToken } from "~/session";
import { SpotifyClient } from "~/spotify";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers);
  if (session == null) {
    return json({});
  }
  const { token } = session;
  if (token == null) {
    return json({});
  }
  const client = new SpotifyClient(decryptToken(token), '');

  if (request.method === 'POST') {
    await createStash(client);
    return json({ ok: true });
  }
  // if (request.method === 'GET') {
  //   await getStashes(client);
  //   return json({});
  // }

  return json({});
};