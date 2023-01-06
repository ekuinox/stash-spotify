import { createCookie } from "@remix-run/node";
import * as z from 'zod';

const userSession = createCookie('user-session');

const schema = z.object({
  token: z.string(),
});

const encryptToken = (token: string): string => {
  // TODO
  return token;
};

const decryptToken = (token: string): string => {
  // TODO
  return token;
}

export const createHeaders = async (token: string): Promise<HeadersInit> => {
  const session: z.infer<typeof schema> = {
    token: encryptToken(token),
  };
  return {
    'set-cookie': await userSession.serialize(session),
  };
};

export const getToken = async (headers: Headers): Promise<string | null> => {
  const cookieHeader = headers.get('cookie');
  if (cookieHeader == null) {
    return null;
  }
  const session = await userSession.parse(cookieHeader);
  const r = schema.safeParse(session);
  if (!r.success) {
    return null;
  }
  return decryptToken(r.data.token);
};
