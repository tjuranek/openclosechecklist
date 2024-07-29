
import { Users } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getLoggedInUser } from "./session.service";

type DataFunctionArgs = ActionFunctionArgs | LoaderFunctionArgs;

type AuthenticatedDataFunctionArgs = DataFunctionArgs & {
  user: Users;
};

type AuthenticatedDataFunction<T> = (args: AuthenticatedDataFunctionArgs) => T;

/**
 * Wraps an action or loader function and makes the logged in user available.
 */
export function withAuth<T>(dataFunction: AuthenticatedDataFunction<T>) {
  return async function (args: DataFunctionArgs) {
    const user = await getLoggedInUser(args.request);

    return dataFunction({ ...args, user });
  };
}