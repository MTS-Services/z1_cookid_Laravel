// Pagination.tsx
import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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

    const btnBase =
        'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 border';
    const btnDisabled = 'bg-gray-800/50 text-gray-600 cursor-not-allowed border-gray-800';
    const btnPrevNext =
        'bg-gray-800/80 hover:bg-navy/30 text-blue-400 hover:text-navy/50 border-blue-900/40 hover:border-navy/60';
    const btnPage =
        'text-sm font-medium bg-gray-800/70 text-gray-300 hover:bg-gray-700/90 border-gray-700 hover:border-gray-500';
    const btnPageActive =
        'bg-navy text-white border-2 border-transparent shadow-lg shadow-navy/20 scale-110';

    return (
        <div className="flex items-center justify-center gap-2 md:gap-3 py-6 px-4">
            <button
                type="button"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnPrevNext}`}
                aria-label="Previous page"
            >
                <FaArrowLeft size={18} strokeWidth={2.5} />
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => handlePageClick(page)}
                    className={`${btnBase} ${btnPage} ${page === currentPage ? btnPageActive : ''}`}
                    aria-label={`Page ${page}`}
                >
                    {page.toString().padStart(2, '0')}
                </button>
            ))}

            <button
                type="button"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnPrevNext}`}
                aria-label="Next page"
            >
                <FaArrowRight size={18} strokeWidth={2.5} />
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