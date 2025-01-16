// External packages
import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"

// Components
import { Icon } from "@/components/Icon"

export interface DrawerProps extends React.ComponentPropsWithoutRef<"div"> {
  colorScheme?: "light" | "dark"
  position?: "left" | "right"
  isOpened?: boolean
  onCloseClick?: () => void
  onBackdropClick?: () => void
  closeButtonClassName?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  colorScheme = "dark",
  position = "left",
  isOpened,
  onCloseClick,
  onBackdropClick,
  closeButtonClassName,
  className,
  children,
  ...rest
}) => {
  const baseClasses =
    "flex-col items-center top-0 z-50 fixed overflow-y-scroll justify-self-center w-full max-h-screen h-screen max-w-75"
  const colorSchemeClasses =
    colorScheme === "light" ? "bg-white text-black" : "bg-black text-white"
  const positionClasses =
    position === "left"
      ? isOpened
        ? "opacity-100 visible translate-x-0 left-0"
        : "opacity-0 invisible -translate-x-full left-0"
      : isOpened
        ? "opacity-100 visible translate-x-0 right-0"
        : "opacity-0 invisible translate-x-full right-0"

  return (
    <>
      <div
        {...rest}
        className={twMerge(
          baseClasses,
          colorSchemeClasses,
          positionClasses,
          className
        )}
        style={{
          transition: isOpened
            ? "transform 500ms, opacity 200ms, visibility 100ms"
            : "transform 300ms, opacity 200ms, visibility 100ms",
        }}
      >
        <button
          className={twMerge("absolute top-6 right-8", closeButtonClassName)}
          onClick={onCloseClick}
        >
          <Icon
            name="close"
            className={twJoin(
              "w-6 text-white",
              colorScheme === "light" && "text-black",
              colorScheme === "dark" && "text-white"
            )}
          />
        </button>
        {children}
      </div>
      <div
        onClick={onBackdropClick}
        className={twJoin(
          "w-full h-full fixed top-0 right-0 z-40 bg-black duration-300",
          isOpened ? "visible opacity-10" : "invisible opacity-0"
        )}
      />
    </>
  )
}
