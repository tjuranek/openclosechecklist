import { CompanyService } from '~/services/company/company.service';
import { AuthService } from '~/services/auth/auth.service';
import { withAuth } from '~/services/auth/auth.util';
import { getRequiredParam } from '~/utils/params';

/**
 * This sucks for a couple reasons:
 *  - This should be anything other than a GET request.
 *  - Navigating to this route to modify the session sucks.
 *
 * I'm doing this because the company switcher under _app/_layout.tsx uses the Headless UI
 * dropdown component. I don't remember how to use useFetcher or useSubmit to submit the
 * companyId to an action on that route, and the component doesn't work with the <Form />
 * component from Remix.
 */
export const loader = withAuth(async ({ params, request }) => {
  const companyId = (await getRequiredParam(params, 'companyId')) as string;

  return await new AuthService(request).setSelectedCompanyId(companyId);
});
