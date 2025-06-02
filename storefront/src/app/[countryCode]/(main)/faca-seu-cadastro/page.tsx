import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Faça seu Cadastro",
  description:
    "Cadastre-se para acessar preços especiais e benefícios exclusivos",
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

export default function FacaSeuCadastroPage() {
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
              Cadastre-se e Acesse Benefícios Exclusivos
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Torne-se um parceiro oficial e tenha acesso a preços especiais,
                condições diferenciadas de pagamento e suporte comercial
                dedicado. Nosso programa de parceiros é ideal para revendedores,
                decoradores e empresas do setor.
              </p>
              <p className="mb-5 lg:mb-9">
                O processo de cadastro é simples e rápido. Após a aprovação,
                você terá acesso a uma plataforma exclusiva com catálogo
                completo, preços diferenciados e ferramentas de apoio às vendas.
              </p>
              <p>
                Entre em contato com nossa equipe comercial para iniciar seu
                cadastro. Nossos consultores irão orientá-lo sobre documentação
                necessária, benefícios disponíveis e como maximizar suas
                oportunidades de negócio.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
