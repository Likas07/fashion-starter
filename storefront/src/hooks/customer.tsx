import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCustomer, login, signout } from "@lib/data/customer"
import { z } from "zod"
import { useRouter } from "next/navigation"

export const useCustomer = () => {
  return useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      const customer = await getCustomer()
      return customer
    },
    staleTime: 5 * 60 * 1000,
  })
}
