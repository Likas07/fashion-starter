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
        className="max-w-139 px-4 xs:px-6 sm:px-12 pt-10 flex flex-col"
        closeButtonClassName="top-11.5"
        colorScheme="light"
        position="right"
        isOpened={isCartDrawerOpen}
        onCloseClick={() => setIsCartDrawerOpen(false)}
        onBackdropClick={() => setIsCartDrawerOpen(false)}
      >
        <p className="text-md mb-2">Cart</p>
        {cart?.items?.length ? (
          <>
            <div className="pb-8">
              {cart?.items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      className="last:pb-0 last:border-b-0"
                    />
                  )
                })}
            </div>
            <div className="sticky left-0 bg-white bottom-0 pt-4 pb-6 border-t border-grayscale-200 mt-auto">
              <CartTotals cart={cart} />
              <DiscountCode cart={cart} className="mt-6" />
              <LocalizedButtonLink
                href="/checkout"
                isFullWidth
                className="mt-4"
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
