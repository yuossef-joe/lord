import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  pageTitle: string;
}

export default function Header({ pageTitle }: HeaderProps) {
  const { admin, logout } = useAuth();

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: Page Title */}
      <h1 className="text-xl font-semibold text-navy">{pageTitle}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-medium text-white">
            {admin?.name ? getInitials(admin.name) : "??"}
          </div>

          {/* Name & Email */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-navy">{admin?.name}</span>
            <span className="text-xs text-gray-500">{admin?.email}</span>
          </div>

          {/* Dropdown trigger (visual only) */}
          <button type="button" className="flex items-center">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
