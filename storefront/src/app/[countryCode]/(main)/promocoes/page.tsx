import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Promoções",
  description: "Conheça nossos cupons e programas de desconto especiais",
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

export default function PromocoesPage() {
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
              Promoções e Programas de Desconto
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Oferecemos diversas oportunidades para você economizar em suas
                compras. Nossos cupons de desconto e programas especiais
                garantem que você tenha acesso aos melhores preços e condições
                exclusivas.
              </p>
              <p className="mb-5 lg:mb-9">
                Cadastre-se em nossa newsletter para receber cupons exclusivos,
                ser o primeiro a saber sobre liquidações e promoções sazonais.
                Temos descontos de até 50% em produtos selecionados e ofertas
                especiais mensais.
              </p>
              <p>
                Nosso programa de fidelidade recompensa clientes frequentes com
                pontos que podem ser convertidos em descontos, além de ofertas
                especiais para aniversariantes e datas comemorativas. Quanto
                mais você compra, mais benefícios recebe.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
