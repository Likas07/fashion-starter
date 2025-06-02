"use client"

import React from "react"
import * as ReactAria from "react-aria-components"
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from "@/components/ui/Select"

type BikinySizeSelectorProps = {
  bustSizes: string[]
  bottomSizes: string[]
  selectedBustSize?: string
  selectedBottomSize?: string
  onBustSizeChange: (size: string) => void
  onBottomSizeChange: (size: string) => void
  disabled?: boolean
}

const BikinySizeSelector: React.FC<BikinySizeSelectorProps> = ({
  bustSizes,
  bottomSizes,
  selectedBustSize,
  selectedBottomSize,
  onBustSizeChange,
  onBottomSizeChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-sm font-medium">Tamanhos</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Bust Size Selector */}
        <div>
          <p className="mb-3 text-sm text-grayscale-600">
            Busto
            {selectedBustSize && (
              <span className="text-grayscale-500 ml-2">
                {selectedBustSize}
              </span>
            )}
          </p>
          <ReactAria.Select
            selectedKey={selectedBustSize ?? null}
            onSelectionChange={(value) => onBustSizeChange(`${value}`)}
            placeholder="Escolher"
            className="w-full"
            isDisabled={disabled}
            aria-label="Tamanho do busto"
          >
            <UiSelectButton className="!h-12 px-4 gap-2 text-sm">
              <UiSelectValue />
              <UiSelectIcon className="h-4 w-4" />
            </UiSelectButton>
            <ReactAria.Popover className="w-[--trigger-width]">
              <UiSelectListBox>
                {bustSizes.map((size) => (
                  <UiSelectListBoxItem key={size} id={size}>
                    {size}
                  </UiSelectListBoxItem>
                ))}
              </UiSelectListBox>
            </ReactAria.Popover>
          </ReactAria.Select>
        </div>

        {/* Bottom Size Selector */}
        <div>
          <p className="mb-3 text-sm text-grayscale-600">
            Calcinha
            {selectedBottomSize && (
              <span className="text-grayscale-500 ml-2">
                {selectedBottomSize}
              </span>
            )}
          </p>
          <ReactAria.Select
            selectedKey={selectedBottomSize ?? null}
            onSelectionChange={(value) => onBottomSizeChange(`${value}`)}
            placeholder="Escolher"
            className="w-full"
            isDisabled={disabled}
            aria-label="Tamanho da calcinha"
          >
            <UiSelectButton className="!h-12 px-4 gap-2 text-sm">
              <UiSelectValue />
              <UiSelectIcon className="h-4 w-4" />
            </UiSelectButton>
            <ReactAria.Popover className="w-[--trigger-width]">
              <UiSelectListBox>
                {bottomSizes.map((size) => (
                  <UiSelectListBoxItem key={size} id={size}>
                    {size}
                  </UiSelectListBoxItem>
                ))}
              </UiSelectListBox>
            </ReactAria.Popover>
          </ReactAria.Select>
        </div>
      </div>
    </div>
  )
}

export default BikinySizeSelector
