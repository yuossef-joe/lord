import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ContentPage as ContentPageType } from "@/types";
import { formatDate } from "@/lib/utils";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import ConfirmDialog from "@/components/common/ConfirmDialog";

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
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const MOCK_CONTENT_PAGES: ContentPageType[] = [
  {
    id: "cp1",
    pageKey: "about-us",
    content: {
      title: "About Us",
      slug: "about-us",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      isPublished: true,
      seoTitle: "About Lord AC - Premium Air Conditioning Solutions",
      seoDescription:
        "Learn about Lord AC, Egypt's leading provider of premium air conditioning solutions.",
    },
    seo: {
      metaTitle: "About Lord AC - Premium Air Conditioning Solutions",
      metaDescription:
        "Learn about Lord AC, Egypt's leading provider of premium air conditioning solutions.",
    },
    updatedAt: "2024-08-15T10:00:00Z",
  },
  {
    id: "cp2",
    pageKey: "privacy-policy",
    content: {
      title: "Privacy Policy",
      slug: "privacy-policy",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue.",
      isPublished: true,
      seoTitle: "Privacy Policy - Lord AC",
      seoDescription:
        "Read our privacy policy to understand how we collect and use your data.",
    },
    seo: {
      metaTitle: "Privacy Policy - Lord AC",
      metaDescription:
        "Read our privacy policy to understand how we collect and use your data.",
    },
    updatedAt: "2024-07-20T14:30:00Z",
  },
  {
    id: "cp3",
    pageKey: "terms-and-conditions",
    content: {
      title: "Terms & Conditions",
      slug: "terms-and-conditions",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.",
      isPublished: false,
      seoTitle: "",
      seoDescription: "",
    },
    updatedAt: "2024-06-10T08:00:00Z",
  },
];

/* ------------------------------------------------------------------ */
/*  Form schema                                                       */
/* ------------------------------------------------------------------ */

const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  body: z.string().min(1, "Content is required"),
  isPublished: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white";

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function ContentPage() {
  const [pages, setPages] = useState(MOCK_CONTENT_PAGES);
  const [editingPage, setEditingPage] = useState<ContentPageType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContentPageType | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
  });

  /* ---------- handlers ---------- */

  const openCreate = () => {
    setEditingPage(null);
    reset({
      title: "",
      slug: "",
      body: "",
      isPublished: true,
      seoTitle: "",
      seoDescription: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (page: ContentPageType) => {
    setEditingPage(page);
    reset({
      title:
        ((page.content as Record<string, unknown>).title as string) ??
        page.pageKey,
      slug:
        ((page.content as Record<string, unknown>).slug as string) ??
        page.pageKey,
      body: ((page.content as Record<string, unknown>).body as string) ?? "",
      isPublished:
        ((page.content as Record<string, unknown>).isPublished as boolean) ??
        true,
      seoTitle: page.seo?.metaTitle ?? "",
      seoDescription: page.seo?.metaDescription ?? "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: ContentFormValues) => {
    if (editingPage) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingPage.id
            ? {
                ...p,
                pageKey: data.slug,
                content: {
                  title: data.title,
                  slug: data.slug,
                  body: data.body,
                  isPublished: data.isPublished,
                  seoTitle: data.seoTitle,
                  seoDescription: data.seoDescription,
                },
                seo: {
                  metaTitle: data.seoTitle,
                  metaDescription: data.seoDescription,
                },
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      );
    } else {
      const newPage: ContentPageType = {
        id: `cp${Date.now()}`,
        pageKey: data.slug,
        content: {
          title: data.title,
          slug: data.slug,
          body: data.body,
          isPublished: data.isPublished,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
        },
        seo: { metaTitle: data.seoTitle, metaDescription: data.seoDescription },
        updatedAt: new Date().toISOString(),
      };
      setPages((prev) => [...prev, newPage]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ---------- helpers ---------- */

  const getTitle = (page: ContentPageType) =>
    ((page.content as Record<string, unknown>).title as string) ?? page.pageKey;

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
            { label: "Dashboard", href: "/" },
            { label: "Content Pages" },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Content Pages</h1>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />}>
          Add Page
        </Button>
      </motion.div>

      {/* Card list */}
      <div className="space-y-4">
        {pages.map((page) => (
          <motion.div key={page.id} variants={itemVariants}>
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-gray-900">
                      {getTitle(page)}
                    </span>
                    <Badge variant={isPublished(page) ? "success" : "default"}>
                      {isPublished(page) ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-2">
                    /{getSlug(page)}
                  </p>
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
                  <button
                    onClick={() => setDeleteTarget(page)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? "Edit Page" : "Add Page"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          <FormField label="Title" required error={errors.title?.message}>
            <input
              {...register("title")}
              className={inputStyles}
              placeholder="Page title"
            />
          </FormField>

          <FormField label="Slug" required error={errors.slug?.message}>
            <input
              {...register("slug")}
              className={inputStyles}
              placeholder="page-slug"
            />
          </FormField>

          <FormField label="Content" required error={errors.body?.message}>
            <textarea
              {...register("body")}
              className={`${inputStyles} h-48 resize-none py-2`}
              placeholder="Page content…"
            />
          </FormField>

          <FormField label="Published">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isPublished")}
                className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
              />
              <span className="text-sm text-gray-700">Publish this page</span>
            </label>
          </FormField>

          <FormField label="SEO Title" error={errors.seoTitle?.message}>
            <input
              {...register("seoTitle")}
              className={inputStyles}
              placeholder="SEO title"
            />
          </FormField>

          <FormField
            label="SEO Description"
            error={errors.seoDescription?.message}
          >
            <textarea
              {...register("seoDescription")}
              className={`${inputStyles} h-20 resize-none py-2`}
              placeholder="SEO description…"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingPage ? "Save Changes" : "Create Page"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Page"
        message={`Are you sure you want to delete "${deleteTarget ? getTitle(deleteTarget) : ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
