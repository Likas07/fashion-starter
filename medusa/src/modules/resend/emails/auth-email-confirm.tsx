// External packages
import { Text, Heading, Button } from "@react-email/components";

// Components
import EmailLayout from "./components/EmailLayout";

export default function AuthEmailConfirm() {
  return (
    <EmailLayout>
      <Heading className="text-2xl mt-0 mb-10">Verify your email</Heading>
      <Text className="text-md !mb-6">
        Hey Jovana, thanks for registering for an account on Sofa Society!
      </Text>
      <Text className="text-md !mb-10">
        Before we get started, we just need to confirm that this is you.
        <br /> Click below to verify your email address:
      </Text>
      <Button className="inline-flex items-center focus-visible:outline-none rounded-xs justify-center transition-colors bg-black hover:bg-grayscale-500 text-white h-10 px-6">
        Verify email
      </Button>
    </EmailLayout>
  );
}
