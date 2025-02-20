"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { CountrySelectProps } from "@modules/checkout/components/country-select"
import { SubmitButton } from "@modules/common/components/submit-button"
import { CountrySelectField, Form, InputField } from "@/components/Forms"
import { UiCloseButton } from "@/components/Dialog"
import { z } from "zod"

const customerAddressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company: z.string().optional().nullable(),
  address_1: z.string().min(1),
  address_2: z.string().optional().nullable(),
  city: z.string().min(1),
  postal_code: z.string().min(1),
  province: z.string().optional().nullable(),
  country_code: z.string().min(2),
  phone: z.string().optional().nullable(),
})

export const UpsertAddressForm: React.FC<{
  addressId?: string
  region?: CountrySelectProps["region"]
  defaultValues?: {
    first_name?: string
    last_name?: string
    company?: string
    address_1?: string
    address_2?: string
    city?: string
    postal_code?: string
    province?: string
    country_code?: string
    phone?: string
  }
}> = ({ addressId, region, defaultValues }) => {
  const [
    addAddressFormMessage,
    addAddressFormAction,
    isAddAddressFormActionPending,
  ] = React.useActionState(addCustomerAddress, null)
  const [
    updateAddressFormMessage,
    updateAddressFormAction,
    isUpdateAddressFormActionPending,
  ] = React.useActionState(updateCustomerAddress, {
    addressId: addressId || "",
    success: false,
    error: undefined,
  })
  const { close } = React.useContext(ReactAria.OverlayTriggerStateContext)!

  const onSubmit = (values: z.infer<typeof customerAddressSchema>) => {
    React.startTransition(() => {
      addressId ? updateAddressFormAction(values) : addAddressFormAction(values)
    })
  }

  React.useEffect(() => {
    if (addAddressFormMessage?.success || updateAddressFormMessage?.success) {
      close()
    }
  }, [addAddressFormMessage, updateAddressFormMessage])

  return (
    <Form
      onSubmit={onSubmit}
      schema={customerAddressSchema}
      defaultValues={{
        first_name: defaultValues?.first_name,
        last_name: defaultValues?.last_name,
        company: defaultValues?.company,
        address_1: defaultValues?.address_1,
        address_2: defaultValues?.address_2,
        phone: defaultValues?.phone,
        city: defaultValues?.city,
        postal_code: defaultValues?.postal_code,
        country_code: defaultValues?.country_code,
        province: defaultValues?.province,
      }}
    >
      <p className="text-md mb-8 md:mb-10">
        {addressId ? "Change address" : "Add another address"}
      </p>
      <div className="flex flex-col gap-4 md:gap-8 mb-8 md:mb-10">
        <div className="flex max-xs:flex-col gap-4 md:gap-6">
          <InputField
            placeholder="First name"
            name="first_name"
            className=" flex-1"
            inputProps={{
              autoComplete: "given-name",
            }}
          />
          <InputField
            placeholder="Last name"
            name="last_name"
            className=" flex-1"
            inputProps={{
              autoComplete: "family-name",
            }}
          />
        </div>
        <InputField
          placeholder="Company (Optional)"
          name="company"
          className=" flex-1"
          inputProps={{
            autoComplete: "organization",
          }}
        />
        <InputField
          placeholder="Address"
          name="address_1"
          inputProps={{
            autoComplete: "address-line1",
          }}
        />
        <InputField
          placeholder="Apartment, suite, etc. (Optional)"
          name="address_2"
          inputProps={{
            autoComplete: "address-line2",
          }}
        />
        <InputField
          placeholder="Phone (Optional)"
          name="phone"
          type="tel"
          inputProps={{
            autoComplete: "tel",
          }}
        />
        <div className="flex max-xs:flex-col gap-4 md:gap-6">
          <InputField
            placeholder="Postal code"
            name="postal_code"
            className=" flex-1"
            inputProps={{
              autoComplete: "postal-code",
            }}
          />
          <InputField placeholder="City" name="city" className=" flex-1" />
        </div>
        <div className="flex max-xs:flex-col gap-4 md:gap-6">
          <InputField
            placeholder="Province (Optional)"
            name="province"
            className=" flex-1"
          />
          <CountrySelectField
            selectProps={{
              region: region ?? undefined,
              defaultSelectedKey: defaultValues?.country_code,
            }}
            name="country_code"
            className="flex-1"
          />
        </div>
        {!addressId &&
          addAddressFormMessage &&
          !addAddressFormMessage.success && (
            <p className="text-red-primary">{addAddressFormMessage.error}</p>
          )}
        {addressId &&
          updateAddressFormMessage &&
          !updateAddressFormMessage.success && (
            <p className="text-red-primary">{updateAddressFormMessage.error}</p>
          )}
      </div>
      <div className="flex gap-6 justify-between">
        <SubmitButton
          isLoading={
            isAddAddressFormActionPending || isUpdateAddressFormActionPending
          }
        >
          {addressId ? "Save changes" : "Add address"}
        </SubmitButton>
        <UiCloseButton variant="outline">Cancel</UiCloseButton>
      </div>
    </Form>
  )
}
