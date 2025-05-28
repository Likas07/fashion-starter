"use client"
import React, { SVGProps, useState, useEffect } from "react"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { cn } from "@lib/lib/utils"

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
  const { scrollY } = useScroll()

  useEffect(() => {
    if (phrases && phrases.length > 1) {
      const timer = setInterval(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
      }, interval)
      return () => clearInterval(timer)
    }
  }, [phrases, interval])

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll && latest > 40) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  })

  return (
    <motion.div
      className={cn(
        "sticky inset-x-0 top-0 z-40 flex min-h-14 w-full items-center justify-center bg-transparent px-4 py-1",
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
    >
      {phrases && phrases.length > 0 && phrases[currentPhraseIndex]}
    </motion.div>
  )
}
