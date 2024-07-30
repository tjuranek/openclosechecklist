import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { AuthService } from "~/services/auth/auth.service";
import { MagicLinkService } from "~/services/magic-link/magic-link.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect('/login');
  }

  const user = await MagicLinkService.verifyMagicLink(token);

  if (!user) {
    return redirect("/login?error=invalid-or-expired-magic-link")
  }

  return new AuthService(request).login(user.id);
}