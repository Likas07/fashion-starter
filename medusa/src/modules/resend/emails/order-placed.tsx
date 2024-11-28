// External packages
import {
  Text,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Link,
} from '@react-email/components';
import { HttpTypes } from '@medusajs/framework/types';
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

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

export default function OrderPlacedEmail({
  order,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    currency: order.currency_code,
  });

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-10">Order confirmation</Heading>
      <Text className="text-md !mb-6">
        We are pleased to confirm that your order has been successfully placed
        and will be processed shortly. Your order number is #100002.
      </Text>
      <Text className="text-md !mb-6">
        You&apos;ll receive another update once your order is shipped. For any
        questions, feel free to contact us at info@sofasociety.com.
      </Text>
      <Text className="text-md !mb-20">Thank you for shopping with us!</Text>
      <Section className="mb-6">
        <Row>
          <Column className="border border-solid p-4 border-grayscale-200 rounded-xs">
            <Text className="text-grayscale-500 !mt-0 !mb-8">
              Delivery Address
            </Text>
            <Text className="m-0 leading-tight">
              {[
                order.shipping_address.first_name,
                order.shipping_address.last_name,
              ]
                .filter(Boolean)
                .join(' ')}
            </Text>
            <Text className="m-0 leading-tight">
              {[
                order.shipping_address.address_1,
                order.shipping_address.address_2,
                [
                  order.shipping_address.postal_code,
                  order.shipping_address.city,
                ]
                  .filter(Boolean)
                  .join(' '),
                order.shipping_address.province,
                order.shipping_address.country.display_name,
              ]
                .filter(Boolean)
                .join(', ')}
            </Text>
            {order.shipping_address.phone && (
              <Text className="m-0 leading-tight">
                {order.shipping_address.phone}
              </Text>
            )}
          </Column>
          <Column className="w-8" />
          <Column className="border border-solid p-4 border-grayscale-200 rounded-xs">
            <Text className="text-grayscale-500 !mt-0 !mb-8">
              Billing Address
            </Text>
            <Text className="m-0 leading-tight">
              {[
                order.billing_address.first_name,
                order.billing_address.last_name,
              ]
                .filter(Boolean)
                .join(' ')}
            </Text>
            <Text className="m-0 leading-tight">
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
              <Text className="m-0 leading-tight">
                {order.billing_address.phone}
              </Text>
            )}
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-grayscale-200 rounded-xs px-4 mb-6">
        {order.items.map((item) => {
          return (
            <Row className="py-4 [&:not(:first-child)]:border [&:not(:first-child)]:border-solid [&:not(:first-child)]:border-grayscale-100">
              <Column>
                <Link href="/">
                  <Img
                    src={item.thumbnail}
                    alt={item.product_title}
                    className="aspect-[3/4] object-cover max-w-37 float-left"
                  />
                </Link>
              </Column>
              <Column className="w-full pl-8 relative" valign="top">
                <Text className="text-md !mt-0 !mb-2">
                  {item.product_title}
                </Text>
                {Object.entries(item.variant_option_values).flatMap(
                  ([key, value]) =>
                    typeof value === 'string' ? (
                      <Section key={key} className="mb-1">
                        <Row>
                          <Column className="flex gap-2">
                            <Text className="text-grayscale-500 m-0 text-xs">
                              {key}:
                            </Text>
                            <Text className="m-0 text-xs">{value}</Text>
                          </Column>
                        </Row>
                      </Section>
                    ) : (
                      []
                    )
                )}
                <Section className="absolute bottom-0">
                  <Row>
                    <Column className="flex gap-2">
                      <Text className="text-grayscale-500 m-0 text-xs">
                        Quantity:{' '}
                      </Text>
                      <Text className="m-0 text-xs">{item.quantity}</Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
              <Column valign="bottom">
                <Text className="m-0 text-md">
                  {formatter.format(item.total)}
                </Text>
              </Column>
            </Row>
          );
        })}
      </Section>
      <Section className="border border-solid border-grayscale-200 rounded-xs p-4">
        <Row>
          <Column className="w-1/2 flex gap-2 items-center" valign="top">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none">
              <path
                stroke="#050505"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width=".667"
                d="M2.665 3.5c-.644 0-1.166.522-1.166 1.167v1.166h-.167a.837.837 0 0 0-.167.017V4.667a1.5 1.5 0 0 1 1.5-1.5h10.667a1.5 1.5 0 0 1 1.5 1.5V5.85a.837.837 0 0 0-.167-.017H14.5V4.667c0-.645-.523-1.167-1.167-1.167H2.665Zm-1.333 3h.167v.333h-.167a.167.167 0 1 1 0-.333Zm.833.333V6.5h11.667v.333H2.165Zm-.833.667h.167v3.833c0 .645.522 1.167 1.166 1.167h10.667c.644 0 1.167-.522 1.167-1.167V7.5h.166a.837.837 0 0 0 .167-.017v3.85a1.5 1.5 0 0 1-1.5 1.5H2.665a1.5 1.5 0 0 1-1.5-1.5v-3.85c.054.011.11.017.167.017Zm13.333-.667H14.5V6.5h.166a.167.167 0 0 1 0 .333Z"
              />
            </svg>
            <Text className="m-0">Payment</Text>
          </Column>
          <Column className="w-1/2">
            <Section>
              <Row className="mb-2">
                <Column className="flex justify-between">
                  <Text className="text-grayscale-500 m-0 text-base">
                    Subtotal
                  </Text>
                  <Text className="m-0 text-base">
                    {formatter.format(order.subtotal)}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-6">
                <Column className="flex justify-between">
                  <Text className="text-grayscale-500 m-0 text-base">
                    Shipping
                  </Text>
                  <Text className="m-0 text-base">
                    {formatter.format(order.shipping_total)}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="flex justify-between">
                  <Text className="m-0 text-md">Total</Text>
                  <Text className="m-0 text-md">
                    {formatter.format(order.total)}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="flex gap-1">
                  <Text className="text-grayscale-500 m-0 text-xs">
                    Including
                  </Text>
                  <Text className="m-0 text-xs text-grayscale-500">
                    {formatter.format(order.tax_total)} tax
                  </Text>
                </Column>
              </Row>
            </Section>
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
