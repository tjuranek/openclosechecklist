import { AuthService } from '~/services/auth/auth.service';
import { withAuth } from '~/services/auth/auth.util';

export const loader = withAuth(async ({ request }) => {
  await new AuthService(request).logout();
});
