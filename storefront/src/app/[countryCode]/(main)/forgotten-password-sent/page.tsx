// External components
import Image from "next/image"

// Components
import { LocalizedButtonLink } from "@/components/LocalizedLink"

export default function ForgottenPasswordPage() {
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
        <h1 className="text-2xl mb-8">Your password is waiting for you!</h1>
        <div className="mb-8">
          <p>
            We&apos;ve sent you an email with further instructions on retrieving
            your account.
          </p>
        </div>
        <LocalizedButtonLink href="/" isFullWidth>
          Back to home page
        </LocalizedButtonLink>
      </div>
    </div>
  )
}
