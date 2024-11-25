// External packages
import { Text, Heading } from '@react-email/components';
import { CustomerDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
};

export default function WelcomeEmail({
  customer,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-10">
        Welcome to Sofa Society!
      </Heading>
      <Text className="text-md !mb-6">
        Welcome to Sofa Society! We're excited to have you join our community of
        comfort enthusiasts. With our carefully crafted sofas, you&apos;re just
        steps away from adding elegance and coziness to your living space.
      </Text>
      <Text className="text-md font-semibold !mb-6">
        As a new member, here&apos;s what you can expect:
      </Text>
      <Text className="text-md m-0">
        Premium, high-quality sofas in a range of styles and materials
      </Text>
      <Text className="text-md m-0">
        Dedicated customer support ready to assist you
      </Text>
      <Text className="text-md m-0">
        Exclusive offers and early access to new collections
      </Text>
      <Text className="text-md !mt-0 mb-6">
        Explore our collections and find the sofa that suits your style!
      </Text>
      <Text className="text-md">
        Best wishes,
        <br />
        The Sofa Society Team
      </Text>
    </EmailLayout>
  );
}

WelcomeEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'example@medusa.local',
    first_name: 'John',
    last_name: 'Doe',
  },
} satisfies Props;
