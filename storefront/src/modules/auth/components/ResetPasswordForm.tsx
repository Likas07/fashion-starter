"use client"

import * as React from "react"
import { redirect } from "next/navigation"

import { resetPassword } from "@lib/data/customer"
import { SubmitButton } from "@modules/common/components/submit-button"
import { Input } from "@/components/Forms"

export const ChangePasswordForm: React.FC<{ email: string; token: string }> = ({
  email,
  token,
}) => {
  const [formState, formAction, isPending] = React.useActionState(
    resetPassword,
    { email, token, state: "initial" }
  )

  React.useEffect(() => {
    if (formState.state === "success") {
      redirect("/auth/login")
    }
  }, [formState])

  return (
    <form action={formAction}>
      <h1 className="text-lg mb-6 md:mb-8">Reset password</h1>
      <div className="flex flex-col gap-4 mb-6 md:mb-8">
        <Input
          type="password"
          placeholder="Current password"
          required
          variant="outline"
          name="current_password"
          autoComplete="current-password"
          minLength={6}
        />
        <Input
          type="password"
          placeholder="New password"
          required
          variant="outline"
          name="new_password"
          autoComplete="new-password"
          minLength={6}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          required
          variant="outline"
          name="confirm_new_password"
          autoComplete="new-password"
          minLength={6}
        />
      </div>
      {formState.state === "error" && (
        <div className="text-sm text-red-primary">{formState.error}</div>
      )}
      <SubmitButton isLoading={isPending} isDisabled={isPending}>
        Reset password
      </SubmitButton>
    </form>
  )
}
