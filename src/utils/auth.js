import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

// Auth is now handled by Payload's native `users` collection (auth: true),
// replacing NextAuth. getAuthSession reads Payload's session cookie and returns
// a shape compatible with the previous NextAuth usage: session.user.id/name/email.
export const getAuthSession = async () => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return null;
  return { user: { id: user.id, name: user.name, email: user.email } };
};
