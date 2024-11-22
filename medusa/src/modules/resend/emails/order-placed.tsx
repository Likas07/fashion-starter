import * as React from 'react';
import {
  Text,
  Column,
  Heading,
  Img,
  Row,
  Section,
} from '@react-email/components';
import { HttpTypes } from '@medusajs/framework/types';
import EmailLayout from './components/EmailLayout';

type Props = {
  order: Pick<
    HttpTypes.AdminOrder,
    | 'currency_code'
    | 'email'
    | 'shipping_address'
    | 'billing_address'
    | 'shipping_total'
    | 'subtotal'
    | 'total'
    | 'tax_total'
  > & {
    items: Pick<
      HttpTypes.AdminOrder['items'][number],
      | 'id'
      | 'thumbnail'
      | 'product_title'
      | 'variant_title'
      | 'total'
      | 'quantity'
      | 'variant_option_values'
    >[];
  };
};

export default function OrderPlacedEmail({ order }: Props) {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    currency: order.currency_code,
  });

  return (
    <EmailLayout>
      <Heading>Thank you for your order</Heading>
      <Text>
        We are pleased to confirm that your order has been successfully placed
        and will be processed shortly. Your order number is #100002.
      </Text>
      <Text>
        You’ll receive another update once your order is shipped. For any
        questions, feel free to contact us at info@sofasociety.com.
      </Text>
      <Text>Thank you for shopping with us!</Text>
      <Row>
        <Column>
          <Text>Delivery Address</Text>
          <Text>
            {[
              order.shipping_address.first_name,
              order.shipping_address.last_name,
            ]
              .filter(Boolean)
              .join(' ')}
          </Text>
          <Text>
            {[
              order.shipping_address.address_1,
              order.shipping_address.address_2,
              [order.shipping_address.postal_code, order.shipping_address.city]
                .filter(Boolean)
                .join(' '),
              order.shipping_address.province,
              order.shipping_address.country.display_name,
            ]
              .filter(Boolean)
              .join(', ')}
          </Text>
          {order.shipping_address.phone && (
            <Text>{order.shipping_address.phone}</Text>
          )}
        </Column>
        <Column>
          <Text>Billing Address</Text>
          <Text>
            {[order.billing_address.first_name, order.billing_address.last_name]
              .filter(Boolean)
              .join(' ')}
          </Text>
          <Text>
            {[
              order.billing_address.address_1,
              order.billing_address.address_2,
              [order.billing_address.postal_code, order.billing_address.city]
                .filter(Boolean)
                .join(' '),
              order.billing_address.province,
              order.billing_address.country.display_name,
            ]
              .filter(Boolean)
              .join(', ')}
          </Text>
          {order.billing_address.phone && (
            <Text>{order.billing_address.phone}</Text>
          )}
        </Column>
      </Row>

      {order.items.map((item) => {
        return (
          <Section
            key={item.id}
            style={{ paddingTop: '40px', paddingBottom: '40px' }}
          >
            <Row>
              <Column>
                <Img
                  src={item.thumbnail}
                  alt={item.product_title}
                  style={{ float: 'left' }}
                  width="260px"
                />
              </Column>
              <Column style={{ verticalAlign: 'top', paddingLeft: '12px' }}>
                <Text style={{ fontWeight: '600' }}>{item.product_title}</Text>
                {Object.entries(item.variant_option_values).flatMap(
                  ([key, value]) =>
                    typeof value === 'string' ? (
                      <Text key={key}>
                        {key}: {value}
                      </Text>
                    ) : (
                      []
                    ),
                )}
                <Text>Quantity: {item.quantity}</Text>
              </Column>
              <Column
                style={{
                  verticalAlign: 'bottom',
                  paddingLeft: '12px',
                  textAlign: 'right',
                }}
              >
                <Text>{formatter.format(item.total)}</Text>
              </Column>
            </Row>
          </Section>
        );
      })}

      <Section>
        <Row>
          <Column className="w-1/2">
            <Text>Payment</Text>
          </Column>
          <Column className="w-1/2">
            <Text>Subtotal {formatter.format(order.subtotal)}</Text>
            <Text>Shipping {formatter.format(order.shipping_total)}</Text>
            <Text>Total {formatter.format(order.total)}</Text>
            <Text>Including {formatter.format(order.tax_total)} tax</Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
}

OrderPlacedEmail.PreviewProps = {
  order: {
    currency_code: 'EUR',
    email: 'example@medusa.local',
    shipping_address: {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      address_1: '1234 Main St',
      address_2: 'Apt 1',
      city: 'Los Angeles',
      postal_code: '90001',
      country: {
        id: '1',
        iso_2: 'US',
        iso_3: 'USA',
        name: 'United States',
        num_code: '840',
        display_name: 'United States',
      },
      phone: '+1 123 456 7890',
      province: 'California',
      created_at: '2021-01-01T12:00:00Z',
      updated_at: '2021-01-01T12:00:00Z',
      metadata: {},
    },
    billing_address: {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      address_1: '1234 Main St',
      address_2: 'Apt 1',
      city: 'Los Angeles',
      postal_code: '90001',
      country: {
        id: '1',
        iso_2: 'US',
        iso_3: 'USA',
        name: 'United States',
        num_code: '840',
        display_name: 'United States',
      },
      phone: '+1 123 456 7890',
      province: 'California',
      created_at: '2021-01-01T12:00:00Z',
      updated_at: '2021-01-01T12:00:00Z',
      metadata: {},
    },
    items: [
      {
        id: '1',
        thumbnail:
          'https://fashion-starter-demo.s3.eu-central-1.amazonaws.com/belime-estate-01JAR3JYD68D1YYR0BN7HHMAZE.png',
        product_title: 'Belime Estate',
        variant_title: 'Linen / Red',
        total: 1500,
        quantity: 1,
        variant_option_values: {
          Material: 'Linen',
          Color: 'Red',
        },
      },
    ],
    shipping_total: 100,
    subtotal: 1400,
    total: 1500,
    tax_total: 100,
  },
} satisfies Props;
