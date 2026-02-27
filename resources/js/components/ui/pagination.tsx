// Pagination.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    // Limit visible pages for better UX (you can adjust this)
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 md:gap-3 py-6 px-4">
            {/* Previous button */}
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
          flex items-center justify-center w-10 h-10 rounded-full 
          transition-all duration-200
          ${currentPage === 1
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-800/80 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-900/40 hover:border-blue-600/60'
                    }
        `}
                aria-label="Previous page"
            >
                <ChevronLeft size={18} strokeWidth={2.5} />
            </button>

            {/* Page numbers */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`
            flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
            transition-all duration-200
            ${page === currentPage
                            ? 'bg-blue-600 text-white border-2 border-blue-400/60 shadow-lg shadow-blue-500/20 scale-110'
                            : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/90 border border-gray-700 hover:border-gray-500'
                        }
          `}
                >
                    {page.toString().padStart(2, '0')}
                </button>
            ))}

            {/* Next button */}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
          flex items-center justify-center w-10 h-10 rounded-full 
          transition-all duration-200
          ${currentPage === totalPages
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-800/80 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-900/40 hover:border-blue-600/60'
                    }
        `}
                aria-label="Next page"
            >
                <ChevronRight size={18} strokeWidth={2.5} />
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────
// Example usage:
// ─────────────────────────────────────────────

/*
function Example() {
  const [page, setPage] = React.useState(1);
  
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Pagination
        currentPage={page}
        totalPages={12}
        onPageChange={setPage}
      />
    </div>
  );
}
*/