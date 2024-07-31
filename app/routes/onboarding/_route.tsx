import { LocationService } from '~/services/location/location.service';
import { CompanyService } from '~/services/company/company.service';
import { Form, redirect, useActionData } from '@remix-run/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { AuthService } from '~/services/auth/auth.service';
import { getFormProps, useForm } from '@conform-to/react';
import { Field, Label } from '~/components/fieldset';
import { ActionFunctionArgs } from '@remix-run/node';
import { Button } from '~/components/button';
import { Routes } from '~/constants/routes';
import { Input } from '~/components/input';
import { Text } from '~/components/text';
import { z } from 'zod';

const schema = z.object({
  companyName: z.string({ required_error: 'Company name is required.' }),
  location: z.string({ required_error: 'Location is required.' })
});

export async function action({ request }: ActionFunctionArgs) {
  const authService = new AuthService(request);
  const user = await authService.getUser();

  const submission = parseWithZod(await request.formData(), { schema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { companyName, location } = submission.value;

  const company = await CompanyService.createCompany(companyName, user.id);
  await LocationService.createLocation(location, company.id);

  return await authService.setSelectedCompanyId(company.id);
}

export default function Onboarding() {
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
    <div className="flex flex-col items-center justify-center min-h-dvh">
      <div className="container px-4 md:px-6 py-12 md:py-24 lg:py-32 xl:py-40 flex flex-col items-center text-center space-y-6 max-w-lg">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Welcome to Open Close Checklist
          </h1>
          <p className="text-muted-foreground text-md">
            Thanks for registering. We're excited to help you get your business
            operationally ready for every open. A couple quick questions to help
            us get started.
          </p>
        </div>

        <Form
          method="POST"
          {...getFormProps(form)}
          className="w-full max-w-md text-left space-y-2"
        >
          <Field>
            <Label>Company Name</Label>
            <Input type="text" name="companyName" field={fields.companyName} />
          </Field>

          <Field>
            <Label>Location</Label>
            <Input type="text" name="location" field={fields.location} />
            <Text className="text-xs text-muted-foreground">
              If you have multiple locations, just enter one for now.
            </Text>
          </Field>

          <Field>
            <Button className="mt-4 w-full" color="green" type="submit">
              Continue
            </Button>
          </Field>
        </Form>
      </div>
    </div>
  );
}
