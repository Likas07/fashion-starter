"use client"

import React from "react"

type ReviewsPlaceholderProps = {
  className?: string
}

const ReviewsPlaceholder: React.FC<ReviewsPlaceholderProps> = ({
  className = "",
}) => {
  return (
    <div className={`border border-grayscale-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-medium mb-6">Avaliações dos Clientes</h3>

      <div className="text-center py-12 text-grayscale-500">
        <div className="mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto text-grayscale-300"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <h4 className="text-md font-medium mb-2">Sistema de Avaliações</h4>
        <p className="text-sm text-grayscale-600 max-w-md mx-auto">
          Em breve você poderá ver e deixar avaliações para este produto. Nossa
          seção de reviews permitirá upload de imagens e comentários detalhados.
        </p>
        <div className="mt-6 p-4 bg-grayscale-50 rounded-lg max-w-sm mx-auto">
          <p className="text-xs text-grayscale-500">
            🌟 Avaliações com fotos
            <br />
            📝 Comentários detalhados
            <br />✅ Reviews verificados
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReviewsPlaceholder
