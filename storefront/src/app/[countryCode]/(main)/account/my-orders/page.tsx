import * as React from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { listOrders } from "@lib/data/orders"
import { Pagination } from "@modules/store/components/pagination"
import { ButtonLink } from "@/components/Button"
import { UiTag } from "@/components/ui/Tag"
import { LocalizedLink } from "@/components/LocalizedLink"

const OrderStatus: React.FC<{ order: HttpTypes.StoreOrder }> = ({ order }) => {
  if (order.fulfillment_status === "canceled") {
    return (
      <UiTag iconName="close" isActive className="self-start mt-auto">
        Canceled
      </UiTag>
    )
  }

  if (order.fulfillment_status === "delivered") {
    return (
      <UiTag iconName="check" isActive className="self-start mt-auto">
        Delivered
      </UiTag>
    )
  }

  if (
    order.fulfillment_status === "shipped" ||
    order.fulfillment_status === "partially_delivered"
  ) {
    return (
      <UiTag iconName="truck" isActive className="self-start mt-auto">
        Delivering
      </UiTag>
    )
  }

  return (
    <UiTag iconName="package" isActive className="self-start mt-auto">
      Packing
    </UiTag>
  )
}

type PageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

const ORDERS_PER_PAGE = 6

export default async function AccountMyOrdersPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const pageNumber = page ? parseInt(page, 10) : 1
  const { orders, count } = await listOrders(
    ORDERS_PER_PAGE,
    (pageNumber - 1) * ORDERS_PER_PAGE
  )
  const totalPages = Math.ceil(count / ORDERS_PER_PAGE)

  return (
    <>
      <h1 className="text-lg mb-13">My orders</h1>
      {orders.length > 0 ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xs border border-grayscale-200 flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-8 p-4"
              >
                <div className="flex max-sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-y-6 gap-x-10 justify-between lg:flex-wrap">
                  <div className="flex-shrink-0">
                    <p className="text-md mb-2">
                      <span className="font-semibold">Order:</span>{" "}
                      {order.display_id}
                    </p>
                    <p className="text-grayscale-500">
                      Order date:{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-4 max-lg:overflow-x-auto">
                    {order.items
                      ?.filter((item) => item.thumbnail)
                      .map((item) => (
                        <LocalizedLink
                          key={item.id}
                          href={`/account/my-orders/${order.id}`}
                          className="shrink-0 w-19 aspect-[3/4] rounded-2xs relative overflow-hidden"
                        >
                          <Image
                            src={item.thumbnail!}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </LocalizedLink>
                      ))}
                  </div>
                </div>
                <div className="flex max-sm:flex-col md:flex-col lg:flex-row justify-between gap-6">
                  <OrderStatus order={order} />
                  <ButtonLink
                    href={`/account/my-orders/${order.id}`}
                    variant="outline"
                    size="sm"
                    className="sm:self-end md:self-start lg:self-end"
                  >
                    Check details
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination page={pageNumber} totalPages={totalPages} />
          )}
        </div>
      ) : (
        <p className="text-md mt-16">You haven&apos;t ordered anything yet</p>
      )}
    </>
  )
}
