"use client"

import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import * as ReactAria from "react-aria-components"
import { Icon } from "@/components/Icon"

export const getFormFieldClassNames = ({
  uiSize = "lg",
  isVisuallyDisabled,
  isSuccess,
  hasError,
}: InputOwnProps): string => {
  const sizeClasses = {
    sm: "h-9 text-xs focus:pt-3.5 [&:not(:placeholder-shown)]:pt-3.5 [&:autofill]:pt-3.5",
    md: "h-12 focus:pt-3 [&:not(:placeholder-shown)]:pt-3 [&:autofill]:pt-3",
    lg: "h-14 focus:pt-4 [&:not(:placeholder-shown)]:pt-4 [&:autofill]:pt-4",
  }

  const visuallyDisabledClasses = isVisuallyDisabled
    ? "pointer-events-none bg-grayscale-50"
    : ""

  const successClasses = isSuccess ? "border-green-500 pr-7" : ""

  const errorClasses = hasError
    ? "border-red-primary focus:border-red-900 hover:border-red-900"
    : ""

  return twJoin(
    "peer block w-full rounded-xs transition-all outline-none px-4 placeholder:invisible border border-grayscale-200 hover:border-grayscale-500 focus:border-grayscale-500 bg-transparent disabled:pointer-events-none disabled:bg-grayscale-50 [&:autofill]:bg-clip-text",
    sizeClasses[uiSize],
    visuallyDisabledClasses,
    successClasses,
    errorClasses
  )
}

export const getPlaceholderClassNames = ({
  uiSize = "lg",
}: Pick<InputOwnProps, "uiSize">): string => {
  const sizeClasses = {
    lg: "peer-focus:top-2.5 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:autofill]:top-2.5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-[:autofill]:text-xs",
    md: "peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 peer-[:autofill]:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-[:autofill]:text-xs",
    sm: "peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 peer-[:autofill]:top-1 text-xs peer-focus:text-2xs peer-[:not(:placeholder-shown)]:text-2xs peer-[:autofill]:text-2xs",
  }

  return twJoin(
    "absolute -translate-y-1/2 peer-placeholder-shown:top-1/2 left-4 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:autofill]:translate-y-0 peer-focus:translate-y-0 text-grayscale-500 pointer-events-none transition-all",
    sizeClasses[uiSize]
  )
}

/**
 * Label
 */
type InputLabelOwnProps = {
  isRequired?: boolean
}

export const InputLabel: React.FC<
  React.ComponentPropsWithRef<"label"> & InputLabelOwnProps
> = ({ isRequired, children, className, ...rest }) => (
  <ReactAria.Label
    {...rest}
    className={twMerge("mb-1 block font-semibold", className)}
  >
    {children}
    {isRequired && <span className="ml-0.5 text-orange-700">*</span>}
  </ReactAria.Label>
)

/**
 * SubLabel
 */
type InputSubLabelOwnProps = {
  type: "success" | "error"
}

export const InputSubLabel: React.FC<
  React.ComponentPropsWithRef<"p"> & InputSubLabelOwnProps
> = ({ type, children, className, ...rest }) => (
  <ReactAria.Text
    {...rest}
    className={twMerge(
      "mt-2 text-xs",
      type === "success" && "text-green-700",
      type === "error" && "text-red-primary",
      className
    )}
  >
    {children}
  </ReactAria.Text>
)

/**
 * Input
 */
export type InputOwnProps = {
  uiSize?: "sm" | "md" | "lg"
  isVisuallyDisabled?: boolean
  isSuccess?: boolean
  hasError?: boolean
  errorMessage?: string
  wrapperClassName?: string
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & InputOwnProps
>(
  (
    {
      uiSize = "lg",
      isVisuallyDisabled,
      isSuccess,
      hasError,
      errorMessage,
      wrapperClassName,
      placeholder,
      className,
      ...rest
    },
    ref
  ) => (
    <div className={twMerge("relative", wrapperClassName)}>
      <ReactAria.Input
        {...rest}
        ref={ref}
        className={twMerge(
          getFormFieldClassNames({
            uiSize,
            isVisuallyDisabled,
            isSuccess,
            hasError,
          }),
          className
        )}
        placeholder={placeholder}
      />
      {placeholder && (
        <span className={getPlaceholderClassNames({ uiSize })}>
          {placeholder}
        </span>
      )}
      {isSuccess && (
        <Icon
          name="check"
          className="absolute right-0 top-1/2 mr-4 -translate-y-1/2 text-green-500 w-6 h-auto"
        />
      )}
      {hasError && errorMessage && (
        <InputSubLabel type="error">{errorMessage}</InputSubLabel>
      )}
    </div>
  )
)

Input.displayName = "Input"
