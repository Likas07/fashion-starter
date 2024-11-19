import * as React from 'react';
import {
  Tailwind,
  Text,
  Container,
  Heading,
  Html,
  Button,
} from '@react-email/components';
import { CustomerDTO, HttpTypes } from '@medusajs/framework/types';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
  token: string;
};

export default function AuthPasswordResetEmail({ customer, token }: Props) {
  return (
    <Html>
      <Tailwind>
        <Container>
          <Heading>Reset your password</Heading>

          <Text>Hi {customer.first_name},</Text>

          <Text>
            We received a request to reset your Sofa Society account password.
            Click below to set a new password:
          </Text>

          <Button
            href={`${process.env.STOREFRONT_URL}/auth/reset-password?token=${token}`}
          >
            Reset password
          </Button>

          <Text>
            If you didn’t request this change, please ignore this email, and
            your current password will remain unchanged.
          </Text>
        </Container>
      </Tailwind>
    </Html>
  );
}

AuthPasswordResetEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'example@medusa.local',
    first_name: 'John',
    last_name: 'Doe',
  },
  token: '1234567789012345677890',
} satisfies Props;
