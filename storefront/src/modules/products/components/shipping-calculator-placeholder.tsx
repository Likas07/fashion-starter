"use client"

import React, { useState } from "react"
import { Button } from "@/components/Button"

type ShippingCalculatorPlaceholderProps = {
  className?: string
}

const ShippingCalculatorPlaceholder: React.FC<
  ShippingCalculatorPlaceholderProps
> = ({ className = "" }) => {
  const [cep, setCep] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handleCalculate = () => {
    if (cep.length >= 8) {
      setShowResults(true)
    }
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  return (
    <div className={`border border-grayscale-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-medium mb-4">Calcular Frete</h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Digite seu CEP"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
            maxLength={9}
            className="w-full h-12 px-4 border border-grayscale-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <Button
          onPress={handleCalculate}
          isDisabled={cep.length < 8}
          className="sm:w-auto"
          size="md"
        >
          Calcular
        </Button>
      </div>

      {/* Placeholder for "Chega hoje" banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-green-600"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="text-green-700 text-sm font-medium">
            🚚 Chega hoje! Comprando em{" "}
            <span className="font-bold">2h 34min</span>
          </span>
        </div>
      </div>

      {showResults && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-grayscale-700">
            Opções de entrega:
          </h4>

          {/* Placeholder shipping options */}
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border border-grayscale-200 rounded-lg">
              <div>
                <p className="text-sm font-medium">PAC</p>
                <p className="text-xs text-grayscale-600">Até 7 dias úteis</p>
              </div>
              <span className="text-sm font-medium">R$ 15,90</span>
            </div>

            <div className="flex justify-between items-center p-3 border border-grayscale-200 rounded-lg">
              <div>
                <p className="text-sm font-medium">SEDEX</p>
                <p className="text-xs text-grayscale-600">Até 3 dias úteis</p>
              </div>
              <span className="text-sm font-medium">R$ 25,90</span>
            </div>

            <div className="flex justify-between items-center p-3 border border-green-200 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Entrega Expressa
                </p>
                <p className="text-xs text-green-600">Hoje até 18h</p>
              </div>
              <span className="text-sm font-medium text-green-700">
                R$ 35,90
              </span>
            </div>
          </div>

          <div className="text-xs text-grayscale-500 mt-3">
            * Prazos e valores podem variar conforme disponibilidade
          </div>
        </div>
      )}

      {/* Free shipping banner placeholder */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Frete grátis</span> para compras acima
          de R$ 149,00
        </p>
      </div>
    </div>
  )
}

export default ShippingCalculatorPlaceholder
