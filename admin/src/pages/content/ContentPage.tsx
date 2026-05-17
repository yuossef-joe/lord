import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";
import type { ContentPage as ContentPageType } from "@/types";
import {
  createContentPage,
  fetchContentPages,
  updateContentPage,
} from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import { useLanguage } from "@/context/LanguageContext";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Form schema                                                       */
/* ------------------------------------------------------------------ */

const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleAr: z.string().optional(),
  body: z.string().optional(),
  bodyAr: z.string().optional(),
  heroHeadline: z.string().optional(),
  heroHeadlineAr: z.string().optional(),
  heroTagline: z.string().optional(),
  heroTaglineAr: z.string().optional(),
  featuredTitle: z.string().optional(),
  featuredTitleAr: z.string().optional(),
  servicesTitle: z.string().optional(),
  servicesTitleAr: z.string().optional(),
  whyTitle: z.string().optional(),
  whyTitleAr: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  testimonialsTitleAr: z.string().optional(),
  ctaHeadline: z.string().optional(),
  ctaHeadlineAr: z.string().optional(),
  isPublished: z.boolean(),
  seoTitle: z.string().optional(),
  seoTitleAr: z.string().optional(),
  seoDescription: z.string().optional(),
  seoDescriptionAr: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;
type EditableContentPage = ContentPageType & { isNew?: boolean };

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white";

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function ContentPage() {
  const { t } = useLanguage();
  const [pages, setPages] = useState<ContentPageType[]>([]);
  const [editingPage, setEditingPage] = useState<EditableContentPage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
  });

  /* ---------- handlers ---------- */

  useEffect(() => {
    void fetchContentPages().then((response) => setPages(response.data));
  }, []);

  const getHomePage = (): EditableContentPage => {
    const existing = pages.find((page) => page.pageKey === "home");
    if (existing) return existing;
    return {
      id: "new-home",
      pageKey: "home",
      title: "Home Page",
      titleAr: "الصفحة الرئيسية",
      content: {
        title: "Home Page",
        titleAr: "الصفحة الرئيسية",
        heroHeadline: "Authorized Carrier & Midea Dealer",
        heroHeadlineAr: "وكيل معتمد لكاريير وميديا",
        heroTagline: "Air Conditioning — Since 1986",
        heroTaglineAr: "تكييف الهواء — منذ ١٩٨٦",
        featuredTitle: "Featured Products",
        featuredTitleAr: "منتجات مميزة",
        servicesTitle: "Our Services",
        servicesTitleAr: "خدماتنا",
        whyTitle: "Why Choose Lord",
        whyTitleAr: "لماذا تختار لورد",
        testimonialsTitle: "What Our Customers Say",
        testimonialsTitleAr: "ماذا يقول عملاؤنا",
        ctaHeadline: "Need help choosing? Request a free consultation",
        ctaHeadlineAr: "تحتاج مساعدة في الاختيار؟ اطلب استشارة مجانية",
        isPublished: true,
      },
      seo: {
        metaTitle: "Lord AC — Authorized Carrier & Midea Dealer",
        metaTitleAr: "لورد للتكييف — وكيل معتمد لكاريير وميديا",
        metaDescription:
          "Lord Air Conditioning — Authorized Carrier & Midea dealer in Egypt since 1986.",
        metaDescriptionAr:
          "لورد لتكييف الهواء — وكيل معتمد لكاريير وميديا في مصر منذ ١٩٨٦.",
      },
      updatedAt: new Date().toISOString(),
      isNew: true,
    };
  };

  const openEdit = (page: EditableContentPage) => {
    const content = page.content as Record<string, unknown>;
    setEditingPage(page);
    reset({
      title: (content.title as string) ?? page.title ?? page.pageKey,
      titleAr: (content.titleAr as string) ?? page.titleAr ?? "",
      body: (content.body as string) ?? "",
      bodyAr: (content.bodyAr as string) ?? "",
      heroHeadline: (content.heroHeadline as string) ?? "",
      heroHeadlineAr: (content.heroHeadlineAr as string) ?? "",
      heroTagline: (content.heroTagline as string) ?? "",
      heroTaglineAr: (content.heroTaglineAr as string) ?? "",
      featuredTitle: (content.featuredTitle as string) ?? "",
      featuredTitleAr: (content.featuredTitleAr as string) ?? "",
      servicesTitle: (content.servicesTitle as string) ?? "",
      servicesTitleAr: (content.servicesTitleAr as string) ?? "",
      whyTitle: (content.whyTitle as string) ?? "",
      whyTitleAr: (content.whyTitleAr as string) ?? "",
      testimonialsTitle: (content.testimonialsTitle as string) ?? "",
      testimonialsTitleAr: (content.testimonialsTitleAr as string) ?? "",
      ctaHeadline: (content.ctaHeadline as string) ?? "",
      ctaHeadlineAr: (content.ctaHeadlineAr as string) ?? "",
      isPublished:
        (content.isPublished as boolean) ?? true,
      seoTitle: page.seo?.metaTitle ?? page.seo?.title ?? "",
      seoTitleAr: page.seo?.metaTitleAr ?? page.seo?.titleAr ?? "",
      seoDescription: page.seo?.metaDescription ?? page.seo?.description ?? "",
      seoDescriptionAr:
        page.seo?.metaDescriptionAr ?? page.seo?.descriptionAr ?? "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ContentFormValues) => {
    if (!editingPage) return;
    const isHome = editingPage.pageKey === "home";
    const payload = {
      pageKey: editingPage.pageKey,
      title: data.title,
      titleAr: data.titleAr,
      content: {
        ...editingPage.content,
        title: data.title,
        titleAr: data.titleAr,
        slug: editingPage.pageKey,
        ...(isHome
          ? {
              heroHeadline: data.heroHeadline,
              heroHeadlineAr: data.heroHeadlineAr,
              heroTagline: data.heroTagline,
              heroTaglineAr: data.heroTaglineAr,
              featuredTitle: data.featuredTitle,
              featuredTitleAr: data.featuredTitleAr,
              servicesTitle: data.servicesTitle,
              servicesTitleAr: data.servicesTitleAr,
              whyTitle: data.whyTitle,
              whyTitleAr: data.whyTitleAr,
              testimonialsTitle: data.testimonialsTitle,
              testimonialsTitleAr: data.testimonialsTitleAr,
              ctaHeadline: data.ctaHeadline,
              ctaHeadlineAr: data.ctaHeadlineAr,
            }
          : {
              body: data.body,
              bodyAr: data.bodyAr,
            }),
        isPublished: data.isPublished,
      },
      seo: {
        metaTitle: data.seoTitle,
        metaTitleAr: data.seoTitleAr,
        metaDescription: data.seoDescription,
        metaDescriptionAr: data.seoDescriptionAr,
      },
      isActive: data.isPublished,
    };
    if (editingPage.isNew) {
      await createContentPage(payload);
    } else {
      await updateContentPage(editingPage.id, payload);
    }
    const response = await fetchContentPages();
    setPages(response.data);
    setIsModalOpen(false);
  };

  /* ---------- helpers ---------- */

  const getTitle = (page: ContentPageType) =>
    ((page.content as Record<string, unknown>).title as string) ??
    page.title ??
    page.pageKey;

  const getTitleAr = (page: ContentPageType) =>
    ((page.content as Record<string, unknown>).titleAr as string) ??
    page.titleAr;

  const getSlug = (page: ContentPageType) =>
    ((page.content as Record<string, unknown>).slug as string) ?? page.pageKey;

  const isPublished = (page: ContentPageType) =>
    ((page.content as Record<string, unknown>).isPublished as boolean) ?? false;

  /* ---------- render ---------- */

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: t("common.dashboard"), href: "/" },
            { label: t("common.contentPages") },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">
          {t("common.contentPages")}
        </h1>
      </motion.div>

      {/* Card list */}
      <div className="space-y-4">
        {[getHomePage(), ...pages.filter((page) => page.pageKey !== "home")].map((page) => (
          <motion.div key={page.id} variants={itemVariants}>
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-gray-900">
                      {getTitle(page)}
                    </span>
                    <Badge variant={isPublished(page) ? "success" : "default"}>
                      {isPublished(page)
                        ? t("common.published")
                        : t("common.draft")}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-2">
                    /{getSlug(page)}
                  </p>
                  {getTitleAr(page) && (
                    <p className="text-sm text-gray-600 mb-2" dir="rtl">
                      {getTitleAr(page)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Last updated: {formatDate(page.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => openEdit(page)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("common.editPage")}
        size="xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          <FormField label={t("common.title")} required error={errors.title?.message}>
            <input
              {...register("title")}
              className={inputStyles}
              placeholder={t("common.pageTitlePlaceholder")}
            />
          </FormField>

          <FormField label={t("common.arabicTitle")} error={errors.titleAr?.message}>
            <input
              {...register("titleAr")}
              className={inputStyles}
              dir="rtl"
              placeholder={t("common.arabicPageTitlePlaceholder")}
            />
          </FormField>

          {editingPage?.pageKey === "home" ? (
            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-navy">
                {t("common.homePageContent")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t("common.heroHeadline")}>
                  <input
                    {...register("heroHeadline")}
                    className={inputStyles}
                    placeholder={t("common.heroHeadline")}
                  />
                </FormField>
                <FormField label={t("common.arabicHeroHeadline")}>
                  <input
                    {...register("heroHeadlineAr")}
                    className={inputStyles}
                    dir="rtl"
                    placeholder={t("common.arabicHeroHeadline")}
                  />
                </FormField>
                <FormField label={t("common.heroTagline")}>
                  <input
                    {...register("heroTagline")}
                    className={inputStyles}
                    placeholder={t("common.heroTagline")}
                  />
                </FormField>
                <FormField label={t("common.arabicHeroTagline")}>
                  <input
                    {...register("heroTaglineAr")}
                    className={inputStyles}
                    dir="rtl"
                    placeholder={t("common.arabicHeroTagline")}
                  />
                </FormField>
                <FormField label={t("common.featuredProductsTitle")}>
                  <input
                    {...register("featuredTitle")}
                    className={inputStyles}
                    placeholder={t("common.featuredProductsTitle")}
                  />
                </FormField>
                <FormField label={t("common.arabicFeaturedProductsTitle")}>
                  <input
                    {...register("featuredTitleAr")}
                    className={inputStyles}
                    dir="rtl"
                    placeholder={t("common.arabicFeaturedProductsTitle")}
                  />
                </FormField>
                <FormField label={t("common.servicesTitle")}>
                  <input
                    {...register("servicesTitle")}
                    className={inputStyles}
                    placeholder={t("common.servicesTitle")}
                  />
                </FormField>
                <FormField label={t("common.arabicServicesTitle")}>
                  <input
                    {...register("servicesTitleAr")}
                    className={inputStyles}
                    dir="rtl"
                    placeholder={t("common.arabicServicesTitle")}
                  />
                </FormField>
                <FormField label={t("common.whyChooseTitle")}>
                  <input
                    {...register("whyTitle")}
                    className={inputStyles}
                    placeholder={t("common.whyChooseTitle")}
                  />
                </FormField>
                <FormField label={t("common.arabicWhyChooseTitle")}>
                  <input
                    {...register("whyTitleAr")}
                    className={inputStyles}
                    dir="rtl"
                    placeholder={t("common.arabicWhyChooseTitle")}
                  />
                </FormField>
                <FormField label={t("common.testimonialsTitle")}>
                  <input
                    {...register("testimonialsTitle")}
                    className={inputStyles}
                    placeholder={t("common.testimonialsTitle")}
                  />
                </FormField>
                <FormField label={t("common.arabicTestimonialsTitle")}>
                  <input
                    {...register("testimonialsTitleAr")}
                    className={inputStyles}
                    dir="rtl"
                    placeholder={t("common.arabicTestimonialsTitle")}
                  />
                </FormField>
                <FormField label={t("common.ctaHeadline")}>
                  <input
                    {...register("ctaHeadline")}
                    className={inputStyles}
                    placeholder={t("common.ctaHeadline")}
                  />
                </FormField>
                <FormField label={t("common.arabicCtaHeadline")}>
                  <input
                    {...register("ctaHeadlineAr")}
                    className={inputStyles}
                    dir="rtl"
                    placeholder={t("common.arabicCtaHeadline")}
                  />
                </FormField>
              </div>
            </div>
          ) : (
            <>
              <FormField label={t("common.content")} error={errors.body?.message}>
                <textarea
                  {...register("body")}
                  className={`${inputStyles} h-48 resize-none py-2`}
                  placeholder={t("common.pageContentPlaceholder")}
                />
              </FormField>

              <FormField label={t("common.arabicContent")} error={errors.bodyAr?.message}>
                <textarea
                  {...register("bodyAr")}
                  className={`${inputStyles} h-48 resize-none py-2`}
                  dir="rtl"
                  placeholder={t("common.arabicPageContentPlaceholder")}
                />
              </FormField>
            </>
          )}

          <FormField label={t("common.published")}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isPublished")}
                className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
              />
              <span className="text-sm text-gray-700">
                {t("common.publishThisPage")}
              </span>
            </label>
          </FormField>

          <FormField label={t("common.seoTitle")} error={errors.seoTitle?.message}>
            <input
              {...register("seoTitle")}
              className={inputStyles}
              placeholder={t("common.seoTitlePlaceholder")}
            />
          </FormField>

          <FormField label={t("common.arabicSeoTitle")} error={errors.seoTitleAr?.message}>
            <input
              {...register("seoTitleAr")}
              className={inputStyles}
              dir="rtl"
              placeholder={t("common.arabicSeoTitlePlaceholder")}
            />
          </FormField>

          <FormField
            label={t("common.seoDescription")}
            error={errors.seoDescription?.message}
          >
            <textarea
              {...register("seoDescription")}
              className={`${inputStyles} h-20 resize-none py-2`}
              placeholder={t("common.seoDescriptionPlaceholder")}
            />
          </FormField>

          <FormField
            label={t("common.arabicSeoDescription")}
            error={errors.seoDescriptionAr?.message}
          >
            <textarea
              {...register("seoDescriptionAr")}
              className={`${inputStyles} h-20 resize-none py-2`}
              dir="rtl"
              placeholder={t("common.arabicSeoDescriptionPlaceholder")}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {t("common.saveChanges")}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
