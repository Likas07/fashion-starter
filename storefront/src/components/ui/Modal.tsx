"use client"

import { Modal, ModalOverlay, ModalOverlayProps } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export const UiModalOverlay: React.FC<ModalOverlayProps> = ({
  isDismissable = true,
  className,
  ...props
}) => (
  <ModalOverlay
    {...props}
    isDismissable={isDismissable}
    className={twMerge(
      "fixed inset-0 flex min-h-full items-center justify-center bg-black-10% z-50 data-[entering]:animate-in data-[entering]:fade-in data-[entering]:duration-300 data-[entering]:ease-out data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:duration-200 data-[exiting]:ease-in p-4",
      className as string
    )}
  />
)

export const UiModal: React.FC<ModalOverlayProps> = ({
  className,
  ...props
}) => (
  <Modal
    {...props}
    className={twMerge(
      "bg-white p-6 rounded-2xs max-w-154 w-full shadow-modal data-[entering]:animate-in data-[entering]:zoom-in-95 data-[entering]:ease-out data-[entering]:duration-300 data-[exiting]:animate-out data-[exiting]:zoom-out-95 data-[exiting]:ease-in data-[exiting]:duration-200",
      className as string
    )}
  />
)
