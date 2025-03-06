import { deleteLineItem, retrieveCart, updateLineItem } from "@lib/data/cart"
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

export const useCart = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await retrieveCart()
      return res
    },
    enabled,
  })
}

export const useUpdateLineItem = (
  options?: UseMutationOptions<
    void,
    Error,
    { lineId: string; quantity: number },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["cart-update-line-item"],
    mutationFn: async (payload: { lineId: string; quantity: number }) => {
      const response = await updateLineItem({
        lineId: payload.lineId,
        quantity: payload.quantity,
      })
      return response
    },
    onSuccess: async function (...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useDeleteLineItem = (
  options?: UseMutationOptions<void, Error, { lineId: string }, unknown>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["cart-delete-line-item"],
    mutationFn: async (payload: { lineId: string }) => {
      const response = await deleteLineItem(payload.lineId)

      return response
    },
    onSuccess: async function (...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}
