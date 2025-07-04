import * as React from "react"
import * as ReactAria from "react-aria-components"
import {
  UiCheckbox,
  UiCheckboxBox,
  UiCheckboxIcon,
  UiCheckboxLabel,
} from "@/components/ui/Checkbox"
import { Button } from "@/components/Button"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { UiDialog, UiDialogTrigger } from "@/components/Dialog"
import { PriceSliderFilter } from "../price-slider-filter" // Import the slider

// Extend props to receive all the new filter data
type MobileFiltersProps = {
  collections?: Record<string, string>
  collection?: string[]
  categories?: Record<string, string>
  category?: string[]
  types?: Record<string, string>
  type?: string[]
  colors?: { id: string; name: string; hex_code: string }[]
  color?: string[]
  materials?: { id: string; name: string }[]
  material?: string[]
  priceRange?: { min_price: number; max_price: number }
  minPrice?: number
  maxPrice?: number
  setMultipleQueryParams: (params: Record<string, string | string[]>) => void
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  collections,
  collection,
  categories,
  category,
  colors,
  color,
  materials,
  material,
  priceRange,
  minPrice,
  maxPrice,
  setMultipleQueryParams,
}) => {
  return (
    <UiDialogTrigger>
      <Button
        size="sm"
        variant="outline"
        iconName="plus"
        iconPosition="end"
        className="md:hidden border-grayscale-200"
      >
        Filter
      </Button>
      <UiModalOverlay className="p-0">
        <UiModal
          animateFrom="bottom"
          className="top-36 w-full pb-26 max-w-full"
        >
          <UiDialog>
            {({ close }) => (
              <form
                onSubmit={(event) => {
                  event.preventDefault() // Prevent default form submission
                  const formData = new FormData(event.currentTarget)

                  const collection = formData
                    .getAll("collection")
                    .map((value) => value.toString())
                  const category = formData
                    .getAll("category")
                    .map((value) => value.toString())
                  const type = formData
                    .getAll("type")
                    .map((value) => value.toString())
                  const color = formData
                    .getAll("color")
                    .map((value) => value.toString())
                  const material = formData
                    .getAll("material")
                    .map((value) => value.toString())

                  // For the slider, we can get the latest values directly
                  // Or handle it with hidden inputs if needed, but this is simpler for now

                  setMultipleQueryParams({
                    collection,
                    category,
                    type,
                    color,
                    material,
                  })

                  close()
                }}
              >
                {/* Collections */}
                {collections && Object.keys(collections).length > 0 && (
                  <ReactAria.CheckboxGroup
                    className="flex flex-col"
                    name="collection"
                    defaultValue={collection ?? []}
                  >
                    <ReactAria.Label className="block text-md font-semibold mb-3">
                      Collections
                    </ReactAria.Label>
                    {Object.entries(collections).map(([key, value]) => (
                      <UiCheckbox
                        key={key}
                        value={key}
                        className="justify-between py-3"
                      >
                        <UiCheckboxLabel>{value}</UiCheckboxLabel>
                        <UiCheckboxBox>
                          <UiCheckboxIcon />
                        </UiCheckboxBox>
                      </UiCheckbox>
                    ))}
                  </ReactAria.CheckboxGroup>
                )}
                <hr className="my-3 text-grayscale-200" />

                {/* Categories */}
                {categories && Object.keys(categories).length > 0 && (
                  <ReactAria.CheckboxGroup
                    className="flex flex-col"
                    name="category"
                    defaultValue={category ?? []}
                  >
                    <ReactAria.Label className="block text-md font-semibold mb-3">
                      Categories
                    </ReactAria.Label>
                    {Object.entries(categories).map(([key, value]) => (
                      <UiCheckbox
                        key={key}
                        value={key}
                        className="justify-between py-3"
                      >
                        <UiCheckboxLabel>{value}</UiCheckboxLabel>
                        <UiCheckboxBox>
                          <UiCheckboxIcon />
                        </UiCheckboxBox>
                      </UiCheckbox>
                    ))}
                  </ReactAria.CheckboxGroup>
                )}
                <hr className="my-3 text-grayscale-200" />

                {/* ADDED: Color Filter */}
                {colors && colors.length > 0 && (
                  <ReactAria.CheckboxGroup
                    className="flex flex-col"
                    name="color"
                    defaultValue={color ?? []}
                  >
                    <ReactAria.Label className="block text-md font-semibold mb-3">
                      Colors
                    </ReactAria.Label>
                    {colors.map((c) => (
                      <UiCheckbox
                        key={c.id}
                        value={c.name}
                        className="justify-between py-3"
                      >
                        <UiCheckboxLabel className="flex items-center gap-x-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: c.hex_code }}
                          />
                          {c.name}
                        </UiCheckboxLabel>
                        <UiCheckboxBox>
                          <UiCheckboxIcon />
                        </UiCheckboxBox>
                      </UiCheckbox>
                    ))}
                  </ReactAria.CheckboxGroup>
                )}
                <hr className="my-3 text-grayscale-200" />

                {/* ADDED: Material Filter */}
                {materials && materials.length > 0 && (
                  <ReactAria.CheckboxGroup
                    className="flex flex-col"
                    name="material"
                    defaultValue={material ?? []}
                  >
                    <ReactAria.Label className="block text-md font-semibold mb-3">
                      Materials
                    </ReactAria.Label>
                    {materials.map((m) => (
                      <UiCheckbox
                        key={m.id}
                        value={m.name}
                        className="justify-between py-3"
                      >
                        <UiCheckboxLabel>{m.name}</UiCheckboxLabel>
                        <UiCheckboxBox>
                          <UiCheckboxIcon />
                        </UiCheckboxBox>
                      </UiCheckbox>
                    ))}
                  </ReactAria.CheckboxGroup>
                )}
                <hr className="my-3 text-grayscale-200" />

                {/* ADDED: Price Filter */}
                {priceRange && (
                  <div className="flex flex-col px-1 py-2">
                    <PriceSliderFilter
                      priceRange={priceRange}
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      setMultipleQueryParams={setMultipleQueryParams}
                    />
                  </div>
                )}

                <footer className="flex items-center h-21 fixed bottom-0 left-0 w-full bg-white px-6 border-t border-grayscale-100">
                  <Button type="submit" isFullWidth>
                    Show results
                  </Button>
                </footer>
              </form>
            )}
          </UiDialog>
        </UiModal>
      </UiModalOverlay>
    </UiDialogTrigger>
  )
}
