"use client"

import * as React from "react"

import { login } from "@lib/data/customer"
import { SubmitButton } from "@modules/common/components/submit-button"
import { Input } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"
import { twMerge } from "tailwind-merge"

export const LoginForm: React.FC<{
  className?: string
  countryCode?: string
}> = ({ className, countryCode }) => {
  const [message, formAction] = React.useActionState(login, null)

  return (
    <form
      action={formAction}
      className={twMerge("flex flex-col gap-6 md:gap-8", className)}
    >
      <Input
        placeholder="Email"
        name="email"
        required
        wrapperClassName="flex-1"
        autoComplete="email"
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        required
        wrapperClassName="flex-1"
        autoComplete="current-password"
      />
      <LocalizedLink
        href="/auth/forgot-password"
        variant="underline"
        className="self-start !pb-0 text-grayscale-500 leading-none"
      >
        Forgot password?
      </LocalizedLink>
      {message && <p className="text-red-primary text-sm">{message}</p>}
      <input
        type="hidden"
        name="redirect_url"
        value={`/${countryCode}/account`}
      />
      <SubmitButton>Log in</SubmitButton>
    </form>
  )
}
