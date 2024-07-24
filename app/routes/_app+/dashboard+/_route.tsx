import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getLoggedInUser } from "~/services/auth/session.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getLoggedInUser(request);

  return json({ user });
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return <p>I'm the dashboard. {user.firstName}</p>
}