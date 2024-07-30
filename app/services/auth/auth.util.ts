import { User } from '@prisma/client';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { AuthService } from './auth.service';

type DataFunctionArgs = ActionFunctionArgs | LoaderFunctionArgs;

type AuthenticatedDataFunctionArgs = DataFunctionArgs & {
  user: User;
};

type AuthenticatedDataFunction<T> = (args: AuthenticatedDataFunctionArgs) => T;

/**
 * Wraps an action or loader function and makes the logged in user available.
 */
export function withAuth<T>(dataFunction: AuthenticatedDataFunction<T>) {
  return async function (args: DataFunctionArgs) {
    const user = await new AuthService(args.request).getUser();

    return dataFunction({ ...args, user });
  };
}
