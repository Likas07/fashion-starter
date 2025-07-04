"use client"

import * as ReactAria from "react-aria-components"
import {
  UiSelectButton,
  UiSelectDialog,
  UiSelectIcon,
} from "@/components/ui/Select"
import {
  UiCheckbox,
  UiCheckboxBox,
  UiCheckboxIcon,
  UiCheckboxLabel,
} from "@/components/ui/Checkbox"
import { UiDialogTrigger } from "@/components/Dialog"

type ColorFilterProps = {
  colors: { id: string; name: string; hex_code: string }[]
  color?: string[]
  setQueryParams: (name: string, value: string[]) => void
}

export const ColorFilter: React.FC<ColorFilterProps> = ({
  color,
  colors,
  setQueryParams,
}) => (
  <UiDialogTrigger>
    <UiSelectButton className="w-35">
      <span>Cor</span>
      <UiSelectIcon />
    </UiSelectButton>
    <ReactAria.Popover className="w-64" placement="bottom left">
      <UiSelectDialog>
        <ReactAria.CheckboxGroup
          value={color ?? []}
          onChange={(value) => {
            setQueryParams("color", value)
          }}
          className="max-h-50 overflow-scroll"
        >
          {colors.map((c) => (
            <UiCheckbox
              value={c.name}
              className="p-4 flex items-center gap-x-2"
              key={c.id}
            >
              <UiCheckboxBox>
                <UiCheckboxIcon />
              </UiCheckboxBox>
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: c.hex_code }}
              />
              <UiCheckboxLabel>{c.name}</UiCheckboxLabel>
            </UiCheckbox>
          ))}
        </ReactAria.CheckboxGroup>
      </UiSelectDialog>
    </ReactAria.Popover>
  </UiDialogTrigger>
)
