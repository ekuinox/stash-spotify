import { createCookie } from "@remix-run/node";
import * as z from 'zod';
import { createState } from "./state";

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
