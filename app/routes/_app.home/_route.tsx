import { withAuth } from '~/services/auth/auth.util';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

export const loader = withAuth(({ user }) => {
  return json({ user });
});

export default function Home() {
  const { user } = useLoaderData<typeof loader>();

  return <p>I'm the home page. {user.firstName}</p>;
}
