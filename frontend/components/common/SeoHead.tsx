import React from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl?: string;
  jsonLd?: Record<string, unknown>;
}

export default function SeoHead({
  title,
  description,
  ogImage,
  ogUrl,
  jsonLd,
}: SeoHeadProps) {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}

export function generateMetadata({
  title,
  description,
  ogImage,
  ogUrl,
}: {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl?: string;
}) {
  return {
    title: `${title} | Lord AC`,
    description,
    openGraph: {
      title: `${title} | Lord AC`,
      description,
      ...(ogImage && { images: [{ url: ogImage }] }),
      ...(ogUrl && { url: ogUrl }),
    },
  };
}
