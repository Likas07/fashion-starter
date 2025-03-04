import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addCustomerAddress,
  deleteCustomerAddress,
  getCustomer,
  login,
  signout,
  signup,
  updateCustomer,
  updateCustomerAddress,
} from "@lib/data/customer"
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

export const loginFormSchema = z.object({
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

export const updateCustomerFormSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional().nullable(),
})

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: z.infer<typeof updateCustomerFormSchema>) => {
      return updateCustomer(values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}

export const customerAddressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company: z.string().optional().nullable(),
  address_1: z.string().min(1),
  address_2: z.string().optional().nullable(),
  city: z.string().min(1),
  postal_code: z.string().min(1),
  province: z.string().optional().nullable(),
  country_code: z.string().min(2),
  phone: z.string().optional().nullable(),
})

export const useAddressMutation = (addressId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: z.infer<typeof customerAddressSchema>) => {
      return addressId
        ? updateCustomerAddress(addressId, values)
        : addCustomerAddress(values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}

export const useDeleteCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (addressId: string) => {
      return deleteCustomerAddress(addressId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}

export const signupFormSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional().nullable(),
  password: z.string().min(6),
})

export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: z.infer<typeof signupFormSchema>) => {
      return signup(values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}
