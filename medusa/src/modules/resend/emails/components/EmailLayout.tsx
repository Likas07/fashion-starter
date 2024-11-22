// External packages
import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export default function EmailLayout(props: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Mona Sans"
          fallbackFontFamily="serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              spacing: {
                22: "5.5rem",
              },
              colors: {
                grayscale: {
                  500: "#808080",
                  200: "#D1D1D1",
                  50: "#F4F4F4",
                },
              },
              borderRadius: {
                xs: "4px",
                sm: "16px",
              },
              maxWidth: {
                37: "9.25rem",
                228: "57rem",
              },
              fontSize: {
                "3xl": "3.5rem",
                "2xl": "3rem",
                xl: "2.5rem",
                lg: "2rem",
                md: "1.5rem",
                sm: "1.125rem",
                base: "1rem",
                xs: "0.75rem",
              },
            },
          },
        }}>
        <Body className="bg-grayscale-50">
          <Container className="bg-white py-20 px-22 rounded-sm max-w-228 w-full">
            <Link href="/" className="text-md mb-20 inline-block text-black">
              SofaSocietyCo.
            </Link>
            {props.children}
            <Hr className="mt-20 mb-10" />
            <Section className="gap-4 text-grayscale-500">
              <Row>
                <Column className="w-full">
                  <Link href="/" className="text-grayscale-500">
                    SofaSocietyCo.
                  </Link>
                  <Text className="text-xs m-0">© 2024, Sofa Society</Text>
                </Column>
                <Column valign="top">
                  <Row>
                    <Column className="px-2">
                      <Link href="/" className="text-grayscale-500">
                        Instagram
                      </Link>
                    </Column>
                    <Column className="px-2">
                      <Link href="/" className="text-grayscale-500">
                        TikTok
                      </Link>
                    </Column>
                    <Column className="px-2">
                      <Link href="/" className="text-grayscale-500">
                        Pinterest
                      </Link>
                    </Column>
                    <Column className="px-2">
                      <Link href="/" className="text-grayscale-500">
                        Facebook
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
