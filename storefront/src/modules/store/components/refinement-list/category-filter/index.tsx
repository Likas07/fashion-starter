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

export const CategoryFilter: React.FC<{
  categories: Record<string, string>
  category?: string[]
  setQueryParams: (name: string, value: string[]) => void
}> = ({ category, categories, setQueryParams }) => (
  <ReactAria.DialogTrigger>
    <UiSelectButton className="w-35">
      <span>Category</span>
      <UiSelectIcon />
    </UiSelectButton>
    <ReactAria.Popover className="w-64" crossOffset={58}>
      <UiSelectDialog>
        <ReactAria.CheckboxGroup
          value={category ?? []}
          onChange={(value) => {
            setQueryParams("category", value)
          }}
        >
          {Object.entries(categories).map(([key, value]) => (
            <UiCheckbox value={key} className="py-3 px-4" key={key}>
              <UiCheckboxBox>
                <UiCheckboxIcon />
              </UiCheckboxBox>
              <UiCheckboxLabel>{value}</UiCheckboxLabel>
            </UiCheckbox>
          ))}
        </ReactAria.CheckboxGroup>
      </UiSelectDialog>
    </ReactAria.Popover>
  </ReactAria.DialogTrigger>
)
