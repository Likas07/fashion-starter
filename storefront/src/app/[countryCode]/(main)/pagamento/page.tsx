import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Pagamento",
  description: "Conheça nossas opções de pagamento seguras e flexíveis",
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

export default function PagamentoPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/living-room-gray-three-seater-puffy-sofa.png"
          width={2880}
          height={1618}
          alt="Living room with gray three-seater puffy sofa"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              Opções de Pagamento Seguras e Flexíveis
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Oferecemos diversas formas de pagamento para sua comodidade e
                segurança. Aceitamos cartões de crédito, débito, PIX, boleto
                bancário e parcelamento em até 12x sem juros para compras acima
                de R$ 500,00.
              </p>
              <p className="mb-5 lg:mb-9">
                Todas as transações são processadas com criptografia de ponta e
                certificação SSL para garantir a máxima segurança dos seus
                dados. Trabalhamos com as principais bandeiras de cartão e
                gateways de pagamento do mercado.
              </p>
              <p>
                Para compras à vista, oferecemos desconto especial de 5%.
                Parcelamentos sem juros disponíveis para facilitar sua compra.
                Consulte nossas condições especiais para clientes corporativos e
                revendedores.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
