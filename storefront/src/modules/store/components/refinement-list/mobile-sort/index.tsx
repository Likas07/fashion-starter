// External packages
import * as React from "react"
import { Dialog, DialogTrigger, Label, RadioGroup } from "react-aria-components"

// Types
import type { SortOptions } from "../sort-products"

// Components
import { UiRadio, UiRadioBox, UiRadioLabel } from "@/components/ui/Radio"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { Button } from "@/components/Button"

export const MobileSort: React.FC<{
  sortBy: SortOptions | undefined
  setQueryParams: (name: string, value: SortOptions) => void
}> = ({ sortBy, setQueryParams }) => {
  return (
    <DialogTrigger>
      <Button
        size="sm"
        variant="outline"
        iconName="chevron-down"
        iconPosition="end"
        className="md:hidden border-grayscale-200"
      >
        Sort by
      </Button>
      <UiModalOverlay className="p-0">
        <UiModal
          animateFromBottom
          className="absolute left-0 w-full rounded-none max-w-full shadow-none pb-21"
        >
          <Dialog className="focus-visible:outline-none">
            {({ close }) => (
              <form
                onSubmit={(event) => {
                  const formData = new FormData(event.currentTarget)

                  const sortBy = formData.get("sortBy")?.toString()

                  setQueryParams("sortBy", sortBy as SortOptions)

                  close()
                }}
              >
                <RadioGroup
                  className="flex flex-col mb-5"
                  name="sortBy"
                  defaultValue={sortBy}
                  aria-label="Sort by"
                >
                  <Label className="block text-md font-semibold mb-3">
                    Sort by
                  </Label>
                  <UiRadio value="created_at" className="justify-between py-3">
                    <UiRadioLabel>Latest Arrivals</UiRadioLabel>
                    <UiRadioBox />
                  </UiRadio>
                  <UiRadio value="price_asc" className="justify-between py-3">
                    <UiRadioLabel>Lowest price</UiRadioLabel>
                    <UiRadioBox />
                  </UiRadio>
                  <UiRadio value="price_desc" className="justify-between py-3">
                    <UiRadioLabel>Highest price</UiRadioLabel>
                    <UiRadioBox />
                  </UiRadio>
                </RadioGroup>
                <footer className="flex items-center h-21 fixed bottom-0 left-0 w-full bg-white px-6 border-t border-grayscale-100">
                  <Button type="submit" isFullWidth>
                    Show results
                  </Button>
                </footer>
              </form>
            )}
          </Dialog>
        </UiModal>
      </UiModalOverlay>
    </DialogTrigger>
  )
}
