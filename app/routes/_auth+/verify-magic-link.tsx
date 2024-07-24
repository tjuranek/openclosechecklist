import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { verifyMagicLink } from "~/services/auth/magic-link.service";
import { createSession } from "~/services/auth/session.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect('/login');
  }

  const user = await verifyMagicLink(token);

  if (!user) {
    return redirect("/login?error=invalid-or-expired-magic-link")
  }

  return createSession(request, user.id);
}