import Head from "next/head";
import { useRouter } from "next/router";

type DynamicHeadProps = {
  title?: string;
  description?: string;
  image_url?: string;
  favicon_url?: string;
};

export const DynamicHead = (props: DynamicHeadProps) => {
  const { asPath } = useRouter();

  return (
    <Head key="meta-tags">
      {/* <!-- Primary Meta Tags --> */}
      <title>{props.title}</title>
      <meta name="title" content={props.title} key="title" />
      <meta name="description" content={props.description} key="description" />
      {/* <!-- Primary Meta Tags --> */}
      <link rel="icon" href={props.favicon_url} />
      {/* <!-- Goolge Fonts --> */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* <!-- Open Graph / Facebook --> */}
      <meta name="title" property="og:type" content="website" />
      <meta
        name="url"
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_WEB_URL}${asPath}`}
      />
      <meta
        name="title"
        property="og:title"
        content={props.title}
        /* @ts-ignore */
        search
        eng
        key="og-title"
      />
      <meta
        name="description"
        property="og:description"
        content={props.description}
        key="og-description"
      />
      <meta
        name="image"
        property="og:image"
        content={props.image_url}
        key="og-image"
      />
      {/* <!-- Twitter --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:url"
        content={`${process.env.NEXT_PUBLIC_WEB_URL}${asPath}`}
      />
      <meta name="twitter:title" content={props.title} key="tw-title" />
      <meta
        name="twitter:description"
        content={props.description}
        key="tw-description"
      />
      <meta name="twitter:image" content={props.image_url} key="tw-image" />
      <script src="https://c.dynamite.run/d.js?sid=qAX2Ncp" async></script>
      <link
        rel="stylesheet"
        href="data:text/css;base64,Ym9keXthbmltYXRpb246ZiAwcyAxcyBiYWNrd2FyZHN9QGtleWZyYW1lcyBme2Zyb217b3BhY2l0eTowfXRve29wYWNpdHk6MX19"
      />
    </Head>
  );
};

DynamicHead.defaultProps = {
  title: "Watson",
  description: "Improve your English speaking skills by talking to Watson",
  image_url: `${process.env.NEXT_PUBLIC_WEB_URL}/og.png`,
  favicon_url: `${process.env.NEXT_PUBLIC_WEB_URL}/favicon.ico`,
};
