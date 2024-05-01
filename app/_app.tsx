import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const defaultSEOConfig = {
    title: 'Ameet - Video Conferencing App',
    description: 'Join secure and reliable video meetings with Ameet.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      name: 'Ameet',
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
  };

  return (
    <>
      <DefaultSeo {...defaultSEOConfig} />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;