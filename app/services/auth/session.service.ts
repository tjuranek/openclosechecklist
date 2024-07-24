import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getUserById } from "../users";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: ["your_session_secret"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
    httpOnly: true,
  },
});

export async function createSession(request: Request, userId: string) {
  const session = await getSession(request);
  session.set("userId", userId);

  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session) 
    }
  });
}

export async function deleteSession(request: Request) {
  const session = await getSession(request);

  throw redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  })
}

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function getLoggedInUser(request: Request) {
  const session = await getSession(request);
  const userId = await session.get('userId') as string;

  if (!userId) {
    throw redirect('/login');
  }

  const user = await getUserById(userId);

  if (!user) {
    throw deleteSession(request);
  }

  return user;
} 