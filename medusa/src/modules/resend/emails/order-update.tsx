import * as React from 'react';
import {
  Tailwind,
  Text,
  Container,
  Heading,
  Html,
  Button,
} from '@react-email/components';
import { CustomerDTO, OrderDTO } from '@medusajs/framework/types';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
  order: Pick<OrderDTO, 'id' | 'display_id'>;
};

export default function AuthPasswordResetEmail({ customer, order }: Props) {
  return (
    <Html>
      <Tailwind>
        <Container>
          <Heading>Shipping update</Heading>

          <Text>
            Great news! Your order #{order.display_id} is now on its way to you.
            Here are the shipping details.
          </Text>
          <Text>You can track your package by clicking below:</Text>
          <Button
            href={`${
              process.env.STOREFRONT_URL || 'http://localhost:8000'
            }/account/my-orders/${order.id}`}
          >
            Order details
          </Button>
          <Text>
            Thank you for choosing Sofa Society. We’re excited for your new sofa
            to find its home with you!
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
  order: {
    id: 'order_01JCNYH6VADAK90W7CBSPV5BT6',
    display_id: 1,
  },
} satisfies Props;
