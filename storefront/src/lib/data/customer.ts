"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidateTag } from "next/cache"

import { sdk } from "@lib/config"
import {
  getAuthHeaders,
  setAuthToken,
  removeAuthToken,
  getCartId,
} from "@lib/data/cookies"

export const getCustomer = async function () {
  return sdk.store.customer
    .retrieve({}, { next: { tags: ["customer"] }, ...(await getAuthHeaders()) })
    .then(({ customer }) => customer)
    .catch(() => null)
}

const updateCustomerFormSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional().nullable(),
})
export const updateCustomer = async function (
  _currentState: unknown,
  formData: z.infer<typeof updateCustomerFormSchema>
): Promise<
  { state: "initial" | "success" } | { state: "error"; error: string }
> {
  return sdk.store.customer
    .update(
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone ?? undefined,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return {
        state: "success" as const,
      }
    })
    .catch((error) => {
      revalidateTag("customer")
      return {
        state: "error" as const,
        error: "Failed to update customer personal information",
      }
    })
}

const signupFormSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional().nullable(),
  password: z.string().min(6),
})

export async function signup(
  _currentState: unknown,
  formData: z.infer<typeof signupFormSchema>
) {
  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: formData.email,
      password: formData.password,
    })

    const customHeaders = { authorization: `Bearer ${token}` }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone ?? undefined,
      },
      {},
      customHeaders
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: formData.email,
      password: formData.password,
    })

    if (typeof loginToken === "object") {
      redirect(loginToken.location)

      return
    }

    await setAuthToken(loginToken)

    await sdk.client.fetch("/store/custom/customer/send-welcome-email", {
      method: "POST",
      headers: await getAuthHeaders(),
    })

    revalidateTag("customer")
    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirect_url: z.string().optional().nullable(),
})

export async function login(
  _currentState: unknown,
  formData: z.infer<typeof loginFormSchema>
) {
  const redirectUrl = formData.redirect_url

  try {
    const token = await sdk.auth.login("customer", "emailpass", {
      email: formData.email,
      password: formData.password,
    })

    if (typeof token === "object") {
      redirect(token.location)

      return
    }

    await setAuthToken(token)
    revalidateTag("customer")

    const cartId = await getCartId()
    if (cartId) {
      await sdk.store.cart.transferCart(cartId, {}, await getAuthHeaders())
      revalidateTag("cart")
    }
  } catch (error: any) {
    return error.toString()
  }

  redirect(typeof redirectUrl === "string" ? redirectUrl : "/")
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()
  await removeAuthToken()
  revalidateTag("customer")
  return countryCode
}

const customerAddressSchema = z.object({
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

export const addCustomerAddress = async (
  _currentState: unknown,
  formData: z.infer<typeof customerAddressSchema>
) => {
  return sdk.store.customer
    .createAddress(
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        company: formData.company ?? undefined,
        address_1: formData.address_1,
        address_2: formData.address_2 ?? undefined,
        city: formData.city,
        postal_code: formData.postal_code,
        province: formData.province ?? undefined,
        country_code: formData.country_code,
        phone: formData.phone ?? undefined,
      },
      {},
      await getAuthHeaders()
    )
    .then(({ customer }) => {
      revalidateTag("customer")
      return {
        addressId: customer.addresses[customer.addresses.length - 1].id,
        success: true,
        error: null,
      }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { addressId: "", success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: unknown
): Promise<void> => {
  if (typeof addressId !== "string") {
    throw new Error("Invalid input data")
  }

  await sdk.store.customer
    .deleteAddress(addressId, await getAuthHeaders())
    .then(() => {
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
  revalidateTag("customer")
}

export const updateCustomerAddress = async (
  currentState: unknown,
  formData: z.infer<typeof customerAddressSchema>
) => {
  if (
    typeof currentState !== "object" ||
    !currentState ||
    !("addressId" in currentState) ||
    typeof currentState.addressId !== "string"
  ) {
    throw new Error("Invalid input data")
  }

  const addressId = currentState.addressId

  return sdk.store.customer
    .updateAddress(
      currentState.addressId,
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        company: formData.company ?? undefined,
        address_1: formData.address_1,
        address_2: formData.address_2 ?? undefined,
        city: formData.city,
        postal_code: formData.postal_code,
        province: formData.province ?? undefined,
        country_code: formData.country_code,
        phone: formData.phone ?? undefined,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return { addressId, success: true, error: null }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { addressId, success: false, error: err.toString() }
    })
}

export async function requestPasswordReset() {
  const customer = await getCustomer()

  if (!customer) {
    return {
      success: false as const,
      error: "No customer found",
    }
  }

  await sdk.auth.resetPassword("customer", "emailpass", {
    identifier: customer.email,
  })

  return {
    success: true as const,
  }
}

const resetPasswordFormSchema = z.object({
  current_password: z.string().min(6),
  new_password: z.string().min(6),
  confirm_new_password: z.string().min(6),
})

const resetPasswordStateSchema = z.object({
  email: z.string().email(),
  token: z.string(),
})

export async function resetPassword(
  currentState: unknown,
  formData: z.infer<typeof resetPasswordFormSchema>
): Promise<
  z.infer<typeof resetPasswordStateSchema> &
    ({ state: "initial" | "success" } | { state: "error"; error: string })
> {
  const validatedState = resetPasswordStateSchema.parse(currentState)
  try {
    await sdk.auth.login("customer", "emailpass", {
      email: validatedState.email,
      password: formData.current_password,
    })
  } catch (err) {
    return {
      ...validatedState,
      state: "error" as const,
      error: "Wrong password",
    }
  }
  return sdk.client
    .fetch(`/auth/customer/emailpass/update?token=${validatedState.token}`, {
      method: "POST",
      body: {
        email: validatedState.email,
        password: formData.new_password,
      },
    })
    .then(() => {
      return {
        ...validatedState,
        state: "success" as const,
      }
    })
    .catch(() => {
      return {
        ...validatedState,
        state: "error" as const,
        error: "Failed to update password",
      }
    })
}

const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
})

export async function forgotPassword(
  _currentState: unknown,
  formData: z.infer<typeof forgotPasswordFormSchema>
): Promise<
  { state: "initial" | "success" } | { state: "error"; error: string }
> {
  return sdk.auth
    .resetPassword("customer", "emailpass", {
      identifier: formData.email,
    })
    .then(() => {
      return {
        state: "success" as const,
      }
    })
    .catch(() => {
      return {
        state: "error" as const,
        error: "Failed to reset password",
      }
    })
}

export async function updateDefaultShippingAddress(addressId: string) {
  if (!addressId) {
    return { success: false, error: "No address id provided" }
  }

  return sdk.store.customer
    .updateAddress(
      addressId,
      {
        is_default_shipping: true,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return { success: true, error: null }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { success: false, error: err.toString() }
    })
}

export async function updateDefaultBillingAddress(addressId: string) {
  if (!addressId) {
    return { success: false, error: "No address id provided" }
  }

  return sdk.store.customer
    .updateAddress(
      addressId,
      {
        is_default_billing: true,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return { success: true, error: null }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { success: false, error: err.toString() }
    })
}
