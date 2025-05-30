"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useCountryCode } from "hooks/country-code"

export const HeaderWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const pathName = usePathname()
  const countryCodeValue = useCountryCode()
  const stableCountryCode =
    countryCodeValue === undefined ? null : countryCodeValue
  const currentPath = countryCodeValue
    ? pathName.split(`/${countryCodeValue}`)[1]
    : pathName
  const isMainPage = !currentPath || currentPath === "/"
  const isPageWithHeroImage =
    !currentPath ||
    currentPath === "/" ||
    currentPath === "/about" ||
    currentPath === "/inspiration" ||
    currentPath.startsWith("/collections")
  const isAlwaysSticky =
    currentPath.startsWith("/auth") || currentPath.startsWith("/account")

  React.useEffect(() => {
    const headerElement = document.querySelector<HTMLElement>("#site-header") // Cast to HTMLElement

    if (!headerElement) {
      return
    }

    if (isAlwaysSticky || !isMainPage) {
      // If it's an 'always sticky' page or any non-main page,
      // it's already sticky or should be.
      // We can ensure the attribute is set correctly, though the JSX change should handle it.
      if (headerElement.dataset.sticky !== "true") {
        headerElement.setAttribute("data-sticky", "true")
      }
      return // No scroll/resize listeners needed for these pages to manage stickiness.
    }

    // The rest of the effect is for the main page's scroll-to-sticky behavior
    if (isAlwaysSticky) {
      // This check is now effectively for the main page only if it were also 'alwaysSticky' (unlikely scenario but good for completeness)
      return
    }

    const nextElement = headerElement.nextElementSibling
    let triggerPosition = 0

    // Removed redundant check for headerElement and declaration of nextElement

    const updateTriggerPosition = () => {
      if (isPageWithHeroImage) {
        triggerPosition = nextElement
          ? Math.max(nextElement.clientHeight - headerElement.clientHeight, 1)
          : 200
      } else {
        triggerPosition = nextElement
          ? Math.max(
              Number.parseInt(
                window.getComputedStyle(nextElement).paddingTop,
                10
              ) - headerElement.clientHeight,
              1
            )
          : 1
      }
    }

    const handleScroll = () => {
      const position = window.scrollY

      headerElement.setAttribute(
        "data-sticky",
        position > triggerPosition ? "true" : "false"
      )
    }

    updateTriggerPosition()
    handleScroll()

    window.addEventListener("resize", updateTriggerPosition, {
      passive: true,
    })
    window.addEventListener("orientationchange", updateTriggerPosition, {
      passive: true,
    })
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("resize", updateTriggerPosition)
      window.removeEventListener("orientationchange", updateTriggerPosition)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [
    pathName,
    isPageWithHeroImage,
    isAlwaysSticky,
    stableCountryCode, // Use stableCountryCode
    currentPath,
    isMainPage,
  ])

  return (
    <div
      id="site-header"
      className="left-0 w-full top-14 
                 data-[light=true]:md:bg-gradient-to-b data-[light=true]:from-black/75 data-[light=true]:to-transparent 
                 data-[light=false]:bg-white 
                 data-[sticky=true]:bg-white data-[sticky=true]:md:bg-none
                 data-[light=true]:md:text-white data-[sticky=true]:md:text-black 
                 transition-colors fixed z-40 group"
      data-light={isPageWithHeroImage}
      data-sticky={isAlwaysSticky || !isMainPage}
    >
      {children}
    </div>
  )
}
