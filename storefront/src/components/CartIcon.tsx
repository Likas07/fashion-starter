"use client"
import { Icon, IconProps } from "@/components/Icon"
import { withReactQueryProvider } from "@lib/util/react-query"
import { useCartQuantity } from "hooks/cart"

export const CartIcon = withReactQueryProvider<
  Omit<IconProps, "status" | "name">
>((props) => {
  const { data: quantity } = useCartQuantity()
  return (
    <Icon
      name="case"
      status={quantity && quantity > 0 ? quantity : undefined}
      {...props}
    />
  )
})
