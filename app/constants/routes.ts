export enum Routes {
  Checklists = '/checklists',
  Home = '/home',
  Locations = '/locations',
  Login = '/login',
  Logout = '/logout',
  Onboarding = '/onboarding',
  Register = '/register',
  ResourceSelectCompany = '/resource/select-company/$companyId',
  Settings = '/settings'
}

export function replaceRouteParams(
  route: Routes,
  params: Record<string, string | number>
): string {
  let result = route as string;

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`$${key}`, value.toString());
  }

  return result;
}
