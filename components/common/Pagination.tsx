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
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const showFirstFour = currentPage <= 3;
      const showLastFour = currentPage >= totalPages - 3;

      if (showFirstFour) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        if (totalPages > 7) {
          pages.push("ellipsis");
        }
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (showLastFour) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis-start");
        
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        
        pages.push("ellipsis-end");
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
    <PaginationRoot>
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
            if (page === "ellipsis" || page === "ellipsis-start" || page === "ellipsis-end") {
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

