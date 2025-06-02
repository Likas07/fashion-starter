import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Devolução ou Troca",
  description: "Saiba mais sobre nossa política de devolução e troca",
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

export default function DevolucaoOuTrocaPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/living-room-black-armchair-dark-gray-sofa.png"
          width={2496}
          height={1404}
          alt="Living room with black armchair and dark gray sofa"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              Política de Devolução e Troca
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Sua satisfação é nossa prioridade. Entendemos que às vezes um
                produto pode não atender completamente às suas expectativas, e
                por isso oferecemos uma política de devolução e troca flexível e
                transparente.
              </p>
              <p className="mb-5 lg:mb-9">
                Você tem até 30 dias a partir da data de recebimento para
                solicitar a devolução ou troca do seu produto. O item deve estar
                em perfeitas condições, sem sinais de uso e com todas as
                etiquetas originais.
              </p>
              <p>
                Nossa equipe está pronta para auxiliá-lo em todo o processo,
                garantindo que sua experiência seja sempre positiva. Entre em
                contato conosco e resolveremos sua solicitação de forma rápida e
                eficiente.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
