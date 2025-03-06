import { retrieveCart } from "@lib/data/cart"
import { useQuery } from "@tanstack/react-query"

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
