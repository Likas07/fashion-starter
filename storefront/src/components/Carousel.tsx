"use client"

import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Icon } from "@/components/Icon"
import { IconCircle } from "@/components/IconCircle"
import { Layout, LayoutColumn } from "@/components/Layout"

type EmblaCarouselType = UseEmblaCarouselType[1]

export type CarouselProps = {
  heading?: React.ReactNode
  button?: React.ReactNode
  arrows?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  autoplayStopOnInteraction?: boolean
  loop?: boolean
  useInternalLayout?: boolean // New prop
  arrowPosition?: "inside" | "outside" // New prop for arrow positioning
} & React.ComponentPropsWithRef<"div">

export const Carousel: React.FC<CarouselProps> = ({
  heading,
  button,
  arrows = true,
  autoplay = false,
  autoplayDelay = 4000,
  autoplayStopOnInteraction = true,
  loop = false,
  useInternalLayout = true, // Default to true
  arrowPosition = "outside", // Default to 'outside'
  children,
  className,
}) => {
  const plugins: any[] = []
  if (autoplay) {
    plugins.push(
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: autoplayStopOnInteraction,
      })
    )
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      containScroll: "trimSnaps",
      skipSnaps: true,
      active: true,
      loop: loop,
    },
    plugins as any
  )
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )
  const onSelect = React.useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  const carouselContent = (
    <>
      {(heading || button) && useInternalLayout && (
        <div className="mb-8 md:mb-15 flex max-sm:flex-col justify-between sm:items-center gap-x-10 gap-y-6">
          {heading}
          {button && <div className="flex md:gap-6 shrink-0">{button}</div>}
        </div>
      )}
      <div ref={emblaRef} className="overflow-hidden w-full">
        <div className="flex touch-pan-y">{children}</div>
      </div>
      {arrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={twJoin(
              "absolute top-1/2 -translate-y-1/2 z-10 transition-opacity max-md:hidden",
              arrowPosition === "inside" ? "left-4" : "left-[-2.5rem]",
              prevBtnDisabled && "opacity-50"
            )}
            aria-label="Previous"
          >
            <IconCircle className="bg-black/50 hover:bg-black/75 transition-colors">
              <Icon name="arrow-left" className="w-6 h-6 text-white" />
            </IconCircle>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={twJoin(
              "absolute top-1/2 -translate-y-1/2 z-10 transition-opacity max-md:hidden",
              arrowPosition === "inside" ? "right-4" : "right-[-2.5rem]",
              nextBtnDisabled && "opacity-50"
            )}
            aria-label="Next"
          >
            <IconCircle className="bg-black/50 hover:bg-black/75 transition-colors">
              <Icon name="arrow-right" className="w-6 h-6 text-white" />
            </IconCircle>
          </button>
        </>
      )}
    </>
  )

  if (useInternalLayout) {
    return (
      <div className={twMerge("overflow-hidden", className)}>
        <Layout>
          <LayoutColumn className="relative">{carouselContent}</LayoutColumn>
        </Layout>
      </div>
    )
  }

  // For full-width mode (useInternalLayout is false)
  return (
    <div className={twMerge("overflow-hidden relative", className)}>
      {carouselContent}
    </div>
  )
}
