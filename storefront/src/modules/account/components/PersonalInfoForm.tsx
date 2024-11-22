"use client"

import * as React from "react"
import { OverlayTriggerStateContext } from "react-aria-components"

import { UiCloseButton } from "@/components/Dialog"
import { Input } from "@/components/Forms"
import { updateCustomer } from "@lib/data/customer"
import { SubmitButton } from "@modules/common/components/submit-button"

export const PersonalInfoForm: React.FC<{
  defaultValues?: {
    first_name: string
    last_name: string
    phone?: string
  }
}> = ({ defaultValues }) => {
  const [formState, formAction, isPending] = React.useActionState(
    updateCustomer,
    { state: "initial" }
  )
  const { close } = React.useContext(OverlayTriggerStateContext)!

  React.useEffect(() => {
    if (formState.state === "success") {
      close()
    }
  }, [formState, close])

  return (
    <form action={formAction}>
      <p className="text-md mb-8 sm:mb-10">Personal information</p>
      <div className="flex flex-col gap-4 sm:gap-8">
        <div className="flex max-xs:flex-col gap-y-4 gap-x-6">
          <Input
            placeholder="First name"
            name="first_name"
            required
            variant="outline"
            wrapperClassName="flex-1"
            autoComplete="given-name"
            defaultValue={defaultValues?.first_name}
          />
          <Input
            placeholder="Last name"
            name="last_name"
            required
            variant="outline"
            wrapperClassName="flex-1"
            autoComplete="family-name"
            defaultValue={defaultValues?.last_name}
          />
        </div>
        <Input
          placeholder="Phone"
          name="phone"
          required
          variant="outline"
          wrapperClassName="flex-1 mb-8 sm:mb-10"
          type="tel"
          defaultValue={defaultValues?.phone}
        />
        {formState.state === "error" && (
          <div className="text-sm text-red-primary">{formState.error}</div>
        )}
      </div>
      <div className="flex gap-6 justify-between">
        <SubmitButton isLoading={isPending} disabled={isPending}>
          Save changes
        </SubmitButton>
        <UiCloseButton variant="outline">Cancel</UiCloseButton>
      </div>
    </form>
  )
}
