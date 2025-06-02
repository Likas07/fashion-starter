import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato conosco por telefone, email ou redes sociais",
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

export default function ContatoPage() {
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
              Entre em Contato Conosco
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Estamos sempre disponíveis para atendê-lo da melhor forma
                possível. Nossa equipe de atendimento está pronta para
                esclarecer dúvidas, fornecer informações sobre produtos e
                auxiliar em todo o processo de compra.
              </p>
              <p className="mb-5 lg:mb-9">
                <strong>Telefone:</strong> (11) 3456-7890
                <br />
                <strong>WhatsApp:</strong> (11) 98765-4321
                <br />
                <strong>Email:</strong> contato@orladapraia.com.br
                <br />
                <strong>Horário de Atendimento:</strong> Segunda a sexta das 8h
                às 18h, sábado das 9h às 15h
              </p>
              <p>
                Nos siga nas redes sociais para ficar por dentro das novidades,
                promoções e inspirações de decoração:
                <br />
                <strong>Instagram:</strong> @orladapraia
                <br />
                <strong>Facebook:</strong> /orladapraia
                <br />
                <strong>LinkedIn:</strong> /company/orladapraia
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
