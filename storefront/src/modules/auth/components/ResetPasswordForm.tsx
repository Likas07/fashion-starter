"use client"

import * as React from "react"
import { redirect } from "next/navigation"

import { resetPassword } from "@lib/data/customer"
import { SubmitButton } from "@modules/common/components/submit-button"
import { Form, InputField } from "@/components/Forms"
import { z } from "zod"

const resetPasswordFormSchema = z
  .object({
    current_password: z.string().min(6),
    new_password: z.string().min(6),
    confirm_new_password: z.string().min(6),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords must match",
    path: ["confirm_new_password"],
  })

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

  const onSubmit = (values: z.infer<typeof resetPasswordFormSchema>) => {
    React.startTransition(() => formAction(values))
  }

  return (
    <Form onSubmit={onSubmit} schema={resetPasswordFormSchema}>
      <h1 className="text-lg mb-6 md:mb-8">Reset password</h1>
      <div className="flex flex-col gap-4 mb-6 md:mb-8">
        <InputField
          type="password"
          placeholder="Current password"
          name="current_password"
          inputProps={{ autoComplete: "current-password" }}
        />
        <InputField
          type="password"
          placeholder="New password"
          name="new_password"
          inputProps={{ autoComplete: "new-password" }}
        />
        <InputField
          type="password"
          placeholder="Confirm new password"
          name="confirm_new_password"
          inputProps={{ autoComplete: "new-password" }}
        />
      </div>
      <SubmitButton isLoading={isPending}>Reset password</SubmitButton>
    </Form>
  )
}
