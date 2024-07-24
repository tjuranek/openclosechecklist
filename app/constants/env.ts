import { z } from "zod";

const envSchema = z.object({
	BASE_URL: z.string(),
	DATABASE_URL: z.string(),
	RESEND_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
