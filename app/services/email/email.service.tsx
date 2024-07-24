import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "~/constants/env";
import { MagicLinkEmail } from "./templates/MagicLinkEmail";

const resend = new Resend(env.RESEND_API_KEY);

async function send(email: { subject: string, html: string, to: string }) {
  return await resend.emails.send({
    from: 'noreply@kruxlab.com',
    ...email
  });
}

export async function sendMagicLinkEmail(email: string, firstName: string, magicLink: string) {
  return await send({
    to: email,
    subject: "Login to OpenCloseChecklist.com",
    html: render(
      <MagicLinkEmail firstName={firstName} magicLink={magicLink} />
    )
  });
}