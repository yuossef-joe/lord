"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import ImageGallery from "@/components/products/ImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import AddToCartSection from "@/components/products/AddToCartSection";
import SpecsTable from "@/components/products/SpecsTable";
import RelatedProducts from "@/components/products/RelatedProducts";
import SeoHead from "@/components/common/SeoHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { fetchProductBySlug } from "@/lib/api";
import { Product } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, localize } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(false);
    fetchProductBySlug(slug)
      .then((data) => {
        const d = data as { data: Product };
        setProduct(d.data);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-lord-navy mb-2">
          Product Not Found
        </p>
        <p className="text-medium-gray">
          The product you are looking for does not exist.
        </p>
      </div>
    );
  }

  const productName = localize(product.name, product.nameAr);
  const productDescription = localize(product.description, product.descriptionAr);
  const productShortDescription = localize(
    product.shortDescription,
    product.shortDescriptionAr,
  );
  const localizedFeatures =
    product.features
      ?.map((feature, index) => localize(feature, product.featuresAr?.[index]))
      .filter(Boolean) ?? [];

  const breadcrumbItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/products" },
    { label: productName },
  ];

  return (
    <PageTransition>
      <SeoHead
        title={`${productName} | Lord`}
        description={productShortDescription || productName}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: productName,
          description: productShortDescription,
          image: product.images?.[0]?.url,
          brand: {
            "@type": "Brand",
            name: localize(product.brand?.name, product.brand?.nameAr),
          },
          offers: {
            "@type": "Offer",
            price: product.salePrice || product.price,
            priceCurrency: "EGP",
            availability:
              product.stockQuantity && product.stockQuantity > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }}
      />

      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Main product section */}
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <ImageGallery
            images={product.images || []}
            productName={productName}
          />

          <div className="space-y-6">
            <ProductInfo product={product} />
            <AddToCartSection product={product} />
          </div>
        </div>

        {/* Description */}
        {productDescription && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-lord-navy">
              {t("products.description")}
            </h2>
            <div
              className="prose prose-sm max-w-none text-dark-charcoal"
              dangerouslySetInnerHTML={{ __html: productDescription }}
            />
          </div>
        )}

        {localizedFeatures.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-lord-navy">
              {t("products.features")}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {localizedFeatures.map((feature) => (
                <li
                  key={feature}
                  className="rounded-card border border-[#E8EAED] bg-white px-4 py-3 text-sm text-dark-charcoal"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specs */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-12">
            <SpecsTable specifications={product.specifications} />
          </div>
        )}

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product._id}
          categoryId={
            typeof product.category === "object"
              ? product.category._id
              : undefined
          }
          brandId={
            typeof product.brand === "object" ? product.brand._id : undefined
          }
        />
      </div>
    </PageTransition>
  );
}
