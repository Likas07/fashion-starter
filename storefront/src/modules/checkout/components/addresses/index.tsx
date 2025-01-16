"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { HttpTypes } from "@medusajs/types"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { SubmitButton } from "@modules/common/components/submit-button"
import BillingAddress from "@modules/checkout/components/billing_address"
import ErrorMessage from "@modules/checkout/components/error-message"
import ShippingAddress from "@modules/checkout/components/shipping-address"
import { Button } from "@/components/Button"
import { UiDialogTrigger, UiDialog, UiCloseButton } from "@/components/Dialog"
import { UiModalOverlay, UiModal } from "@/components/ui/Modal"
import { RadioGroup } from "react-aria-components"
import { UiRadio, UiRadioBox, UiRadioLabel } from "@/components/ui/Radio"
import CountrySelect from "../country-select"
import { Input } from "@/components/Forms"
import { Icon } from "@/components/Icon"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const [sameAsBilling, setSameAsBilling] = React.useState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const toggleSameAsBilling = React.useCallback(() => {
    setSameAsBilling((prev) => !prev)
  }, [setSameAsBilling])

  const [message, formAction] = React.useActionState(setAddresses, null)

  return (
    <>
      <div className="flex justify-between mb-6 md:mb-8 border-t border-grayscale-200 pt-8 mt-8">
        <div>
          <p
            className={twJoin(
              "transition-fontWeight duration-75",
              isOpen && "font-semibold"
            )}
          >
            2. Delivery details
          </p>
        </div>
        {!isOpen && cart?.shipping_address && (
          <Button
            variant="link"
            onPress={() => {
              router.push(pathname + "?step=delivery")
            }}
          >
            Change
          </Button>
        )}
      </div>
      {isOpen ? (
        // TODO: replace with react-hook-form and add validation
        <form action={formAction}>
          {customer && (
            <div className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-8 max-lg:flex-col mb-8">
              <div className="flex flex-1 gap-8">
                <Icon name="user" className="w-6 h-6 mt-2.5" />
                <div className="flex flex-col gap-8 flex-1">
                  <div className="flex flex-wrap justify-between gap-6">
                    <div className="grow basis-0">
                      <p className="text-xs text-grayscale-500 mb-1.5">
                        Country
                      </p>
                      <p>Croatia</p>
                    </div>
                    <div className="grow basis-0">
                      <p className="text-xs text-grayscale-500 mb-1.5">
                        Address
                      </p>
                      <p>Duvanjska 3</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-grayscale-500 mb-1.5">
                      Apartment, suite, etc. (Optional)
                    </p>
                    <p>2nd floor</p>
                  </div>
                  <div className="flex flex-wrap justify-between gap-6">
                    <div className="grow basis-0">
                      <p className="text-xs text-grayscale-500 mb-1.5">
                        Postal Code
                      </p>
                      <p>10000</p>
                    </div>
                    <div className="grow basis-0">
                      <p className="text-xs text-grayscale-500 mb-1.5">City</p>
                      <p>Zagreb</p>
                    </div>
                  </div>
                </div>
              </div>
              <UiDialogTrigger>
                <Button variant="outline" size="sm" className="shrink-0">
                  Change
                </Button>
                <UiModalOverlay>
                  <UiModal>
                    <UiDialog>
                      <p className="text-md mb-10">Change address</p>
                      <RadioGroup
                        className="flex flex-col gap-4 mb-10"
                        aria-label="Shipping methods"
                      >
                        <UiRadio
                          variant="outline"
                          value="home"
                          className="gap-4"
                        >
                          <UiRadioBox />
                          <UiRadioLabel className="group-data-[selected=true]:font-normal">
                            Home
                          </UiRadioLabel>
                          <UiRadioLabel className="ml-auto text-grayscale-500 group-data-[selected=true]:font-normal">
                            Duvanjska 3, Zagreb, 10000, Croatia
                          </UiRadioLabel>
                        </UiRadio>
                        <UiRadio
                          variant="outline"
                          value="address2"
                          className="gap-4"
                        >
                          <UiRadioBox />
                          <UiRadioLabel className="group-data-[selected=true]:font-normal">
                            Address 2
                          </UiRadioLabel>
                          <UiRadioLabel className="ml-auto text-grayscale-500 group-data-[selected=true]:font-normal">
                            Duvanjska 3, Zagreb, 10000, Croatia
                          </UiRadioLabel>
                        </UiRadio>
                        <UiRadio
                          variant="outline"
                          value="work"
                          className="gap-4"
                        >
                          <UiRadioBox />
                          <UiRadioLabel className="group-data-[selected=true]:font-normal">
                            Work
                          </UiRadioLabel>
                          <UiRadioLabel className="ml-auto text-grayscale-500 group-data-[selected=true]:font-normal">
                            Duvanjska 3, Zagreb, 10000, Croatia
                          </UiRadioLabel>
                        </UiRadio>
                      </RadioGroup>
                      <div className="flex justify-between">
                        <UiDialogTrigger>
                          <Button>Add new address</Button>
                          <UiModalOverlay>
                            <UiModal>
                              <UiDialog>
                                <p className="text-md mb-8 md:mb-10">
                                  Add new address
                                </p>
                                <div className="flex flex-col gap-4 md:gap-8 mb-8 md:mb-10">
                                  <CountrySelect />
                                  <Input
                                    placeholder="Adress"
                                    required
                                    variant="outline"
                                  />
                                  <Input
                                    placeholder="Apartment, suite, etc. (Optional)"
                                    required
                                    variant="outline"
                                  />
                                  <div className="flex max-xs:flex-col gap-4 md:gap-6">
                                    <Input
                                      placeholder="Postal code"
                                      required
                                      variant="outline"
                                      wrapperClassName="flex-1"
                                    />
                                    <Input
                                      placeholder="City"
                                      required
                                      variant="outline"
                                      wrapperClassName="flex-1"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-6 justify-between">
                                  <Button>Add address</Button>
                                  <UiCloseButton variant="outline">
                                    Cancel
                                  </UiCloseButton>
                                </div>
                              </UiDialog>
                            </UiModal>
                          </UiModalOverlay>
                        </UiDialogTrigger>
                        <UiCloseButton variant="outline">Cancel</UiCloseButton>
                      </div>
                    </UiDialog>
                  </UiModal>
                </UiModalOverlay>
              </UiDialogTrigger>
            </div>
          )}

          <ShippingAddress
            customer={customer}
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />

          {!sameAsBilling && <BillingAddress cart={cart} />}

          <SubmitButton className="mt-8">Next</SubmitButton>
          <ErrorMessage error={message} />
        </form>
      ) : cart?.shipping_address ? (
        <div className="flex flex-col gap-4">
          <div className="flex max-sm:flex-col flex-wrap gap-y-2 gap-x-12">
            <div className="text-grayscale-500">Shipping address</div>
            <div className="text-grayscale-600">
              {[
                cart.shipping_address.first_name,
                cart.shipping_address.last_name,
              ]
                .filter(Boolean)
                .join(" ")}
              <br />
              {[
                cart.shipping_address.address_1,
                cart.shipping_address.address_2,
              ]
                .filter(Boolean)
                .join(" ")}
              <br />
              {[cart.shipping_address.postal_code, cart.shipping_address.city]
                .filter(Boolean)
                .join(" ")}
              <br />
              {cart.shipping_address.country_code?.toUpperCase()}
              <br />
              {cart.shipping_address.phone}
            </div>
          </div>
          {sameAsBilling || cart.billing_address ? (
            <div className="flex max-sm:flex-col flex-wrap gap-y-2 gap-x-17">
              <div className="text-grayscale-500">Billing address</div>
              <div className="text-grayscale-600">
                {sameAsBilling ? (
                  "Same as shipping address"
                ) : (
                  <>
                    {[
                      cart.billing_address?.first_name,
                      cart.billing_address?.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    <br />
                    {[
                      cart.billing_address?.address_1,
                      cart.billing_address?.address_2,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    <br />
                    {[
                      cart.billing_address?.postal_code,
                      cart.billing_address?.city,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    <br />
                    {cart.billing_address?.country_code?.toUpperCase()}
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export default Addresses
