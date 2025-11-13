"use client";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, page: number) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <PaginationRoot className="py-4 my-2 sm:my-8 sm:py-4 md:py-4 border-t border-muted sm:border-t sm:border-muted md:border-t md:border-muted bg-background">
      <PaginationContent className="justify-between w-full">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={cn(
              "text-xs sm:text-sm px-2 sm:px-3",
              currentPage === 1 && "pointer-events-none opacity-50"
            )}
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </PaginationPrevious>
        </PaginationItem>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm" />
                </PaginationItem>
              );
            }

            const pageNum = page as number;
            const isActive = currentPage === pageNum;

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageClick(e, pageNum)}
                  isActive={isActive}
                  size="default"
                  className={cn(
                    "text-xs sm:text-sm min-w-8 sm:min-w-10",
                    isActive && "text-muted-foreground border-[#84CC16]"
                  )}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </div>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={cn(
              "text-xs sm:text-sm px-2 sm:px-3",
              currentPage === totalPages && "pointer-events-none opacity-50"
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}

