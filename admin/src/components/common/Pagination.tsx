import Button from "./Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-gray-400 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "h-8 w-8 rounded-md text-sm font-medium transition",
                page === currentPage
                  ? "bg-teal text-white"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {page}
            </button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
