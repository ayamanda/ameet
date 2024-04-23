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
          url: 'https://res.cloudinary.com/dql0zlcgp/image/upload/v1713865277/logo_Logo_wd3fo9.svg',
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