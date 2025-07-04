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

type MaterialFilterProps = {
  materials: { id: string; name: string }[]
  material?: string[]
  setQueryParams: (name: string, value: string[]) => void
}

export const MaterialFilter: React.FC<MaterialFilterProps> = ({
  material,
  materials,
  setQueryParams,
}) => (
  <UiDialogTrigger>
    <UiSelectButton className="w-35">
      <span>Material</span>
      <UiSelectIcon />
    </UiSelectButton>
    <ReactAria.Popover className="w-64" placement="bottom left">
      <UiSelectDialog>
        <ReactAria.CheckboxGroup
          value={material ?? []}
          onChange={(value) => {
            setQueryParams("material", value)
          }}
          className="max-h-50 overflow-scroll"
        >
          {materials.map((m) => (
            <UiCheckbox value={m.name} className="p-4" key={m.id}>
              <UiCheckboxBox>
                <UiCheckboxIcon />
              </UiCheckboxBox>
              <UiCheckboxLabel>{m.name}</UiCheckboxLabel>
            </UiCheckbox>
          ))}
        </ReactAria.CheckboxGroup>
      </UiSelectDialog>
    </ReactAria.Popover>
  </UiDialogTrigger>
)
