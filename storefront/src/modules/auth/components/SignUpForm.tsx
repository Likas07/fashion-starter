"use client"

import * as React from "react"

import { SubmitButton } from "@modules/common/components/submit-button"
import { Input } from "@/components/Forms"
import { signup } from "@lib/data/customer"

export const SignUpForm: React.FC = () => {
  const [message, formAction] = React.useActionState(signup, null)

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-16"
    >
      <div className="flex gap-4 md:gap-6">
        <Input
          placeholder="First name"
          name="first_name"
          required
          wrapperClassName="flex-1"
          minLength={1}
        />
        <Input
          placeholder="Last name"
          name="last_name"
          required
          wrapperClassName="flex-1"
          minLength={1}
        />
      </div>
      <Input
        placeholder="Email"
        name="email"
        required
        wrapperClassName="flex-1"
        type="email"
      />
      <Input
        placeholder="Phone"
        name="phone"
        wrapperClassName="flex-1"
        type="tel"
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        required
        wrapperClassName="flex-1"
        autoComplete="new-password"
        minLength={6}
      />
      <Input
        placeholder="Confirm password"
        name="confirm_password"
        type="password"
        required
        wrapperClassName="flex-1"
        autoComplete="new-password"
        minLength={6}
      />
      {message && <p className="text-red-primary text-sm">{message}</p>}
      <SubmitButton>Register</SubmitButton>
    </form>
  )
}
