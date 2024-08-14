import { Form, json, useActionData, useLoaderData } from '@remix-run/react';
import { LocationService } from '~/services/location/location.service';
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
  name: z.string({ required_error: 'Name is required.' })
});

export const action = withAuth(async ({ user, request, selectedCompanyId }) => {
  const submission = parseWithZod(await request.formData(), { schema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  await LocationService.createLocation(selectedCompanyId, submission.value);

  return redirect(Routes.Locations);
});

export default function LocationsAdd() {
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
        <Heading>Add Location</Heading>
        <Text>Manage multiple physical spaces within your company.</Text>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Details
          </h2>
          <p className="text-sm leading-6 text-gray-600">
            Basic info about your location.
          </p>
        </div>

        <Form className="col-span-2" method="POST" {...getFormProps(form)}>
          <div className="grid grid-cols-2 gap-8">
            <Field>
              <Label>Location Name</Label>
              <Input type="text" name="name" field={fields.name} />
            </Field>

            <p>TODO: Add managers?</p>
          </div>

          <Button className="mt-8" color="green" type="submit">
            Save Location
          </Button>
        </Form>
      </div>
    </div>
  );
}

export const meta: MetaFunction = () => [{ title: 'Add Location' }];
