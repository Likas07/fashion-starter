import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Políticas para Compra",
  description: "Conheça nossas políticas para compras no atacado",
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

export default function PoliticasParaCompraPage() {
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
              Políticas para Compras no Atacado
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Oferecemos condições especiais para compras no atacado
                destinadas a revendedores, decoradores e empresas. Nosso
                programa de atacado inclui descontos progressivos, condições de
                pagamento diferenciadas e suporte dedicado.
              </p>
              <p className="mb-5 lg:mb-9">
                Para se qualificar para preços de atacado, é necessário um
                pedido mínimo de 10 peças ou valor mínimo de R$ 5.000,00.
                Oferecemos descontos de 15% a 30% dependendo do volume da compra
                e relacionamento comercial.
              </p>
              <p>
                Nosso time comercial está disponível para desenvolver propostas
                personalizadas, incluindo prazos de entrega estendidos,
                personalização de produtos e condições especiais de pagamento
                para grandes volumes.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
