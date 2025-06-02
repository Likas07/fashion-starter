import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Garantia",
  description: "Conheça nossa política de garantia e proteção",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) =>
      r.countries
        ? r.countries
            .map((c) => c.iso_2)
            .filter(
              (value): value is string =>
                typeof value === "string" && Boolean(value)
            )
        : []
    )
  )

  const staticParams = countryCodes.map((countryCode) => ({
    countryCode,
  }))

  return staticParams
}

export default function GarantiaPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/gray-one-seater-sofa-wooden-coffee-table.png"
          width={1200}
          height={1600}
          alt="Gray one-seater sofa and wooden coffee table"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              Garantia e Proteção dos seus Produtos
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Oferecemos garantia completa contra defeitos de fabricação em
                todos os nossos produtos. Nossa garantia cobre problemas
                estruturais, defeitos nos materiais e falhas na montagem por um
                período de 12 meses a partir da data da compra.
              </p>
              <p className="mb-5 lg:mb-9">
                Além da garantia legal, trabalhamos com fornecedores de
                confiança que oferecem garantia estendida opcional para maior
                tranquilidade. Nossa equipe técnica está sempre disponível para
                avaliar e resolver qualquer questão relacionada à garantia.
              </p>
              <p>
                Para acionar a garantia, entre em contato conosco com o número
                do pedido e descrição do problema. Realizaremos uma avaliação e,
                se necessário, faremos o reparo ou substituição do produto sem
                custo adicional.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
