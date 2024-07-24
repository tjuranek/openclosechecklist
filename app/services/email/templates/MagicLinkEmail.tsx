import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  paddingTop: '32px',
  paddingBottom: '32px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  margin: '32px auto',
};

interface MagicLinkEmailProps {
  firstName: string;
  magicLink: string;
}

export function MagicLinkEmail({ firstName, magicLink }: MagicLinkEmailProps) {
  const previewText = `Magic link for ${firstName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {firstName}!</Heading>
          <Text style={text}>
            Click the button below to sign in to your account. This magic link
            will expire in 10 minutes.
          </Text>
          <Link
            href={magicLink}
            style={button}
          >
            Sign In
          </Link>
          <Text style={text}>
            If you didn't request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default function MagicLinkEmailPreview() {
  return <MagicLinkEmail firstName='Thomas' magicLink='https://openclosechecklist.com/magic-link/abc123' />
}




