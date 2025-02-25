"use client"

import * as React from "react"

import { SubmitButton } from "@modules/common/components/submit-button"
import { Form, InputField } from "@/components/Forms"
import { signup } from "@lib/data/customer"
import { z } from "zod"

const signupFormSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    phone: z.string().optional().nullable(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  })

export const SignUpForm: React.FC = () => {
  const [message, formAction] = React.useActionState(signup, null)
  const onSubmit = (values: z.infer<typeof signupFormSchema>) => {
    React.startTransition(() => formAction(values))
  }

  return (
    <Form onSubmit={onSubmit} schema={signupFormSchema}>
      {({ watch }) => {
        const formData = watch()
        const isDisabled = !Object.values(formData).some((value) => value)

        return (
          <div className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-16">
            <div className="flex gap-4 md:gap-6">
              <InputField
                placeholder="First name"
                name="first_name"
                className=" flex-1"
                inputProps={{ autoComplete: "given-name" }}
              />
              <InputField
                placeholder="Last name"
                name="last_name"
                className=" flex-1"
                inputProps={{ autoComplete: "family-name" }}
              />
            </div>
            <InputField
              placeholder="Email"
              name="email"
              className=" flex-1"
              type="email"
              inputProps={{ autoComplete: "email" }}
            />
            <InputField
              placeholder="Phone"
              name="phone"
              className=" flex-1"
              type="tel"
              inputProps={{ autoComplete: "tel" }}
            />
            <InputField
              placeholder="Password"
              name="password"
              type="password"
              className=" flex-1"
              inputProps={{ autoComplete: "new-password" }}
            />
            <InputField
              placeholder="Confirm password"
              name="confirm_password"
              type="password"
              className=" flex-1"
              inputProps={{ autoComplete: "new-password" }}
            />
            {message && <p className="text-red-primary text-sm">{message}</p>}
            <SubmitButton isDisabled={isDisabled}>Register</SubmitButton>
          </div>
        )
      }}
    </Form>
  )
}
