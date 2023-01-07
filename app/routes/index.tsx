import { LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { createHeaders, decryptToken, getToken } from "~/session";
import { SpotifyClient } from "~/spotify";

interface PlayerState {
  playing: {
    id: string;
    uri: string;
    name: string;
  } | null;
  queue: {
    id: string;
    uri: string;
    name: string;
  }[];
  username: string;
  stashes: {
    id: string;
    name: string;
  }[];
}

interface LoaderProps {
  state: PlayerState | null;
}

const getState = async (headers: Headers): Promise<PlayerState | null> => {
  const token = await getToken(headers);
  if (token == null) {
    return null;
  }
  const client = new SpotifyClient(decryptToken(token), '');
  const user = await client.userClient();
  const { displayName: username, id } = user.getUser();
  console.log({ username, id });
  const { queue, currentlyPlaying } = await client.getQueue();
  console.log({ queue });
  return {
    playing: currentlyPlaying,
    queue,
    username,
    stashes: [],
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const state = await getState(request.headers);

  return json<LoaderProps>({ state }, state == null ? { headers: await createHeaders() } : {});
};

const Index = () => {
  const { state } = useLoaderData<LoaderProps>();

  if (state == null) {
    return (
      <Link to='/login'>Login</Link>
    );
  }

  const { queue, playing, stashes, username } = state;

  return (
    <div>
      <dl>
        <dt>username</dt>
        <dd>{username}</dd>
        <dt>再生中</dt>
        <dd>{playing?.name ?? '停止中'}</dd>
      </dl>
      <ol>
        {queue.map((queue) => (
          <li>{queue.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default Index;
