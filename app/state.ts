import { createCookie } from "@remix-run/node";
import * as z from 'zod';

const userState = createCookie('user-state');

const schema = z.object({
  state: z.string(),
});

export const createState = (length: number = 64) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
