"use client"

import { useEffect, useState } from "react"
import { BiFilter } from "react-icons/bi"
import { RxChevronDown } from "react-icons/rx"
import { IoCloseOutline } from "react-icons/io5"
import { Button } from "../../../../lib/components/ui/button"
import { Checkbox } from "../../../../lib/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../lib/components/ui/dropdown-menu"
import { Label } from "../../../../lib/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../lib/components/ui/radio-group"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../lib/components/ui/sheet"
import { Slider } from "../../../../lib/components/ui/slider"
import { useMediaQuery } from "../../../../lib/hooks/use-media-query"

export type FilterOptions = {
  colors: Array<{ name: string; hex_code: string }>
  styles: string[]
  priceRange: { min: number; max: number }
  productCount: number
}

export const AdvancedFilters = ({
  title = "Loja",
  sortBy,
  appliedFilters = [],
  onFiltersChange,
  onSortChange,
  productCount = 0,
  totalCount = 0,
  children,
  filterOptions,
}: {
  title?: string
  sortBy?: string
  appliedFilters?: Array<{ type: string; value: string; label: string }>
  onFiltersChange?: (filters: {
    size: string[]
    style: string
    color: string[]
    bestSelling: string
    priceRange: number[]
  }) => void
  onSortChange?: (sort: string) => void
  productCount?: number
  totalCount?: number
  children?: React.ReactNode
  filterOptions?: FilterOptions
}) => {
  const isTablet = useMediaQuery("(max-width: 991px)")
  const [key, setKey] = useState(0)

  const handleClearAll = () => {
    setKey((prev) => prev + 1)
    onFiltersChange?.({
      size: [],
      style: "",
      color: [],
      bestSelling: "",
      priceRange: [
        filterOptions?.priceRange?.min || 0,
        filterOptions?.priceRange?.max || 1000,
      ],
    })
  }

  const removeFilter = (filterType: string, value: string) => {
    // This will be handled by the parent component
    // The parent component should implement this logic to update the filters
    console.log("Remove filter:", filterType, value)
  }

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="content-container">
        <div className="mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl font-agenda">
            {title}
          </h1>
          <p className="md:text-md font-agenda">
            Explore nossa coleção completa.
          </p>
          {!filterOptions}{" "}
        </div>
        <div className="grid grid-cols-1 items-start gap-10 md:gap-12 lg:grid-cols-[max-content_1fr]">
          {isTablet ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="w-full gap-2 font-agenda"
                  variant="secondary"
                >
                  <BiFilter className="size-6" />
                  <span className="underline">Filtros</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-screen w-full px-[5%] pb-0 pt-12 md:px-[5%] md:pb-0 md:pt-12"
              >
                <SheetHeader className="mb-6 space-y-0 text-left">
                  <SheetTitle className="mb-6 text-5xl font-bold leading-[1.4] font-agenda">
                    Filtros
                  </SheetTitle>
                  <p className="text-sm font-agenda">
                    Mostrando {productCount} de {totalCount}
                  </p>
                  <SheetClose className="absolute right-6 top-6" />
                </SheetHeader>
                <div className="mt-6">
                  <FilterSections
                    clearTrigger={key}
                    onFiltersChange={onFiltersChange}
                    filterOptions={filterOptions}
                  />
                </div>
                <SheetFooter className="sticky bottom-0 z-50 mt-6">
                  <div className="-mx-[5%] flex w-screen items-center justify-between border-t border-border bg-background px-[5%] py-2 md:py-3">
                    <Button
                      variant="link"
                      size="link"
                      onClick={handleClearAll}
                      className="font-agenda"
                    >
                      Limpar tudo
                    </Button>
                    <Button className="font-agenda">Aplicar</Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="sticky top-[10vh] hidden w-full lg:flex lg:flex-col">
              <div className="mb-6">
                <div className="mb-6 flex w-[18rem] items-center justify-between">
                  <h2 className="text-2xl font-bold leading-[1.4] font-agenda">
                    Filtros
                  </h2>
                  <Button
                    variant="link"
                    size="link"
                    onClick={handleClearAll}
                    className="font-agenda"
                  >
                    Limpar tudo
                  </Button>
                </div>
                <p className="text-sm font-agenda">
                  Mostrando {productCount} de {totalCount}
                </p>
              </div>
              <div className="h-[80vh] overflow-scroll pr-4 no-scrollbar">
                <FilterSections
                  clearTrigger={key}
                  onFiltersChange={onFiltersChange}
                  filterOptions={filterOptions}
                />
              </div>
            </div>
          )}
          <div>
            <div className="mb-6 flex w-full items-center justify-between gap-8">
              <div className="mr-8 flex flex-1 flex-wrap items-start gap-2">
                {appliedFilters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-secondary py-2 pl-4 pr-3 rounded font-agenda"
                  >
                    <span>{filter.label}</span>
                    <IoCloseOutline
                      className="ml-2 cursor-pointer"
                      size="22"
                      onClick={() => removeFilter(filter.type, filter.value)}
                    />
                  </div>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="-mr-2 flex items-center gap-2 font-agenda">
                  <p className="whitespace-nowrap">Ordenar por</p>
                  <RxChevronDown className="shrink-0 text-foreground transition-transform duration-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[
                    { value: "created_at", label: "Mais Recentes" },
                    { value: "title", label: "Nome: A a Z" },
                    { value: "title-desc", label: "Nome: Z a A" },
                    { value: "price", label: "Preço: Menor a Maior" },
                    { value: "price-desc", label: "Preço: Maior a Menor" },
                  ].map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onSortChange?.(option.value)}
                      className="font-agenda"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

