import { twMerge } from "tailwind-merge"

type SkeletonProps = {
  colorScheme?: "light" | "transparent"
} & React.ComponentPropsWithoutRef<"div">

export const Skeleton: React.FC<SkeletonProps> = ({
  colorScheme = "transparent",
  className,
  ...rest
}) => (
  <div
    {...rest}
    className={twMerge(
      "relative overflow-hidden shrink-0 rounded-2xs before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
      colorScheme === "light" && "bg-white/60 before:via-grayscale-50",
      className
    )}
  ></div>
)
