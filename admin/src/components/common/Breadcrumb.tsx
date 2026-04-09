import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            {isLast || !item.href ? (
              <span className="font-medium text-navy">{item.label}</span>
            ) : (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-teal transition"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
