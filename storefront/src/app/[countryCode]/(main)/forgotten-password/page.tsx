// External components
import Image from "next/image"

// Components
import { Input } from "@/components/Forms"
import { LocalizedButtonLink } from "@/components/LocalizedLink"

export default function ForgottenPasswordSentPage() {
  return (
    <div className="flex min-h-screen">
      <Image
        src="/images/content/living-room12.png"
        width={1440}
        height={1632}
        alt="Living room"
        className="max-lg:hidden lg:w-1/2 shrink-0 object-cover"
      />
      <div className="shrink-0 max-w-100 lg:max-w-96 w-full mx-auto pt-30 lg:pt-37 pb-16 max-sm:px-4">
        <h1 className="text-2xl mb-8">Forgotten password?</h1>
        <div className="mb-8">
          <p>
            Enter your email address below and we will send you instructions on
            how to reset your password.
          </p>
        </div>
        <Input
          placeholder="Email"
          name="email"
          required
          variant="outline"
          wrapperClassName="flex-1 mb-8"
        />
        <LocalizedButtonLink href="/forgotten-password-sent" isFullWidth>
          Reset your password
        </LocalizedButtonLink>
      </div>
    </div>
  )
}
