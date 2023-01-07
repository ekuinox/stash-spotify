import { createCookie } from "@remix-run/node";
import * as z from 'zod';

const userSession = createCookie('user-session');

const schema = z.object({
  token: z.string().nullable(),
  state: z.string(),
});

export const encryptToken = (token: string): string => {
  // TODO
  return token;
};

export const decryptToken = (token: string): string => {
  // TODO
  return token;
};

export const createState = (length: number = 64) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const createHeaders = async ({
  state,
  token,
}: {
  state?: string;
  token?: string;
} = {}): Promise<HeadersInit> => {
  const session: z.infer<typeof schema> = {
    token: token ?? null,
    state: state ?? createState(),
  };
  return {
    'set-cookie': await userSession.serialize(session),
  };
};

export const getSession = async (headers: Headers): Promise<z.infer<typeof schema> | null> => {
  const cookieHeader = headers.get('cookie');
  if (cookieHeader == null) {
    return null;
  }
  const session = await userSession.parse(cookieHeader);
  const r = schema.safeParse(session);
  if (!r.success) {
    return null;
  }
  return r.data;
};

export const getToken = async (headers: Headers): Promise<string | null> => {
  const session = await getSession(headers);
  if (session == null) {
    return null;
  }
  return session.token;
};
