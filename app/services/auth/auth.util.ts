import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect
} from '@remix-run/node';
import { Prisma, User } from '@prisma/client';
import { AuthService } from './auth.service';
import { Routes } from '~/constants/routes';

type DataFunctionArgs = ActionFunctionArgs | LoaderFunctionArgs;

type AuthenticatedDataFunctionArgs = DataFunctionArgs & {
  user: Prisma.UserGetPayload<{
    include: {
      managedLocations: true;
      ownedCompanies: true;
    };
  }>;
  selectedCompanyId: string;
};

type AuthenticatedDataFunction<T> = (args: AuthenticatedDataFunctionArgs) => T;

export function withAuth<T>(dataFunction: AuthenticatedDataFunction<T>) {
  return async function (args: DataFunctionArgs) {
    const authService = new AuthService(args.request);
    const user = await authService.getUser();

    if (!user.ownedCompanies.length && !user.managedLocations.length) {
      return redirect(Routes.Onboarding);
    }

    const selectedCompanyId = await authService.getSelectedCompanyId();

    return dataFunction({ ...args, user, selectedCompanyId });
  };
}
