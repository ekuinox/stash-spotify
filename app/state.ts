import { createCookie } from "@remix-run/node";
import * as z from 'zod';

const userState = createCookie('user-state');

const schema = z.object({
  state: z.string(),
});

export const createState = () => {
  // TODO
  return "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const buffer = new Uint8Array(64);
  const randomBytes = crypto.getRandomValues(buffer);
  const token = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return token;
};

export const createHeaders = async (state: string): Promise<HeadersInit> => {
  const session: z.infer<typeof schema> = {
    state,
  };
  return {
    'set-cookie': await userState.serialize(session),
  };
};

export const getState = async (headers: Headers): Promise<string | null> => {
  const cookieHeader = headers.get('cookie');
  if (cookieHeader == null) {
    return null;
  }
  const session = await userState.parse(cookieHeader);
  const r = schema.safeParse(session);
  if (!r.success) {
    return null;
  }
  return r.data.state;
};
