import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const defaultSEOConfig = {
    title: 'Ameet - Video Conferencing App',
    description: 'Join secure and reliable video meetings with Ameet.',
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      site_name: 'Ameet',
      title: 'Ameet - Video Conferencing App',
      description: 'Join secure and reliable video meetings with Ameet.',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/icons/opengraph.png`,
          width: 1200,
          height: 630,
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

  return (
    <>
      <DefaultSeo {...defaultSEOConfig} />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
