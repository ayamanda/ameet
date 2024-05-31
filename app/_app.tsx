import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const defaultSEOConfig = {
    title: 'Ameet - Video Conferencing App',
    description: 'Join secure and reliable video meetings with Ameet.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      site_name: 'Ameet',
      title: 'Ameet - Video Conferencing App',
      description: 'Join secure and reliable video meetings with Ameet.',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/icons/logo.svg`,
          width: 800,
          height: 600,
          alt: 'Ameet Logo',
        },
      ],
    },
    twitter: {
      handle: '@ameet',
      site: '@ameet',
      cardType: 'summary_large_image',
    },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ameet",
    "url": process.env.NEXT_PUBLIC_BASE_URL,
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL}/icons/logo.svg`,
    "sameAs": [
      "https://twitter.com/ameet",
      "https://www.facebook.com/ameet",
      "https://www.linkedin.com/company/ameet"
    ],
  };

  return (
    <>
      <DefaultSeo {...defaultSEOConfig} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
