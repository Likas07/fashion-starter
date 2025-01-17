"use client"

import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"

export const UiModalOverlay: React.FC<ReactAria.ModalOverlayProps> = ({
  isDismissable = true,
  className,
  ...props
}) => (
  <ReactAria.ModalOverlay
    {...props}
    isDismissable={isDismissable}
    className={twMerge(
      "fixed inset-0 flex min-h-full items-center justify-center bg-black-10% z-50 data-[entering]:animate-in data-[entering]:fade-in data-[entering]:duration-200 data-[entering]:ease-out data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:duration-100 data-[exiting]:ease-in p-4",
      className as string
    )}
  />
)

type UiModalOwnProps = {
  animateFromBottom?: boolean
}

export const UiModal: React.FC<
  UiModalOwnProps & ReactAria.ModalOverlayProps
> = ({ animateFromBottom = false, className, ...props }) => (
  <ReactAria.Modal
    {...props}
    className={twMerge(
      "bg-white max-sm:px-4 p-6 rounded-xs max-h-full overflow-y-scroll max-w-154 w-full shadow-modal data-[entering]:animate-in data-[entering]:ease-out data-[entering]:duration-200 data-[exiting]:animate-out data-[exiting]:ease-in data-[exiting]:duration-100",
      animateFromBottom
        ? "data-[entering]:slide-in-from-bottom-10 data-[exiting]:slide-out-to-bottom-10 bottom-0"
        : "data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95",
      className as string
    )}
  />
)
