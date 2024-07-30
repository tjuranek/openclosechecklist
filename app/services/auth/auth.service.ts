import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { UserService } from '../user/user.service';
import { Routes } from '~/constants/routes';
import { env } from '~/constants/env';
import { User } from '@prisma/client';

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
    session.set('userId', userId);

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
}
