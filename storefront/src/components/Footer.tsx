"use client"

import { useParams, usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NewsletterForm } from "@/components/NewsletterForm"
import { LocalizedLink } from "@/components/LocalizedLink"
import { FooterLogoSVG } from "@/components/FooterSVGs"

export const Footer: React.FC = () => {
  const pathName = usePathname()
  const { countryCode } = useParams()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  const isAuthPage = currentPath === "/register" || currentPath === "/login"

  return (
    <div
      className={twMerge(
        "bg-footer-bg text-white py-8 md:py-20",
        isAuthPage && "hidden"
      )}
    >
      <Layout>
        <LayoutColumn className="col-span-13">
          <div className="flex max-lg:flex-col justify-between md:gap-20 max-md:px-4 lg:items-start">
            <div className="flex flex-1 max-lg:w-full max-lg:order-2 max-sm:flex-col justify-between sm:gap-30 lg:gap-20 md:items-start">
              <div className="max-w-35 max-md:mb-9 mr-12 lg:mr-16 flex flex-col items-center">
                <FooterLogoSVG />
                <p className="text-xs mt-2">
                  &copy; {new Date().getFullYear()}, Orla da Praia
                </p>
              </div>
              <div className="flex gap-10 xl:gap-18 max-md:text-xs justify-between lg:justify-center">
                <ul className="flex flex-col gap-6 md:gap-3.5">
                  <li>
                    <strong>Institucional</strong>
                  </li>
                  <li>
                    <LocalizedLink href="/about">Sobre nós</LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/guia-de-cuidados">
                      Guia de cuidados
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/devolucao-ou-troca">
                      Devolução ou troca
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/garantia">Garantia</LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/pagamento">Pagamento</LocalizedLink>
                  </li>
                </ul>
                <ul className="flex flex-col gap-6 md:gap-3.5">
                  <li>
                    <strong>Atacado</strong>
                  </li>
                  <li>
                    <LocalizedLink href="/atacado/politicas">
                      Políticas para compra
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/atacado/cadastro">
                      Faça seu cadastro
                    </LocalizedLink>
                  </li>
                </ul>
                <ul className="flex flex-col gap-6 md:gap-3.5">
                  <li>
                    <strong>Fale conosco</strong>
                  </li>
                  <li>
                    <LocalizedLink href="/contato/telefone">
                      Telefone
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/contato/email">E-mail</LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/contato/redes-sociais">
                      Redes sociais
                    </LocalizedLink>
                  </li>
                </ul>
                <ul className="flex flex-col gap-6 md:gap-3.5">
                  <li>
                    <strong>Promoções</strong>
                  </li>
                  <li>
                    <LocalizedLink href="/promocoes/cupons">
                      Cupons
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/promocoes/programas-de-desconto">
                      Programas de desconto
                    </LocalizedLink>
                  </li>
                </ul>
              </div>
            </div>

            <NewsletterForm className="flex-1 max-lg:w-full lg:max-w-90 xl:max-w-96 max-lg:order-1 max-md:mb-16" />
          </div>
        </LayoutColumn>
      </Layout>
    </div>
  )
}
