"use client"

import * as React from "react"

import { login } from "@lib/data/customer"
import { SubmitButton } from "@modules/common/components/submit-button"
import { Input } from "@/components/Forms"

export const LoginForm: React.FC = () => {
  const [message, formAction] = React.useActionState(login, null)

  return (
    <form action={formAction} className="flex flex-col gap-8 mb-10 md:mb-16">
      <Input
        placeholder="Email"
        name="email"
        required
        variant="outline"
        wrapperClassName="flex-1"
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        required
        variant="outline"
        wrapperClassName="flex-1"
      />
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <SubmitButton>Log in</SubmitButton>
    </form>
  )
}
