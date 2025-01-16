"use client"

// External packages
import * as React from "react"
import { twMerge } from "tailwind-merge"

// Components
import { Button, ButtonProps } from "@/components/Button"
import {
  Dialog,
  DialogProps,
  DialogTrigger,
  DialogTriggerProps,
  OverlayTriggerStateContext,
  PressEvent,
} from "react-aria-components"

export const UiDialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  ...rest
}) => <DialogTrigger {...rest}>{children}</DialogTrigger>

export const UiDialog: React.FC<DialogProps> = ({
  children,
  className,
  ...rest
}) => (
  <Dialog
    {...rest}
    className={twMerge("focus-visible:outline-none", className)}
  >
    {children}
  </Dialog>
)

export const UiCloseButton: React.FC<ButtonProps> = (props) => {
  const { close } = React.useContext(OverlayTriggerStateContext)!

  return <Button {...props} onPress={close} />
}

export const UiConfirmButton: React.FC<
  ButtonProps & { onConfirm: () => Promise<void> }
> = (props) => {
  const { close } = React.useContext(OverlayTriggerStateContext)!
  const onPress = React.useCallback(
    async (e: PressEvent) => {
      await props.onConfirm()
      close()
      props.onPress?.(e)
    },
    [props, close]
  )

  return <Button {...props} onPress={onPress} />
}
