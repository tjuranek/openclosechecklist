import { LoaderFunctionArgs } from "@remix-run/node";
import { deleteSession } from "~/services/auth/session.service";

export async function loader({ request }: LoaderFunctionArgs) {
  await deleteSession(request);
}