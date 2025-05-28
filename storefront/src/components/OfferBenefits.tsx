"use client"

import {
  Factory,
  Truck,
  CreditCard,
  Diamond,
  Shield,
  Gift,
  ShoppingBag,
} from "lucide-react"

export default function OfferBenefits() {
  const allBenefits = [
    {
      icon: <Factory className="w-8 h-8 text-gray-600" />,
      title: "FEITO NO BRASIL",
      description: "Produção nacional",
      bgColor: "bg-gray-50",
    },
    {
      icon: <Truck className="w-8 h-8 text-gray-600" />,
      title: "FRETE GRÁTIS",
      description: "compras acima de R$ 149",
      bgColor: "bg-gray-50",
    },
    {
      icon: <Truck className="w-8 h-8 text-gray-600" />,
      title: "BRASIL",
      description: "Entregamos no Brasil inteiro",
      bgColor: "bg-gray-50",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-gray-600" />,
      title: "PARCELAMENTO",
      description: "3x sem juros",
      bgColor: "bg-gray-50",
    },
    {
      icon: <Diamond className="w-8 h-8 text-gray-600" />,
      title: "DESCONTO",
      description: "5% no pix",
      bgColor: "bg-gray-50",
    },
    {
      icon: <Shield className="w-8 h-8 text-gray-600" />,
      title: "SITE SEGURO",
      description: "Compra segura",
      bgColor: "bg-white",
    },
    {
      icon: <Gift className="w-8 h-8 text-gray-600" />,
      title: "BRINDE",
      description: "Ganhe um mimo em sua compra",
      bgColor: "bg-white",
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-gray-600" />,
      title: "TROCA FÁCIL",
      description: "Compre e troque fácil",
      bgColor: "bg-white",
    },
  ]

  return (
    <div className="w-full py-4 px-4 border-t border-b border-gray-100">
      <div className="mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 text-center md:text-left">
          {allBenefits.map((benefit, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-3 p-2 rounded ${benefit.bgColor}`}
            >
              <div className="flex-shrink-0">{benefit.icon}</div>
              <div>
                <div className="font-semibold text-gray-800 text-xs sm:text-sm uppercase tracking-wide">
                  {benefit.title}
                </div>
                <div className="text-gray-600 text-xs">
                  {benefit.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
