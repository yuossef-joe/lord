"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PageTransition from "@/components/common/PageTransition";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { fetchContentPage } from "@/lib/api";

type CmsContentPage = {
  pageKey: string;
  title: string;
  titleAr?: string;
  content?: {
    title?: string;
    titleAr?: string;
    body?: string;
    bodyAr?: string;
  };
  seo?: {
    metaTitle?: string;
    metaTitleAr?: string;
    metaDescription?: string;
    metaDescriptionAr?: string;
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
  };
};

interface ContentPageViewProps {
  pageKey: string;
  fallbackTitleKey: string;
}

export default function ContentPageView({
  pageKey,
  fallbackTitleKey,
}: ContentPageViewProps) {
  const { t, localize } = useLanguage();
  const [page, setPage] = useState<CmsContentPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchContentPage(pageKey)
      .then((response) => {
        const data = response as { data?: CmsContentPage };
        setPage(data.data ?? null);
      })
      .catch(() => setPage(null))
      .finally(() => setIsLoading(false));
  }, [pageKey]);

  const title =
    localize(page?.content?.title, page?.content?.titleAr) ||
    localize(page?.title, page?.titleAr) ||
    t(fallbackTitleKey);
  const body = localize(page?.content?.body, page?.content?.bodyAr);
  const seoTitle =
    localize(page?.seo?.metaTitle, page?.seo?.metaTitleAr) ||
    localize(page?.seo?.title, page?.seo?.titleAr) ||
    title;
  const seoDescription =
    localize(page?.seo?.metaDescription, page?.seo?.metaDescriptionAr) ||
    localize(page?.seo?.description, page?.seo?.descriptionAr) ||
    title;

  return (
    <PageTransition>
      <SeoHead title={`${seoTitle} | Lord`} description={seoDescription} />

      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[{ label: t("nav.home"), href: "/" }, { label: title }]}
        />

        {isLoading ? (
          <div className="flex min-h-[45vh] items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <article className="mx-auto mt-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-lord-navy md:text-4xl">
              {title}
            </h1>
            <div className="mt-6 rounded-card border border-[#E8EAED] bg-white p-6 shadow-sm md:p-8">
              {body ? (
                <div className="whitespace-pre-line text-base leading-8 text-dark-charcoal">
                  {body}
                </div>
              ) : (
                <p className="text-medium-gray">{t("general.noResults")}</p>
              )}
            </div>
          </article>
        )}
      </div>
    </PageTransition>
  );
}
