"use client"

import * as React from "react"
import { Button } from "@/components/Button"
import { Form, InputField } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"
import { z } from "zod"

const newsletterFormSchema = z.object({
  email: z.string().min(3).email(),
})

export const NewsletterForm: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  return (
    <div className={className}>
      <h2 className="text-md md:text-lg mb-2 md:mb-1">
        Assine nossa newsletter
      </h2>
      {isSubmitted ? (
        <p className="max-md:text-xs">
          Thank you for subscribing to our newsletter!
        </p>
      ) : (
        <>
          <p className="max-md:text-xs mb-4">Lorem ipsum dolor sit amet</p>
          <Form
            onSubmit={() => {
              setIsSubmitted(true)
            }}
            schema={newsletterFormSchema}
          >
            <div className="flex gap-2">
              <InputField
                inputProps={{
                  uiSize: "sm",
                  className: "rounded-xs",
                  autoComplete: "email",
                }}
                name="email"
                type="email"
                placeholder="Seu email"
                className="mb-4 flex-1"
              />
              <Button type="submit" size="sm" className="h-9 text-xs">
                Assine
              </Button>
            </div>
          </Form>
          <p className="text-xs text-grayscale-500">
            By subscribing you agree to with our{" "}
            <LocalizedLink
              href="/privacy-policy"
              variant="underline"
              className="!pb-0"
            >
              Privacy Policy
            </LocalizedLink>{" "}
            and provide consent to receive updates from our company.
          </p>
        </>
      )}
    </div>
  )
}
