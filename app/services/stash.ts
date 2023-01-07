import { format, parse, isValid } from "date-fns";
import { SpotifyClient } from "~/spotify";

export interface Stash {
  playlistId: string;
  playlistName: string;
}

const dateformat = 'yyyyMMddHHmmss';
const playlistNamePrefix = '轟SpotifyStash_';

const createNewPlaylistName = () => {
  const date = format(new Date(), dateformat);
  return `${playlistNamePrefix}${date}`;
};

const getDateTimeFromPlaylistName = (name: string): Date | null => {
  if (!name.startsWith(playlistNamePrefix)) {
    return null;
  }
  const date = parse(name.replace(playlistNamePrefix, ''), dateformat, new Date());
  if (!isValid(date)) {
    return null;
  }
  return date;
}

export const createStash = async (client: SpotifyClient, includePlaying: boolean = true): Promise<Stash | Error> => {
  try {
    const { queue, currentlyPlaying } = await client.getQueue();
    const tracks = (includePlaying && currentlyPlaying != null) ? [...queue, currentlyPlaying] : queue;
    const user = await client.userClient();
    const { id } = await user.createPlaylist(createNewPlaylistName());
    await user.putPlaylistItems(id, tracks.map((track) => track.uri));
    return Error('todo');
  } catch (e: unknown) {
    return Error(`${e}`);
  }
};

export const getStashes = async (client: SpotifyClient): Promise<Stash[] | Error> => {
  throw new Error('');
};

export const applyStash = async (client: SpotifyClient, playlistId: string): Promise<Stash | Error> => {
  throw new Error('');
};
