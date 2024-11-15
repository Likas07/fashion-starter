"use client"

import * as React from "react"
import { UiConfirmButton } from "@/components/Dialog"
import { deleteCustomerAddress } from "@lib/data/customer"

export const DeleteAddressButton: React.FC<{
  addressId: string
  children: React.ReactNode
}> = ({ addressId, children }) => {
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <UiConfirmButton
      onConfirm={async () => {
        setIsLoading(true)
        await deleteCustomerAddress(addressId).catch((error) => {
          console.error(error)
        })
        setIsLoading(false)
      }}
      isLoading={isLoading}
      disabled={isLoading}
    >
      {children}
    </UiConfirmButton>
  )
}
