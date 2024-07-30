enum Routes {
  Login = '/login',
  Logout = '/logout',
  Register = '/register'
}

export function replaceRouteParams(route: Routes, params: Record<string, string | number>): string {
  let result = route as string;

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`$${key}`, value.toString());
  }

  return result;
}
