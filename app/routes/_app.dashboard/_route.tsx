import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withAuth } from '~/services/auth/auth.util';

export const loader = withAuth(({ user }) => {
  return json({ user });
});

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return <p>I'm the dashboard. {user.firstName}</p>;
}
