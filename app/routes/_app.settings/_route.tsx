import { Form, json, useActionData, useLoaderData } from '@remix-run/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { UserService } from '~/services/user/user.service';
import { AuthService } from '~/services/auth/auth.service';
import { getFormProps, useForm } from '@conform-to/react';
import { MetaFunction, redirect } from '@remix-run/node';
import { withAuth } from '~/services/auth/auth.util';
import { Field, Label } from '~/components/fieldset';
import { Heading } from '~/components/heading';
import { Button } from '~/components/button';
import { Routes } from '~/constants/routes';
import { Input } from '~/components/input';
import { Text } from '~/components/text';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string({ required_error: 'First name is required.' }),
  lastName: z.string({ required_error: 'Last name is required.' }),
  email: z.string({ required_error: 'Email is required.' })
});

export const loader = withAuth(({ user }) => {
  return json({ user });
});

export const action = withAuth(async ({ user, request }) => {
  const submission = parseWithZod(await request.formData(), { schema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  await UserService.update(user.id, submission.value);

  return redirect(Routes.Settings);
});

export default function Settings() {
  const { user } = useLoaderData<typeof loader>();
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
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <Heading>User Settings</Heading>
        <Text>Update and manage your account.</Text>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="text-sm leading-6 text-gray-600">
            How your teammates see you.
          </p>
        </div>

        <Form className="col-span-2" method="POST" {...getFormProps(form)}>
          <div className="grid grid-cols-2 gap-8">
            <Field>
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                field={fields.firstName}
                defaultValue={user.firstName}
              />
            </Field>

            <Field>
              <Label>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                field={fields.lastName}
                defaultValue={user.lastName}
              />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input
                type="text"
                name="email"
                field={fields.email}
                defaultValue={user.email}
              />
            </Field>
          </div>

          <Button className="mt-8" color="green" type="submit">
            Save Profile
          </Button>
        </Form>
      </div>
    </div>
  );
}

export const meta: MetaFunction = () => [{ title: 'Settings' }];
