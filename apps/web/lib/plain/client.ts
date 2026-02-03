import { PlainClient } from "@team-plain/typescript-sdk";

const apiKey = process.env.PLAIN_API_KEY;

export const plain =
  apiKey && apiKey.length > 0 && apiKey !== "undefined"
    ? new PlainClient({
      apiKey,
    })
    : null;

export type PlainUser = {
  id: string;
  name: string | null;
  email: string | null;
};
