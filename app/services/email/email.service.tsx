import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "~/constants/env";
import { MagicLinkEmail } from "./templates/MagicLinkEmail";

export class EmailService {
  private static resend = new Resend(env.RESEND_API_KEY);

  private static async send(email: { subject: string, html: string, to: string }) {
    return await this.resend.emails.send({
      from: 'noreply@kruxlab.com',
      ...email
    });
  }

  public static async sendMagicLinkEmail(email: string, firstName: string, magicLink: string) {
    return await this.send({
      to: email,
      subject: "Login to OpenCloseChecklist.com",
      html: render(
        <MagicLinkEmail firstName={firstName} magicLink={magicLink} />
      )
    });
  }
}
