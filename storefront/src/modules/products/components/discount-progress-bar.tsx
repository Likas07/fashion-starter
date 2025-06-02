"use client"

import React from "react"

type DiscountProgressBarProps = {
  currentValue: number
  targetValue: number
  rewardType: "frete" | "brinde"
  rewardDescription?: string
  className?: string
}

const DiscountProgressBar: React.FC<DiscountProgressBarProps> = ({
  currentValue,
  targetValue,
  rewardType,
  rewardDescription = "",
  className = "",
}) => {
  const progressPercentage = Math.min((currentValue / targetValue) * 100, 100)
  const remainingValue = Math.max(targetValue - currentValue, 0)
  const isCompleted = currentValue >= targetValue

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getRewardText = () => {
    if (isCompleted) {
      return rewardType === "frete"
        ? "🎉 Parabéns! Você ganhou frete grátis!"
        : `🎉 Parabéns! Você ganhou ${rewardDescription || "um brinde"}!`
    }

    return rewardType === "frete"
      ? `Faltam ${formatPrice(remainingValue)} para ganhar frete grátis`
      : `Faltam ${formatPrice(remainingValue)} para ganhar ${rewardDescription || "um brinde"}`
  }

  const getProgressColor = () => {
    if (isCompleted) return "bg-green-500"
    if (progressPercentage > 70) return "bg-orange-500"
    return "bg-blue-500"
  }

  const getContainerColor = () => {
    if (isCompleted) return "bg-green-50 border-green-200"
    if (progressPercentage > 70) return "bg-orange-50 border-orange-200"
    return "bg-blue-50 border-blue-200"
  }

  const getTextColor = () => {
    if (isCompleted) return "text-green-700"
    if (progressPercentage > 70) return "text-orange-700"
    return "text-blue-700"
  }

  return (
    <div
      className={`border rounded-lg p-4 ${getContainerColor()} ${className}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-lg">{rewardType === "frete" ? "🚚" : "🎁"}</div>
        <p className={`text-sm font-medium flex-1 ${getTextColor()}`}>
          {getRewardText()}
        </p>
      </div>

      <div className="relative">
        {/* Background bar */}
        <div className="w-full bg-grayscale-200 rounded-full h-3">
          {/* Progress bar */}
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Progress percentage text */}
        <div className="flex justify-between items-center mt-2 text-xs text-grayscale-600">
          <span>{formatPrice(currentValue)}</span>
          <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
          <span>{formatPrice(targetValue)}</span>
        </div>
      </div>

      {isCompleted && rewardType === "brinde" && rewardDescription && (
        <div className="mt-3 p-2 bg-white rounded border border-green-200">
          <p className="text-xs text-green-700 font-medium">
            🎁 Seu brinde: {rewardDescription}
          </p>
        </div>
      )}
    </div>
  )
}

export default DiscountProgressBar
