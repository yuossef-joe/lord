import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Globe, Phone, Mail, Search } from "lucide-react";
import type {
  SiteSettings,
  ContactSettings,
  EmailSettings,
  SeoSettings,
} from "@/types";
import { cn } from "@/lib/utils";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";

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
/*  Input styles                                                      */
/* ------------------------------------------------------------------ */

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white";

/* ------------------------------------------------------------------ */
/*  Tabs                                                              */
/* ------------------------------------------------------------------ */

type SettingsTab =
  | "site"
  | "contact"
  | "email"
  | "seo";

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "site", label: "Site", icon: <Globe size={16} /> },
  { key: "contact", label: "Contact", icon: <Phone size={16} /> },
  { key: "email", label: "Email", icon: <Mail size={16} /> },
  { key: "seo", label: "SEO", icon: <Search size={16} /> },
];

/* ------------------------------------------------------------------ */
/*  Default values                                                    */
/* ------------------------------------------------------------------ */

const defaultSiteSettings: SiteSettings = {
  siteName: "Lord AC",
  tagline:
    "Premium air conditioning solutions for homes and businesses in Egypt.",
  logoUrl: "https://lordac.com/logo.png",
  faviconUrl: "https://lordac.com/favicon.ico",
  defaultLanguage: "en",
  currency: "EGP",
  timezone: "Africa/Cairo",
};

const defaultContactSettings: ContactSettings = {
  phone: "+20 2 1234 5678",
  email: "info@lordac.com",
  whatsapp: "+201001234567",
  address: "15 El-Thawra St, Heliopolis, Cairo, Egypt",
  workingHours: "Sun–Thu 9 AM – 6 PM, Sat 10 AM – 3 PM",
  googleMapsUrl: "https://maps.google.com/?q=Lord+AC+Cairo",
};

const defaultEmailSettings: EmailSettings = {
  smtpHost: "smtp.example.com",
  smtpPort: 587,
  smtpUsername: "noreply@lordac.com",
  smtpPassword: "",
  fromEmail: "noreply@lordac.com",
  fromName: "Lord AC",
};

const defaultSeoSettings: SeoSettings = {
  defaultMetaTitle: "Lord AC - Premium Air Conditioning Solutions in Egypt",
  defaultMetaDescription:
    "Shop the best Carrier and Midea air conditioners in Egypt. Professional installation, maintenance, and repair services.",
  googleAnalyticsId: "",
};

/* ------------------------------------------------------------------ */
/*  Sub-form components                                               */
/* ------------------------------------------------------------------ */

function SiteSettingsForm() {
  const { register, handleSubmit } = useForm<SiteSettings>({
    defaultValues: defaultSiteSettings,
  });

  const onSubmit = () => {
    alert("Settings saved successfully");
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-navy mb-5">Site Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Site Name">
          <input {...register("siteName")} className={inputStyles} />
        </FormField>

        <FormField label="Site Description">
          <textarea
            {...register("tagline")}
            className={`${inputStyles} h-20 resize-none py-2`}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Logo URL">
            <input
              {...register("logoUrl")}
              className={inputStyles}
              placeholder="https://..."
            />
          </FormField>

          <FormField label="Favicon URL">
            <input
              {...register("faviconUrl")}
              className={inputStyles}
              placeholder="https://..."
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Default Language">
            <select
              {...register("defaultLanguage")}
              className={`${inputStyles} appearance-none`}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </FormField>

          <FormField label="Currency">
            <input {...register("currency")} className={inputStyles} />
          </FormField>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

function ContactSettingsForm() {
  const { register, handleSubmit } = useForm<ContactSettings>({
    defaultValues: defaultContactSettings,
  });

  const onSubmit = () => {
    alert("Settings saved successfully");
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-navy mb-5">Contact Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Phone">
            <input {...register("phone")} className={inputStyles} />
          </FormField>

          <FormField label="Email">
            <input
              {...register("email")}
              type="email"
              className={inputStyles}
            />
          </FormField>
        </div>

        <FormField label="WhatsApp">
          <input {...register("whatsapp")} className={inputStyles} />
        </FormField>

        <FormField label="Address">
          <textarea
            {...register("address")}
            className={`${inputStyles} h-20 resize-none py-2`}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Working Hours">
            <input {...register("workingHours")} className={inputStyles} />
          </FormField>

          <FormField label="Google Maps URL">
            <input
              {...register("googleMapsUrl")}
              className={inputStyles}
              placeholder="https://maps.google.com/..."
            />
          </FormField>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

function EmailSettingsForm() {
  const { register, handleSubmit } = useForm<EmailSettings>({
    defaultValues: defaultEmailSettings,
  });

  const onSubmit = () => {
    alert("Settings saved successfully");
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-navy mb-5">Email Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="SMTP Host">
            <input {...register("smtpHost")} className={inputStyles} />
          </FormField>

          <FormField label="SMTP Port">
            <input
              type="number"
              {...register("smtpPort", { valueAsNumber: true })}
              className={inputStyles}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="SMTP Username">
            <input {...register("smtpUsername")} className={inputStyles} />
          </FormField>

          <FormField label="SMTP Password">
            <input
              type="password"
              {...register("smtpPassword")}
              className={inputStyles}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="From Email">
            <input
              {...register("fromEmail")}
              type="email"
              className={inputStyles}
            />
          </FormField>

          <FormField label="From Name">
            <input {...register("fromName")} className={inputStyles} />
          </FormField>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

function SeoSettingsForm() {
  const { register, handleSubmit } = useForm<SeoSettings>({
    defaultValues: defaultSeoSettings,
  });

  const onSubmit = () => {
    alert("Settings saved successfully");
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-navy mb-5">SEO Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Default Meta Title">
          <input {...register("defaultMetaTitle")} className={inputStyles} />
        </FormField>

        <FormField label="Default Meta Description">
          <textarea
            {...register("defaultMetaDescription")}
            className={`${inputStyles} h-20 resize-none py-2`}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Google Analytics ID">
            <input
              {...register("googleAnalyticsId")}
              className={inputStyles}
              placeholder="G-XXXXXXXXXX"
            />
          </FormField>

          <FormField label="Google Search Console Code">
            <input
              {...register("googleSearchConsoleCode")}
              className={inputStyles}
              placeholder="Verification code"
            />
          </FormField>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("site");

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={itemVariants}
        className="border-b border-gray-200 mb-6"
      >
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 border-b-2 pb-2 px-4 text-sm font-medium transition whitespace-nowrap",
                activeTab === tab.key
                  ? "border-teal text-teal"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab content */}
      <motion.div variants={itemVariants}>
        {activeTab === "site" && <SiteSettingsForm />}
        {activeTab === "contact" && <ContactSettingsForm />}
        {activeTab === "email" && <EmailSettingsForm />}
        {activeTab === "seo" && <SeoSettingsForm />}
      </motion.div>
    </motion.div>
  );
}
