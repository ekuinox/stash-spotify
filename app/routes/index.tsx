import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { createHeaders, getSession } from "~/session";
import { SpotifyClient } from "~/spotify";

interface LoaderProps {
  username: string | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers);
  if (session == null) {
    return json<LoaderProps>({ username: null }, { headers: await createHeaders() });
  }
  const { token } = session;
  if (token == null) {
    return json<LoaderProps>({ username: null }, { headers: await createHeaders() });
  }
  const client = new SpotifyClient(token, '');
  const profile = await client.getCurrentUsersProfile();
  return json<LoaderProps>({ username: profile.displayName });
};

const Index = () => {
  const { username } = useLoaderData<LoaderProps>();
  return (
    <div>
      {username && (
        <p>こんにちは {username}</p>
      ) || (
          <Link to='/login'>Login</Link>
        )}
    </div>
  );
};

export default Index;
