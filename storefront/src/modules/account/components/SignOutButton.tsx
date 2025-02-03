"use client"

import * as React from "react"
import { SubmitButton } from "@modules/common/components/submit-button"
import { signout } from "@lib/data/customer"
import { useCountryCode } from "hooks/country-code"
import { ButtonProps } from "@/components/Button"

export const SignOutButton: React.FC<Omit<ButtonProps, "type">> = ({
  isLoading,
  ...rest
}) => {
  const countryCode = useCountryCode()
  const [_, formAction, isPending] = React.useActionState(
    signout,
    countryCode ?? ""
  )

  return (
    <form action={formAction}>
      <SubmitButton {...rest} isLoading={isPending || isLoading}>
        Log out
      </SubmitButton>
    </form>
  )
}
