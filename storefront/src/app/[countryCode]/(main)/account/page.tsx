import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { getRegion, listRegions } from "@lib/data/regions"
import { AddressForm } from "@modules/account/components/AddressForm"
import { DeleteAddressButton } from "@modules/account/components/DeleteAddressButton"
import { PersonalInfoForm } from "@modules/account/components/PersonalInfoForm"
import { SignOutButton } from "@modules/account/components/SignOutButton"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { UiDialog, UiDialogTrigger, UiCloseButton } from "@/components/Dialog"
import { RequestPasswordResetButton } from "@modules/account/components/RequestPasswordResetButton"

export default async function AccountPersonalAndSecurityPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect(`/${countryCode}/auth/login`)
  }

  const [region, regions] = await Promise.all([
    getRegion(countryCode),
    listRegions(),
  ])
  const countries = regions.flatMap((region) => region.countries ?? [])

  return (
    <>
      <h1 className="text-lg mb-8 md:mb-16">Personal &amp; security</h1>
      <h2 className="text-md font-normal mb-6">Personal information</h2>
      <div className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-8 max-lg:flex-col lg:items-center mb-16">
        <div className="flex gap-8 flex-1">
          <Icon name="user" className="w-6 h-6 mt-2.5" />
          <div className="flex max-sm:flex-col sm:flex-wrap gap-6 sm:gap-x-16">
            <div>
              <p className="text-xs text-grayscale-500 mb-1.5">Name</p>
              <p>
                {[customer.first_name, customer.last_name]
                  .filter(Boolean)
                  .join(" ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-grayscale-500 mb-1.5">Number</p>
              <p>{customer.phone || "-"}</p>
            </div>
          </div>
        </div>
        <UiDialogTrigger>
          <Button variant="outline">Change</Button>
          <UiModalOverlay>
            <UiModal>
              <UiDialog>
                <PersonalInfoForm
                  defaultValues={{
                    first_name: customer.first_name ?? "",
                    last_name: customer.last_name ?? "",
                    phone: customer.phone ?? undefined,
                  }}
                />
              </UiDialog>
            </UiModal>
          </UiModalOverlay>
        </UiDialogTrigger>
      </div>
      <h2 className="text-md font-normal mb-6">Contact</h2>
      <div className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-y-6 gap-x-8 items-center mb-4">
        <Icon name="user" className="w-6 h-6" />
        <div>
          <p className="text-xs text-grayscale-500 mb-1.5">Email</p>
          <p>{customer.email}</p>
        </div>
      </div>
      <p className="text-xs text-grayscale-500 mb-16">
        If you want to change your email please contact us via customer support.
      </p>
      <h2 className="text-md font-normal mb-6">Addresses</h2>
      {customer.addresses.length === 0 && (
        <p className="text-grayscale-500 mb-6">
          You don&apos;t have any addresses saved yet.
        </p>
      )}
      {customer.addresses.map((address) => (
        <div
          key={address.id}
          className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-8 max-lg:flex-col mb-6"
        >
          <div className="flex flex-1 gap-8">
            <Icon name="user" className="w-6 h-6 mt-2.5" />
            <div className="flex flex-col gap-8 flex-1">
              <div className="flex flex-wrap justify-between gap-6">
                <div className="grow basis-0">
                  <p className="text-xs text-grayscale-500 mb-1.5">Country</p>
                  <p>
                    {countries.find(
                      (country) => country.iso_2 === address.country_code
                    )?.display_name || address.country_code}
                  </p>
                </div>
                <div className="grow basis-0">
                  <p className="text-xs text-grayscale-500 mb-1.5">Address</p>
                  <p>{address.address_1}</p>
                </div>
              </div>
              {Boolean(address.address_2) && (
                <div>
                  <p className="text-xs text-grayscale-500 mb-1.5">
                    Apartment, suite, etc.
                  </p>
                  <p>{address.address_2}</p>
                </div>
              )}
              <div className="flex flex-wrap justify-between gap-6">
                <div className="grow basis-0">
                  <p className="text-xs text-grayscale-500 mb-1.5">
                    Postal Code
                  </p>
                  <p>{address.postal_code}</p>
                </div>
                <div className="grow basis-0">
                  <p className="text-xs text-grayscale-500 mb-1.5">City</p>
                  <p>{address.city}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <UiDialogTrigger>
              <Button
                iconName="trash"
                size="sm"
                variant="outline"
                className="w-8 px-0 shrink-0"
              />
              <UiModalOverlay>
                <UiModal>
                  <UiDialog className="text-center">
                    <p className="text-md mb-8">
                      Do you want to delete this address?
                    </p>
                    <div className="flex gap-6 justify-center">
                      <DeleteAddressButton addressId={address.id}>
                        Confirm
                      </DeleteAddressButton>
                      <UiCloseButton variant="outline">Cancel</UiCloseButton>
                    </div>
                  </UiDialog>
                </UiModal>
              </UiModalOverlay>
            </UiDialogTrigger>
            <UiDialogTrigger>
              <Button variant="outline" size="sm" className="shrink-0 flex-1">
                Change
              </Button>
              <UiModalOverlay>
                <UiModal>
                  <UiDialog>
                    <AddressForm
                      region={region ?? undefined}
                      addressId={address.id}
                      defaultValues={{
                        first_name: address.first_name ?? "",
                        last_name: address.last_name ?? "",
                        company: address.company ?? "",
                        phone: address.phone ?? "",
                        address_1: address.address_1 ?? "",
                        address_2: address.address_2 ?? "",
                        postal_code: address.postal_code ?? "",
                        city: address.city ?? "",
                        province: address.province ?? "",
                        country_code: address.country_code ?? "",
                      }}
                    />
                  </UiDialog>
                </UiModal>
              </UiModalOverlay>
            </UiDialogTrigger>
          </div>
        </div>
      ))}
      <UiDialogTrigger>
        <Button className="mb-16">Add another address</Button>
        <UiModalOverlay>
          <UiModal>
            <UiDialog>
              <AddressForm
                region={region ?? undefined}
                defaultValues={{
                  country_code: countryCode,
                }}
              />
            </UiDialog>
          </UiModal>
        </UiModalOverlay>
      </UiDialogTrigger>
      <h2 className="text-md font-normal mb-4">Change password</h2>
      <p className="text-grayscale-500 mb-6">
        To change your password, we&apos;ll send you an email. Just click on the
        reset button below.
      </p>
      <RequestPasswordResetButton />
      <div className="mt-16 md:hidden">
        <p className="text-md mb-6">Log out</p>
        <SignOutButton variant="outline" isFullWidth />
      </div>
    </>
  )
}
