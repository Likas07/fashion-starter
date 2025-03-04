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

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirect_url: z.string().optional().nullable(),
})

export const useLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: z.infer<typeof loginFormSchema>) => {
      return login({ ...values })
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["customer"] })
        if (data.redirectUrl) {
          router.push(data.redirectUrl)
        }
      }
    },
  })
}

export const useSignout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (countryCode: string) => {
      return signout(countryCode)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}
