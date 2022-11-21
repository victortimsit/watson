import Head from "next/head";
import { useRouter } from "next/router";

type DynamicHeadProps = {
  title?: string;
  description?: string;
  image_url?: string;
  favicon_url?: string;
};

const DynamicHead = (props: DynamicHeadProps) => {
  const { asPath } = useRouter();

  return (
    <Head key="meta-tags">
      {/* <!-- Primary Meta Tags --> */}
      <title>{props.title}</title>
      <meta name="title" content={props.title} key="title" />
      <meta name="description" content={props.description} key="description" />
      {/* <!-- Primary Meta Tags --> */}
      <link rel="icon" href={props.favicon_url} />
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
      {/* <!-- Splitbee --> */}
      <script async src="https://cdn.splitbee.io/sb.js" />
      <script src="https://unpkg.com/@grammarly/editor-sdk?clientId=client_ArvMjTYZjeXHHuZdMhZHt1"></script>
    </Head>
  );
};

DynamicHead.defaultProps = {
  title: "Watson",
  description: "Improve your English speaking skills by talking to Watson",
  image_url: `${process.env.NEXT_PUBLIC_WEB_URL}/og.png`,
  favicon_url: `${process.env.NEXT_PUBLIC_WEB_URL}/favicon.ico`,
};

export default DynamicHead;
