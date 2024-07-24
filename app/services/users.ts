import { Prisma } from "@prisma/client";
import { prisma } from "~/db/client";
import { UniqueConstraintError } from "~/db/errors";

export async function createUser(
	firstName: string,
	lastName: string,
	email: string,
) {
	try {
		return await prisma.users.create({
			data: {
				firstName,
				lastName,
				email,
			},
		});
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			throw new UniqueConstraintError("A user with that email already exists.");
		}

		throw error;
	}
}

export async function getUserById(id: string) {
	return await prisma.users.findUnique({
		where: { id }
	})
}

export async function getUserByEmail(email: string) {
	return await prisma.users.findUnique({
		where: { email },
	});
}
