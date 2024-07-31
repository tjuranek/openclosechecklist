import { withAuth } from '~/services/auth/auth.util';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

export const loader = withAuth(({ user, selectedCompanyId }) => {
  return json({ user, selectedCompanyId });
});

export default function Home() {
  const { user, selectedCompanyId } = useLoaderData<typeof loader>();

  return <p>I'm the home page. {selectedCompanyId}</p>;
}
