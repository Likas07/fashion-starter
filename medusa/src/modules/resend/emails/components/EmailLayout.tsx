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
} from '@react-email/components';

// Google Font API is used to load the Mona Sans font
// You can find other variants here: https://webfonts.googleapis.com/v1/webfonts?capability=WOFF2&family=Mona%20Sans&subset=latin-ext&key=[YOUR_API_KEY]
export default function EmailLayout(props: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Mona Sans"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/monasans/v1/o-0mIpQmx24alC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99Y41P6zHtY.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Mona Sans"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/monasans/v1/o-0kIpQmx24alC5A4PNr4C5OaxRsfNNlKbCePevHtVtX57DGjDU1QDce6VLYyWtY1rI.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="italic"
        />
        <Font
          fontFamily="Mona Sans"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/monasans/v1/o-0mIpQmx24alC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAjBN9Y41P6zHtY.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Mona Sans"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/monasans/v1/o-0kIpQmx24alC5A4PNr4C5OaxRsfNNlKbCePevHtVtX57DGjDU1QOkZ6VLYyWtY1rI.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="italic"
        />
        <Font
          fontFamily="Mona Sans"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/monasans/v1/o-0mIpQmx24alC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAaBN9Y41P6zHtY.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Mona Sans"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/monasans/v1/o-0kIpQmx24alC5A4PNr4C5OaxRsfNNlKbCePevHtVtX57DGjDU1QNAZ6VLYyWtY1rI.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="italic"
        />
      </Head>
      <Tailwind
        config={{
          theme: {
            fontFamily: {
              sans: 'Mona Sans',
            },
            extend: {
              spacing: {
                22: '5.5rem',
              },
              colors: {
                grayscale: {
                  500: '#808080',
                  200: '#D1D1D1',
                  50: '#F4F4F4',
                },
              },
              borderRadius: {
                xs: '4px',
                sm: '16px',
              },
              maxWidth: {
                37: '9.25rem',
                228: '57rem',
              },
              fontSize: {
                '3xl': '3.5rem',
                '2xl': '3rem',
                xl: '2.5rem',
                lg: '2rem',
                md: '1.5rem',
                sm: '1.125rem',
                base: '1rem',
                xs: '0.75rem',
              },
            },
          },
        }}
      >
        <Body className="bg-grayscale-50 font-normal">
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
