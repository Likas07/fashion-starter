"use client"

// External packages
import * as React from "react"
import * as AriaCheckbox from "react-aria-components"
import { twMerge } from "tailwind-merge"

// Components
import { UiCheckboxBox, UiCheckboxIcon } from "./ui/Checkbox"

export type CheckboxOwnProps = {
  label: React.ReactNode
  labelProps?: React.ComponentPropsWithoutRef<"p">
}
export type CheckboxProps = AriaCheckbox.CheckboxProps & CheckboxOwnProps

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  labelProps,
  className,
  ...rest
}) => (
  <AriaCheckbox.Checkbox
    {...rest}
    className={twMerge(
      "flex gap-2 items-start group text-grayscale-500 text-xs cursor-pointer",
      className as string
    )}
  >
    <UiCheckboxBox>
      <UiCheckboxIcon />
    </UiCheckboxBox>
    <p {...labelProps}>{label}</p>
  </AriaCheckbox.Checkbox>
)
