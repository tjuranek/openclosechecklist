import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { UserService } from '../user/user.service';
import { Routes } from '~/constants/routes';
import { env } from '~/constants/env';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [env.COOKIE_SECRET],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
    httpOnly: true
  }
});

export class AuthService {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  private async getSession() {
    return sessionStorage.getSession(this.request.headers.get('Cookie'));
  }

  async login(userId: string) {
    const session = await this.getSession();
    const accessibleCompanies =
      await UserService.getAccessibleCompanies(userId);

    session.set('userId', userId);

    if (accessibleCompanies.length) {
      session.set('selectedCompanyId', accessibleCompanies[0]);
    }

    return redirect(Routes.Home, {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session)
      }
    });
  }

  async logout() {
    const session = await this.getSession();

    throw redirect(Routes.Login, {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session)
      }
    });
  }

  async getUser() {
    const session = await this.getSession();
    const userId = (await session.get('userId')) as string;

    if (!userId) {
      throw redirect(Routes.Login);
    }

    const user = await UserService.findById(userId);

    if (!user) {
      throw this.logout();
    }

    return user;
  }

  async setSelectedCompanyId(companyId: string) {
    const session = await this.getSession();
    session.set('selectedCompanyId', companyId);

    return redirect(Routes.Home, {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session)
      }
    });
  }

  async getSelectedCompanyId(): Promise<string> {
    const session = await this.getSession();
    const selectedCompanyId = session.get('selectedCompanyId') as
      | string
      | undefined;

    if (!selectedCompanyId) {
      throw new Error('No selected company found');
    }

    return selectedCompanyId;
  }
}
