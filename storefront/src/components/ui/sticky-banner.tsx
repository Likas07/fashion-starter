"use client"
import React, { SVGProps, useState, useEffect } from "react"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { cn } from "@lib/lib/utils"

const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

export const StickyBanner = ({
  className,
  phrases,
  interval = 3000, // Default interval: 3 seconds
  hideOnScroll = false,
}: {
  className?: string
  phrases: string[]
  interval?: number
  hideOnScroll?: boolean
}) => {
  const [open, setOpen] = useState(true)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (phrases && phrases.length > 1 && !isHovering) {
      timer = setInterval(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
      }, interval)
    }
    return () => clearInterval(timer)
  }, [phrases, interval, currentPhraseIndex, isHovering])

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll && latest > 40) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  })

  const handlePrev = () => {
    setCurrentPhraseIndex(
      (prevIndex) => (prevIndex - 1 + phrases.length) % phrases.length
    )
  }

  const handleNext = () => {
    setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
  }

  if (!phrases || phrases.length === 0) {
    return null
  }

  return (
    <motion.div
      className={cn(
        "sticky inset-x-0 top-0 z-40 flex min-h-14 w-full items-center justify-between bg-transparent px-4 py-1",
        className
      )}
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: open ? 0 : -100,
        opacity: open ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {phrases.length > 1 && (
        <button
          onClick={handlePrev}
          className="p-2 text-current hover:opacity-75 focus:outline-none"
          aria-label="Previous message"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      )}
      <div className="flex-grow text-center">{phrases[currentPhraseIndex]}</div>
      {phrases.length > 1 && (
        <button
          onClick={handleNext}
          className="p-2 text-current hover:opacity-75 focus:outline-none"
          aria-label="Next message"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}
      {
        phrases.length <= 1 && (
          <div className="w-9" />
        ) /* Spacer to balance layout when only one message */
      }
    </motion.div>
  )
}
