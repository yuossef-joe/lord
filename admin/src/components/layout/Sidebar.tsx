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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", end: true },
  { label: "Orders", icon: ShoppingBag, path: "/orders" },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Brands & Categories", icon: Layers, path: "/brands" },
  { label: "Services", icon: Wrench, path: "/services" },
  { label: "Inquiries & Requests", icon: MessageSquare, path: "/inquiries" },
  { label: "Coupons & Promos", icon: Tag, path: "/coupons" },
  { label: "Content Pages", icon: FileText, path: "/content" },
  { label: "Testimonials", icon: Star, path: "/testimonials" },
  { label: "FAQs", icon: HelpCircle, path: "/faqs" },
];

const settingsItem = { label: "Settings", icon: Settings, path: "/settings" };

export default function Sidebar() {
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
            <span>{item.label}</span>
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
          <span>{settingsItem.label}</span>
        </NavLink>
      </nav>

      {/* Version */}
      <div className="p-6 text-xs text-white/30">v1.0.0</div>
    </aside>
  );
}
