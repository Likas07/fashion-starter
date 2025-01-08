"use client"

import * as React from "react"

import { login } from "@lib/data/customer"
import { SubmitButton } from "@modules/common/components/submit-button"
import { Input } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"

export const LoginForm: React.FC = () => {
  const [message, formAction] = React.useActionState(login, null)

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <Input
        placeholder="Email"
        name="email"
        required
        variant="outline"
        wrapperClassName="flex-1"
        autoComplete="email"
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        required
        variant="outline"
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
      <SubmitButton>Log in</SubmitButton>
    </form>
  )
}
