import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FileX } from "lucide-react";
import Card from "./Card";
import EmptyState from "./EmptyState";

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found",
  emptyIcon,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [animateRef] = useAutoAnimate();

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody ref={animateRef} className="divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <td
                      key={`skeleton-${rowIndex}-${colIndex}`}
                      className="px-6 py-4"
                    >
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    icon={emptyIcon || <FileX size={28} />}
                    title={emptyMessage}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
