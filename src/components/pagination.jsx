import React from "react";
import { Button } from "@/components/ui/button";

export function DataTablePagination({
  page,
  setPage,
  pageCount,
  isLoading,
  selectedRowCount,
  totalItems,
  currentPage,
}) {
  return (
    <div className="flex items-center justify-between">
      {/* --- Row Selection Info --- */}
      <div className="text-sm text-muted-foreground">
        {/* {selectedRowCount} of {totalItems} row(s) selected. */}
      </div>

      {/* --- Pagination Controls --- */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page >= pageCount || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}