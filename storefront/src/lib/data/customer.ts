"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidateTag } from "next/cache"

import { sdk } from "@lib/config"
import { getAuthHeaders, removeAuthToken, setAuthToken } from "./cookies"

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
  formData: FormData
): Promise<
  { state: "initial" | "success" } | { state: "error"; error: string }
> {
  const validatedData = updateCustomerFormSchema.parse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phone: formData.get("phone"),
  })

  return sdk.store.customer
    .update(
      {
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        phone: validatedData.phone ?? undefined,
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

export async function signup(_currentState: unknown, formData: FormData) {
  const validatedData = signupFormSchema.parse({
    email: formData.get("email"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  })

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: validatedData.email,
      password: validatedData.password,
    })

    const customHeaders = { authorization: `Bearer ${token}` }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      {
        email: validatedData.email,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        phone: validatedData.phone ?? undefined,
      },
      {},
      customHeaders
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: validatedData.email,
      password: validatedData.password,
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
})

export async function login(_currentState: unknown, formData: FormData) {
  const validatedData = loginFormSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  try {
    const token = await sdk.auth.login("customer", "emailpass", {
      email: validatedData.email,
      password: validatedData.password,
    })

    if (typeof token === "object") {
      redirect(token.location)

      return
    }

    await setAuthToken(token)
    revalidateTag("customer")
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()
  await removeAuthToken()
  revalidateTag("customer")
  redirect(`/${countryCode}/account`)
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
  formData: FormData
) => {
  const validatedData = customerAddressSchema.parse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    company: formData.get("company"),
    address_1: formData.get("address_1"),
    address_2: formData.get("address_2"),
    city: formData.get("city"),
    postal_code: formData.get("postal_code"),
    province: formData.get("province"),
    country_code: formData.get("country_code"),
    phone: formData.get("phone"),
  })

  return sdk.store.customer
    .createAddress(
      {
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        company: validatedData.company ?? undefined,
        address_1: validatedData.address_1,
        address_2: validatedData.address_2 ?? undefined,
        city: validatedData.city,
        postal_code: validatedData.postal_code,
        province: validatedData.province ?? undefined,
        country_code: validatedData.country_code,
        phone: validatedData.phone ?? undefined,
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
  formData: FormData
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

  const validatedData = customerAddressSchema.parse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    company: formData.get("company"),
    address_1: formData.get("address_1"),
    address_2: formData.get("address_2"),
    city: formData.get("city"),
    postal_code: formData.get("postal_code"),
    province: formData.get("province"),
    country_code: formData.get("country_code"),
    phone: formData.get("phone"),
  })

  return sdk.store.customer
    .updateAddress(
      currentState.addressId,
      {
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        company: validatedData.company ?? undefined,
        address_1: validatedData.address_1,
        address_2: validatedData.address_2 ?? undefined,
        city: validatedData.city,
        postal_code: validatedData.postal_code,
        province: validatedData.province ?? undefined,
        country_code: validatedData.country_code,
        phone: validatedData.phone ?? undefined,
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
  formData: FormData
): Promise<
  z.infer<typeof resetPasswordStateSchema> &
    ({ state: "initial" | "success" } | { state: "error"; error: string })
> {
  const validatedState = resetPasswordStateSchema.parse(currentState)

  const validatedData = resetPasswordFormSchema.parse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm_new_password: formData.get("confirm_new_password"),
  })

  if (validatedData.new_password !== validatedData.confirm_new_password) {
    return {
      ...validatedState,
      state: "error" as const,
      error: "Passwords do not match",
    }
  }

  // check current password
  await sdk.auth.login("customer", "emailpass", {
    email: validatedState.email,
    password: validatedData.current_password,
  })

  return sdk.client
    .fetch(`/auth/customer/emailpass/update?token=${validatedState.token}`, {
      method: "POST",
      body: {
        email: validatedState.email,
        password: validatedData.new_password,
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
  formData: FormData
): Promise<
  { state: "initial" | "success" } | { state: "error"; error: string }
> {
  const validatedData = forgotPasswordFormSchema.parse({
    email: formData.get("email"),
  })

  return sdk.auth
    .resetPassword("customer", "emailpass", {
      identifier: validatedData.email,
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
