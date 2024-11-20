import Image from "next/image"
import { ForgotPasswordForm } from "@modules/auth/components/ForgotPasswordForm"

export default function ForgotPasswordPage() {
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
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
