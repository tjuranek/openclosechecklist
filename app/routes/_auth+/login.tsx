import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { Button } from "~/components/button";
import { Field, FieldGroup, Fieldset, Label } from "~/components/fieldset";
import { Input } from "~/components/input";
import { z } from "zod";
import { getFormProps, SubmissionResult, useForm } from "@conform-to/react";
import { Heading } from "~/components/heading";
import { Text } from "~/components/text";
import { Link } from "~/components/link";
import { getUserByEmail } from "~/services/users";
import { sendMagicLinkEmail } from "~/services/email/email.service";
import { createMagicLink } from "~/services/auth/magic-link.service";

const schema = z.object({
  email: z.string({ required_error: "Email is required." }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const success = url.searchParams.get("success");

  let errorMessage = null;
  if (error === "invalid-or-expired-magic-link") {
    errorMessage =
      "The magic link is invalid or has expired. Please request a new one.";
  }

  return json({ errorMessage, success: success === "true" });
}

export async function action({ request }: ActionFunctionArgs) {
  const submission = parseWithZod(await request.formData(), { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const user = await getUserByEmail(submission.value.email);

  if (!user) {
    return submission.reply({
      fieldErrors: { email: ["A user was not found with this email."] },
    });
  }

  const magicLink = await createMagicLink(user.id);
  await sendMagicLinkEmail(user.email, user.firstName, magicLink);

  return redirect("/login?success=true");
}

export default function Login() {
  const { errorMessage, success } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult: actionData as any,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {success ? (
              <div className="text-center p-8 bg-green-50 rounded-lg shadow-md">
                <svg
                  className="mx-auto h-12 w-12 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <Heading className="mt-4 text-2xl font-bold text-gray-900">
                  Check Your Email
                </Heading>
                <Text className="mt-2 text-gray-600">
                  We've sent a magic link to your email address. Click the link
                  to sign in to your account.
                </Text>
                <Text className="mt-4 text-sm text-gray-500">
                  Didn't receive an email? Check your spam folder or{" "}
                  <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    try again
                  </Link>
                </Text>
              </div>
            ) : (
              <>
                <div>
                  <Heading>Sign in to your account</Heading>
                  <Text className="mt-2">
                    Not a member yet?{" "}
                    <Link
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                      href="/register"
                    >
                      Sign up
                    </Link>
                  </Text>
                </div>

                <div className="mt-10">
                  {errorMessage && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                      {errorMessage}
                    </div>
                  )}
                  <Form method="POST" {...getFormProps(form)}>
                    <Fieldset>
                      <FieldGroup>
                        <Field>
                          <Label>Email Address</Label>
                          <Input
                            type="email"
                            name="email"
                            field={fields.email}
                          />
                        </Field>
                      </FieldGroup>
                    </Fieldset>

                    <Button className="mt-8" color="green" type="submit">
                      Sign in
                    </Button>
                  </Form>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
