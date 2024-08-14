import { LocationManagerService } from '~/services/location-manager/location-manager.service';
import {
  Form,
  json,
  Outlet,
  useActionData,
  useLoaderData
} from '@remix-run/react';
import {
  PhotoIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/16/solid';
import { CompanyOwnerService } from '~/services/company-owner/company-owner.service';
import { CompanyService } from '~/services/company/company.service';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { getUserInitials } from '~/services/user/user.util';
import { Heading, Subheading } from '~/components/heading';
import { getFormProps, useForm } from '@conform-to/react';
import { withAuth } from '~/services/auth/auth.util';
import { Field, Label } from '~/components/fieldset';
import { getRequiredParam } from '~/utils/params';
import { MetaFunction } from '@remix-run/node';
import { Button } from '~/components/button';
import { Input } from '~/components/input';
import { Badge } from '~/components/badge';
import { Text } from '~/components/text';
import { z } from 'zod';

export const loader = withAuth(async ({ params }) => {
  const companyId = getRequiredParam(params, 'companyId') as string;

  const [company, companyOwners, companyManagers] = await Promise.all([
    CompanyService.getById(companyId),
    CompanyOwnerService.getByCompanyId(companyId),
    LocationManagerService.findByCompanyId(companyId)
  ]);

  return json({ company, companyOwners, companyManagers });
});

export async function action() {}

const schema = z.object({
  name: z.string({ required_error: 'Name is required.' })
});

export default function CompanySettings() {
  const { company, companyOwners, companyManagers } =
    useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    }
  });

  return (
    <>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <Heading>Company Settings</Heading>
          <Text>Update your company details and manage members.</Text>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Details
            </h2>
            <p className="text-sm leading-6 text-gray-600">Just the basics.</p>
          </div>

          <Form className="col-span-2" method="POST" {...getFormProps(form)}>
            <div className="grid grid-cols-2 gap-8">
              <Field>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  field={fields.name}
                  defaultValue={company.name}
                />
              </Field>
            </div>
          </Form>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Members
            </h2>
            <p className="text-sm leading-6 text-gray-600">
              The people with access to your company.
            </p>
          </div>

          <ul
            role="list"
            className="divide-y divide-gray-100 col-span-2 border rounded-lg border-gray-900/10 px-6 py-6"
          >
            {companyOwners.map(companyOwner => (
              <li
                key={companyOwner.user.id}
                className="flex justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-400 text-white flex items-center justify-center">
                    {getUserInitials(companyOwner.user)}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {`${companyOwner.user.firstName} ${companyOwner.user.lastName}`}
                      </p>

                      <Badge color="lime">Owner</Badge>
                    </div>

                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {`Member since ${new Date(companyOwner.createdAt).toLocaleDateString('en-us', { dateStyle: 'long' })}`}
                    </p>
                  </div>
                </div>
              </li>
            ))}

            {companyManagers.map(companyManager => (
              <li
                key={companyManager.id}
                className="flex justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-400 text-white flex items-center justify-center">
                    {getUserInitials(companyManager.user)}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {`${companyManager.user.firstName} ${companyManager.user.lastName}`}
                      </p>

                      <Badge color="purple">Manager</Badge>
                    </div>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {`Member since ${new Date(companyManager.createdAt).toLocaleDateString('en-us', { dateStyle: 'long' })}`}
                    </p>
                  </div>
                </div>

                <Button className="p-0" color="red">
                  <TrashIcon />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Outlet />
    </>
  );
}

export const meta: MetaFunction = () => [{ title: 'Company Settings' }];
