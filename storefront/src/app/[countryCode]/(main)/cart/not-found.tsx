import { Metadata } from "next"

import { LocalizedLink } from "@/components/LocalizedLink"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-fg-base dark:text-fg-base-dark">
        Page not found
      </h1>
      <p className="text-small-regular text-fg-base dark:text-fg-base-dark">
        The cart you tried to access does not exist. Clear your cookies and try
        again.
      </p>
      <LocalizedLink href="/">Go to frontpage</LocalizedLink>
    </div>
  )
}
