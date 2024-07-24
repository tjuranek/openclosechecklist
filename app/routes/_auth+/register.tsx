import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { Button } from "~/components/button";
import { Field, FieldGroup, Fieldset, Label } from "~/components/fieldset";
import { Input } from "~/components/input";
import { z } from "zod";
import { getFormProps, useForm } from "@conform-to/react";
import { Link } from "~/components/link";
import { Text } from "~/components/text";
import { Heading } from "~/components/heading";
import { createUser } from "~/services/users";
import { UniqueConstraintError } from "~/db/errors";
import { sendMagicLinkEmail } from "~/services/email/email.service";
import { createMagicLink } from "~/services/auth/magic-link.service";

const schema = z.object({
	firstName: z.string({ required_error: "First name is required." }),
	lastName: z.string({ required_error: "Last name is required." }),
	email: z.string({ required_error: "Email is required." }),
});

export async function action({ request }: ActionFunctionArgs) {
	const submission = parseWithZod(await request.formData(), { schema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	try {
		const { firstName, lastName, email } = submission.value;
		const user = await createUser(firstName, lastName, email);
		const magicLink = await createMagicLink(user.id);

		await sendMagicLinkEmail(user.email, user.firstName, magicLink);
		return redirect("/login?success=true");
	} catch (error) {
		if (error instanceof UniqueConstraintError) {
			return submission.reply({ fieldErrors: { email: [error.message] } });
		}

		throw error;
	}
}

export default function Register() {
	const lastResult = useActionData<typeof action>();

	const [form, fields] = useForm({
		lastResult,
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
						<div>
							<Heading>Sign up for an account</Heading>

							<Text className="mt-2">
								Already a member?{" "}
								<Link
									className="font-semibold text-indigo-600 hover:text-indigo-500"
									href="/login"
								>
									Sign in
								</Link>
							</Text>
						</div>

						<div className="mt-10">
							<Form method="POST" {...getFormProps(form)}>
								<Fieldset>
									<FieldGroup>
										<div className="grid grid-cols-2 gap-6">
											<Field>
												<Label>First Name</Label>
												<Input
													type="text"
													name="firstName"
													field={fields.firstName}
												/>
											</Field>

											<Field>
												<Label>Last Name</Label>
												<Input
													type="text"
													name="lastName"
													field={fields.lastName}
												/>
											</Field>
										</div>

										<Field>
											<Label>Email Address</Label>
											<Input type="email" name="email" field={fields.email} />
										</Field>
									</FieldGroup>
								</Fieldset>

								<Button className="mt-8" color="green" type="submit">
									Sign up
								</Button>
							</Form>
						</div>
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
