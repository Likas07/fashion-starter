"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lib/components/ui/accordion"

type ProductInfoAccordionsProps = {
  product: HttpTypes.StoreProduct
  materials?: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  className?: string
}

const ProductInfoAccordions: React.FC<ProductInfoAccordionsProps> = ({
  product,
  materials = [],
  className = "",
}) => {
  // Mock data for demonstration - this would come from product metadata in a real implementation
  const careInstructions = [
    "Lavar à mão com água fria",
    "Não usar alvejante",
    "Não torcer ou esfregar",
    "Secar à sombra",
    "Não passar ferro",
  ]

  const sizeGuide = {
    PP: { busto: "82-86cm", quadril: "86-90cm", calcinha: "36-38" },
    P: { busto: "86-90cm", quadril: "90-94cm", calcinha: "38-40" },
    M: { busto: "90-94cm", quadril: "94-98cm", calcinha: "40-42" },
    G: { busto: "94-98cm", quadril: "98-102cm", calcinha: "42-44" },
    GG: { busto: "98-102cm", quadril: "102-106cm", calcinha: "44-46" },
  }

  const productMaterials =
    materials.length > 0
      ? materials
      : [
          {
            id: "1",
            name: "Lycra Premium",
            colors: [{ id: "1", name: "Estampado", hex_code: "#ff6b9d" }],
          },
        ]

  return (
    <div className={className}>
      <Accordion type="single" collapsible className="w-full">
        {/* Description */}
        <AccordionItem value="description">
          <AccordionTrigger>Descrição do Produto</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              {product.description ||
                "Produto de alta qualidade, desenvolvido com materiais premium para oferecer máximo conforto e estilo."}
            </p>

            {/* Features will be added when product metadata structure is defined */}
          </AccordionContent>
        </AccordionItem>

        {/* Materials */}
        <AccordionItem value="materials">
          <AccordionTrigger>Composição e Materiais</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {productMaterials.map((material) => (
              <div
                key={material.id}
                className="border border-grayscale-200 rounded-lg p-4"
              >
                <h4 className="font-medium mb-2">{material.name}</h4>
                <div className="text-sm text-grayscale-700 space-y-2">
                  <p>Material de alta qualidade que oferece:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Secagem rápida</li>
                    <li>Proteção UV</li>
                    <li>Resistência ao cloro</li>
                    <li>Elasticidade e conforto</li>
                  </ul>
                  <div className="mt-3">
                    <p className="text-xs text-grayscale-600">
                      <strong>Composição:</strong> 82% Poliamida, 18% Elastano
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Care Instructions */}
        <AccordionItem value="care">
          <AccordionTrigger>Guia de Cuidados</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="space-y-3">
              <p className="text-sm text-grayscale-700">
                Para manter a qualidade e durabilidade do seu produto, siga
                estas instruções:
              </p>
              <ul className="space-y-2">
                {careInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm text-grayscale-700">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Importante:</strong> Seguir as instruções de cuidado
                  garante maior durabilidade das cores e do tecido.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Guide */}
        <AccordionItem value="size-guide">
          <AccordionTrigger>Guia de Tamanhos</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-grayscale-200">
                    <th className="text-left py-3 px-2">Tamanho</th>
                    <th className="text-left py-3 px-2">Busto</th>
                    <th className="text-left py-3 px-2">Quadril</th>
                    <th className="text-left py-3 px-2">Calcinha</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeGuide).map(([size, measurements]) => (
                    <tr key={size} className="border-b border-grayscale-100">
                      <td className="py-3 px-2 font-medium">{size}</td>
                      <td className="py-3 px-2 text-grayscale-700">
                        {measurements.busto}
                      </td>
                      <td className="py-3 px-2 text-grayscale-700">
                        {measurements.quadril}
                      </td>
                      <td className="py-3 px-2 text-grayscale-700">
                        {measurements.calcinha}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Dica:</strong> Em caso de dúvida entre dois tamanhos,
                recomendamos escolher o maior para maior conforto.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ProductInfoAccordions