const FilterSections = ({
  clearTrigger,
  onFiltersChange,
  filterOptions,
}: {
  clearTrigger: number
  onFiltersChange?: (filters: {
    size: string[]
    style: string
    color: string[]
    bestSelling: string
    priceRange: number[]
  }) => void
  filterOptions?: FilterOptions
}) => {
  const [selectedSizes, setSelectedSizes] = useState(new Set<string>())
  const [selectedStyle, setSelectedStyle] = useState("Todos")
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set())
  const [selectedBestSelling, setSelectedBestSelling] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])

  const sizes = ["PP", "P", "M", "G", "GG", "XGG"]

  // Use dynamic styles or fallback to default
  const styles = filterOptions?.styles?.length
    ? ["Todos", ...filterOptions.styles]
    : ["Todos", "Casual", "Esportivo", "Elegante", "Praia"]

  // Use dynamic colors or fallback to default
  const colors = filterOptions?.colors?.length
    ? filterOptions.colors.map((color) => ({
        name: color.name,
        hex: color.hex_code,
      }))
    : [
        { name: "Preto", hex: "#000000" },
        { name: "Branco", hex: "#FFFFFF" },
        { name: "Vermelho", hex: "#FF0000" },
        { name: "Azul", hex: "#0000FF" },
        { name: "Verde", hex: "#008000" },
        { name: "Rosa", hex: "#FFC0CB" },
      ]

  // Reset filters when clear trigger changes
  useEffect(() => {
    if (clearTrigger > 0) {
      setSelectedSizes(new Set())
      setSelectedStyle("Todos")
      setSelectedColors(new Set())
      setSelectedBestSelling("")
      setPriceRange([
        filterOptions?.priceRange?.min || 0,
        filterOptions?.priceRange?.max || 1000,
      ])
    }
  }, [clearTrigger, filterOptions])

  // Initialize price range when filterOptions first becomes available
  useEffect(() => {
    if (filterOptions?.priceRange) {
      // Only update if we're still using the default values
      setPriceRange((prev) => {
        if (prev[0] === 0 && prev[1] === 1000) {
          return [filterOptions.priceRange.min, filterOptions.priceRange.max]
        }
        return prev
      })
    }
  }, [filterOptions])

  // Update filters when state changes
  useEffect(() => {
    console.log("🔄 FilterSections useEffect triggered")
    onFiltersChange?.({
      size: Array.from(selectedSizes),
      style: selectedStyle !== "Todos" ? selectedStyle : "",
      color: Array.from(selectedColors),
      bestSelling: selectedBestSelling,
      priceRange: priceRange,
    })
  }, [
    selectedSizes,
    selectedStyle,
    selectedColors,
    selectedBestSelling,
    priceRange,
    onFiltersChange,
  ])

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(size)) {
        newSet.delete(size)
      } else {
        newSet.add(size)
      }
      return newSet
    })
  }

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(color)) {
        newSet.delete(color)
      } else {
        newSet.add(color)
      }
      return newSet
    })
  }

  const clearFilter = (filterType: string) => {
    switch (filterType) {
      case "sizes":
        setSelectedSizes(new Set())
        break
      case "style":
        setSelectedStyle("Todos")
        break
      case "colors":
        setSelectedColors(new Set())
        break
      case "bestSelling":
        setSelectedBestSelling("")
        break
      case "price":
        setPriceRange([
          filterOptions?.priceRange?.min || 0,
          filterOptions?.priceRange?.max || 1000,
        ])
        break
      default:
        break
    }
  }

  return (
    <div className="lg:w-[18rem]">
      {/* Size Filter */}
      <div className="border-y border-border">
        <div className="flex items-center justify-between py-4 md:py-5">
          <h3 className="font-semibold md:text-md font-agenda">Tamanho</h3>
          <Button
            variant="link"
            size="link"
            onClick={() => clearFilter("sizes")}
            className="font-agenda"
          >
            Limpar
          </Button>
        </div>
        <div className="mb-7 lg:mb-5">
          <div className="grid grid-cols-1">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center gap-x-3 py-2 font-agenda"
              >
                <Checkbox
                  checked={selectedSizes.has(size)}
                  onCheckedChange={() => handleSizeChange(size)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Style Filter */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between py-4 md:py-5">
          <h3 className="font-semibold md:text-md font-agenda">Material</h3>
          <Button
            variant="link"
            size="link"
            onClick={() => clearFilter("style")}
            className="font-agenda"
          >
            Limpar
          </Button>
        </div>
        <div className="mb-7 lg:mb-5">
          <RadioGroup
            className="grid grid-cols-1 gap-0"
            value={selectedStyle}
            onValueChange={setSelectedStyle}
          >
            {styles.map((style) => (
              <div key={style} className="flex items-center gap-x-3 py-2">
                <RadioGroupItem value={style} id={style} shape="check" />
                <Label htmlFor={style} className="font-agenda">
                  {style}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Color Filter */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between py-4 md:py-5">
          <h3 className="font-semibold md:text-md font-agenda">Cor</h3>
          <Button
            variant="link"
            size="link"
            onClick={() => clearFilter("colors")}
            className="font-agenda"
          >
            Limpar
          </Button>
        </div>
        <div className="mb-7 lg:mb-5">
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <div key={color.name} className="flex items-center">
                <Checkbox
                  id={`color-${color.name}`}
                  className="hidden"
                  checked={selectedColors.has(color.name)}
                  onCheckedChange={() => handleColorChange(color.name)}
                />
                <label
                  htmlFor={`color-${color.name}`}
                  className={`inline-flex cursor-pointer items-center justify-center border border-border px-4 py-2 text-base transition-colors font-agenda ${
                    selectedColors.has(color.name)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2 border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Selling Filter */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between py-4 md:py-5">
          <h3 className="font-semibold md:text-md font-agenda">
            Mais Vendidos
          </h3>
          <Button
            variant="link"
            size="link"
            onClick={() => clearFilter("bestSelling")}
            className="font-agenda"
          >
            Limpar
          </Button>
        </div>
        <div className="mb-7 lg:mb-5">
          <RadioGroup
            className="flex flex-wrap gap-2"
            value={selectedBestSelling}
            onValueChange={setSelectedBestSelling}
          >
            {["Sim", "Não"].map((option) => (
              <div key={option} className="flex items-center">
                <RadioGroupItem
                  value={option}
                  id={`best-selling-${option}`}
                  className="hidden"
                />
                <label
                  htmlFor={`best-selling-${option}`}
                  className={`inline-flex cursor-pointer items-center justify-center border border-border px-4 py-2 text-base transition-colors font-agenda ${
                    selectedBestSelling === option
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between py-4 md:py-5">
          <h3 className="font-semibold md:text-md font-agenda">
            Faixa de Preço
          </h3>
          <Button
            variant="link"
            size="link"
            onClick={() => clearFilter("price")}
            className="font-agenda"
          >
            Limpar
          </Button>
        </div>
        <div className="mb-7 lg:mb-5">
          <div className="mt-4 w-full px-3">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={filterOptions?.priceRange?.min || 0}
              max={filterOptions?.priceRange?.max || 1000}
              step={10}
            />
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-md font-agenda">R$ {priceRange[0]}</span>
              <span className="text-md font-agenda">R$ {priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
