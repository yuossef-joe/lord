import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Wrench,
  MessageSquare,
  Tag,
  FileText,
  Star,
  HelpCircle,
  Settings,
  Truck,
} from "lucide-react";
import { useLanguage, type TranslationKey } from "@/context/LanguageContext";

const navItems = [
  { labelKey: "nav.dashboard", icon: LayoutDashboard, path: "/", end: true },
  { labelKey: "nav.orders", icon: ShoppingBag, path: "/orders" },
  { labelKey: "nav.customers", icon: Users, path: "/customers" },
  { labelKey: "nav.products", icon: Package, path: "/products" },
  { labelKey: "nav.brands", icon: Layers, path: "/brands" },
  { labelKey: "nav.services", icon: Wrench, path: "/services" },
  { labelKey: "nav.inquiries", icon: MessageSquare, path: "/inquiries" },
  { labelKey: "nav.shipping", icon: Truck, path: "/shipping" },
  { labelKey: "nav.coupons", icon: Tag, path: "/coupons" },
  { labelKey: "nav.content", icon: FileText, path: "/content" },
  { labelKey: "nav.testimonials", icon: Star, path: "/testimonials" },
  { labelKey: "nav.faqs", icon: HelpCircle, path: "/faqs" },
];

const settingsItem = {
  labelKey: "nav.settings" as TranslationKey,
  icon: Settings,
  path: "/settings",
};

export default function Sidebar() {
  const { t } = useLanguage();

  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col bg-sidebar-bg text-white/70">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold">
          <span className="text-teal">Lord</span>
          <span className="text-white/90">CMS</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex h-10 items-center gap-3 text-sm transition-colors ${
                isActive
                  ? "border-l-[3px] border-teal bg-sidebar-hover pl-[21px] pr-6 text-white"
                  : "px-6 text-white/70 hover:bg-sidebar-hover hover:text-white/90"
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{t(item.labelKey as TranslationKey)}</span>
          </NavLink>
        ))}

        {/* Separator */}
        <div className="my-2 border-t border-white/10" />

        <NavLink
          to={settingsItem.path}
          className={({ isActive }) =>
            `flex h-10 items-center gap-3 text-sm transition-colors ${
              isActive
                ? "border-l-[3px] border-teal bg-sidebar-hover pl-[21px] pr-6 text-white"
                : "px-6 text-white/70 hover:bg-sidebar-hover hover:text-white/90"
            }`
          }
        >
          <settingsItem.icon className="h-4 w-4 flex-shrink-0" />
          <span>{t(settingsItem.labelKey)}</span>
        </NavLink>
      </nav>

      {/* Version */}
      <div className="p-6 text-xs text-white/30">v1.0.0</div>
    </aside>
  );
}
