"use client"

import * as React from "react"
import { OverlayTriggerStateContext } from "react-aria-components"

import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import CountrySelect, {
  CountrySelectProps,
} from "@modules/checkout/components/country-select"
import { SubmitButton } from "@modules/common/components/submit-button"
import { Input } from "@/components/Forms"
import { UiCloseButton } from "@/components/Dialog"

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
  const { close } = React.useContext(OverlayTriggerStateContext)!

  React.useEffect(() => {
    if (addAddressFormMessage?.success || updateAddressFormMessage?.success) {
      close()
    }
  }, [addAddressFormMessage, updateAddressFormMessage])

  return (
    <form action={addressId ? updateAddressFormAction : addAddressFormAction}>
      <p className="text-md mb-8 md:mb-10">
        {addressId ? "Change address" : "Add another address"}
      </p>
      <div className="flex flex-col gap-4 md:gap-8 mb-8 md:mb-10">
        <div className="flex max-xs:flex-col gap-4 md:gap-6">
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
          placeholder="Company (Optional)"
          name="company"
          variant="outline"
          autoComplete="organization"
          defaultValue={defaultValues?.company}
        />
        <Input
          placeholder="Address"
          name="address_1"
          required
          variant="outline"
          autoComplete="address-line1"
          defaultValue={defaultValues?.address_1}
        />
        <Input
          placeholder="Apartment, suite, etc. (Optional)"
          name="address_2"
          variant="outline"
          autoComplete="address-line2"
          defaultValue={defaultValues?.address_2}
        />
        <Input
          placeholder="Phone (Optional)"
          name="phone"
          variant="outline"
          type="tel"
          autoComplete="tel"
          defaultValue={defaultValues?.phone}
        />
        <div className="flex max-xs:flex-col gap-4 md:gap-6">
          <Input
            placeholder="Postal code"
            name="postal_code"
            required
            variant="outline"
            wrapperClassName="flex-1"
            autoComplete="postal-code"
            defaultValue={defaultValues?.postal_code}
          />
          <Input
            placeholder="City"
            name="city"
            required
            variant="outline"
            wrapperClassName="flex-1"
            defaultValue={defaultValues?.city}
          />
        </div>
        <div className="flex max-xs:flex-col gap-4 md:gap-6">
          <Input
            placeholder="Province (Optional)"
            name="province"
            variant="outline"
            wrapperClassName="flex-1"
            defaultValue={defaultValues?.province}
          />
          <CountrySelect
            region={region ?? undefined}
            defaultSelectedKey={defaultValues?.country_code}
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
          isDisabled={
            isAddAddressFormActionPending || isUpdateAddressFormActionPending
          }
        >
          {addressId ? "Save changes" : "Add address"}
        </SubmitButton>
        <UiCloseButton variant="outline">Cancel</UiCloseButton>
      </div>
    </form>
  )
}
