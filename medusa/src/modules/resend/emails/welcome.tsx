import * as React from 'react';
import {
  Tailwind,
  Text,
  Container,
  Heading,
  Html,
  Button,
} from '@react-email/components';
import { CustomerDTO } from '@medusajs/framework/types';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
};

export default function AuthPasswordResetEmail({ customer }: Props) {
  return (
    <Html>
      <Tailwind>
        <Container>
          <Heading>Welcome to Sofa Society!</Heading>

          <Text>
            Welcome to Sofa Society! We're excited to have you join our
            community of comfort enthusiasts. With our carefully crafted sofas,
            you’re just steps away from adding elegance and coziness to your
            living space.
          </Text>
          <Text className="font-semibold">
            As a new member, here’s what you can expect:
          </Text>
          <Text>
            Premium, high-quality sofas in a range of styles and materials
            Dedicated customer support ready to assist you Exclusive offers and
            early access to new collections Explore our collections and find the
            sofa that suits your style!
          </Text>
          <Text>
            Best wishes,
            <br />
            The Sofa Society Team
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
} satisfies Props;
