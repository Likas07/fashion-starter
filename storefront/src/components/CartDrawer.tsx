"use client"

// External components
import * as React from "react"

// Types
import { HttpTypes } from "@medusajs/types"

// Components
import Item from "@modules/cart/components/item"
import CartTotals from "@modules/cart/components/cart-totals"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import { Drawer } from "@/components/Drawer"
import { Button } from "@/components/Button"
import DiscountCode from "@modules/cart/components/discount-code"

// TODO: move cart loading to client side
export const CartDrawer: React.FC<{
  cart?:
    | (HttpTypes.StoreCart & {
        promotions: HttpTypes.StorePromotion[]
      })
    | null
  children: React.ReactNode
}> = ({ cart, children }) => {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)

  return (
    <>
      <Button
        onPress={() => setIsCartDrawerOpen(true)}
        variant="ghost"
        className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black"
      >
        {children}
      </Button>
      <Drawer
        className="max-w-139 px-4 xs:px-6 sm:px-12 pt-20 md:pt-33"
        closeButtonClassName="top-21 md:top-34"
        colorScheme="light"
        position="right"
        isOpened={isCartDrawerOpen}
        onCloseClick={() => setIsCartDrawerOpen(false)}
        onBackdropClick={() => setIsCartDrawerOpen(false)}
      >
        <p className="text-md mb-10">Cart</p>
        {cart?.items?.length ? (
          <>
            {cart?.items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return <Item key={item.id} item={item} />
              })}
            <div className="sticky left-0 bg-white bottom-0 pt-6 pb-12 border-t border-grayscale-200">
              <CartTotals cart={cart} />
              <DiscountCode cart={cart} />
              <LocalizedButtonLink
                href="/checkout"
                isFullWidth
                className="mt-8"
              >
                Proceed to checkout
              </LocalizedButtonLink>
            </div>
          </>
        ) : (
          <>
            <p className="max-sm:mr-10 mb-6">
              You don&apos;t have anything in your cart. Let&apos;s change that,
              use the link below to start browsing our products.
            </p>
            <div>
              <LocalizedLink
                href="/store"
                onClick={() => {
                  setIsCartDrawerOpen(false)
                }}
              >
                Explore products
              </LocalizedLink>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
