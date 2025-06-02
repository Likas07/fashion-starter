import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Guia de Cuidados",
  description: "Aprenda como cuidar adequadamente dos seus produtos",
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

export default function GuiaDeCuidadosPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/living-room-gray-three-seater-sofa.png"
          width={2880}
          height={1500}
          alt="Living room with gray three-seater sofa"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              Guia Completo de Cuidados para seus Produtos
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Cuidar adequadamente dos seus produtos é essencial para manter
                sua qualidade e durabilidade ao longo do tempo. Nosso guia
                completo oferece dicas valiosas e instruções detalhadas para que
                você possa preservar a beleza e funcionalidade de cada item.
              </p>
              <p className="mb-5 lg:mb-9">
                Desde técnicas de limpeza específicas até recomendações de
                armazenamento, você encontrará aqui todas as informações
                necessárias para maximizar a vida útil dos seus produtos e
                manter sua aparência original.
              </p>
              <p>
                Nossos especialistas compilaram as melhores práticas de cuidado,
                levando em consideração diferentes materiais e tipos de
                produtos. Siga nossas orientações e desfrute de produtos que
                permanecerão belos e funcionais por muito mais tempo.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
