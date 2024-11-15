"use client"

import * as React from "react"

import { SubmitButton } from "@modules/common/components/submit-button"
import { Input } from "@/components/Forms"
import { signup } from "@lib/data/customer"

export const SignUpForm: React.FC = () => {
  const [message, formAction] = React.useActionState(signup, null)

  return (
    <form action={formAction} className="flex flex-col gap-8 mb-10 md:mb-16">
      <div className="flex gap-6">
        <Input
          placeholder="First name"
          name="first_name"
          required
          variant="outline"
          wrapperClassName="flex-1"
          minLength={1}
        />
        <Input
          placeholder="Last name"
          name="last_name"
          required
          variant="outline"
          wrapperClassName="flex-1"
          minLength={1}
        />
      </div>
      <Input
        placeholder="Email"
        name="email"
        required
        variant="outline"
        wrapperClassName="flex-1"
        type="email"
      />
      <Input
        placeholder="Phone"
        name="phone"
        variant="outline"
        wrapperClassName="flex-1"
        type="tel"
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        required
        variant="outline"
        wrapperClassName="flex-1"
        autoComplete="new-password"
        minLength={6}
      />
      <Input
        placeholder="Confirm password"
        name="confirm_password"
        type="password"
        required
        variant="outline"
        wrapperClassName="flex-1"
        autoComplete="new-password"
        minLength={6}
      />
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <SubmitButton>Register</SubmitButton>
    </form>
  )
}
