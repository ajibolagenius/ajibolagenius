import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination controls — Design System: mono, sungold active, sharp.
 * @param {number} page - Current 1-based page
 * @param {number} totalPages - Total number of pages
 * @param {(page: number) => void} onPageChange
 * @param {{ start: number, end: number, total: number }} [range] - Optional "Showing start–end of total"
 */
const ListPagination = ({ page, totalPages, onPageChange, range }) => {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const pageNumbers = [];
  const showEllipsisStart = page > 3;
  const showEllipsisEnd = page < totalPages - 2;
  let low = Math.max(1, page - 1);
  let high = Math.min(totalPages, page + 1);
  if (totalPages <= 5) {
    low = 1;
    high = totalPages;
  }
  for (let i = low; i <= high; i++) pageNumbers.push(i);

  return (
    <nav role="navigation" aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[var(--border)]">
      {range != null && (
        <p className="font-mono text-[11px] text-[var(--subtle)] order-2 sm:order-1">
          Showing {range.start + 1}–{range.end} of {range.total}
        </p>
      )}
      <ul className="flex items-center gap-1 order-1 sm:order-2">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={prevDisabled}
            aria-label="Previous page"
            className="font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-2 cursor-pointer transition-all duration-200 rounded-none disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--border)] bg-transparent text-[var(--subtle)] hover:border-[var(--border-md)] hover:text-[var(--white)]"
          >
            <ChevronLeft size={14} className="inline-block align-middle" />
            <span className="ml-1">Prev</span>
          </button>
        </li>
        {showEllipsisStart && (
          <>
            <li>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className="font-mono text-[11px] w-9 h-9 flex items-center justify-center rounded-none border border-[var(--border)] bg-transparent text-[var(--subtle)] hover:text-[var(--sungold)] hover:border-[rgba(232,160,32,0.3)]"
              >
                1
              </button>
            </li>
            {page > 3 && <li><span className="font-mono text-[11px] text-[var(--subtle)] px-1">…</span></li>}
          </>
        )}
        {pageNumbers.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => onPageChange(n)}
              aria-current={n === page ? 'page' : undefined}
              className="font-mono text-[11px] w-9 h-9 flex items-center justify-center rounded-none border transition-all duration-200"
              style={{
                background: n === page ? 'rgba(232,160,32,0.15)' : 'transparent',
                color: n === page ? 'var(--sungold)' : 'var(--subtle)',
                borderColor: n === page ? 'rgba(232,160,32,0.3)' : 'var(--border)',
              }}
            >
              {n}
            </button>
          </li>
        ))}
        {showEllipsisEnd && (
          <>
            {page < totalPages - 2 && <li><span className="font-mono text-[11px] text-[var(--subtle)] px-1">…</span></li>}
            <li>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className="font-mono text-[11px] w-9 h-9 flex items-center justify-center rounded-none border border-[var(--border)] bg-transparent text-[var(--subtle)] hover:text-[var(--sungold)] hover:border-[rgba(232,160,32,0.3)]"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={nextDisabled}
            aria-label="Next page"
            className="font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-2 cursor-pointer transition-all duration-200 rounded-none disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--border)] bg-transparent text-[var(--subtle)] hover:border-[var(--border-md)] hover:text-[var(--white)]"
          >
            <span className="mr-1">Next</span>
            <ChevronRight size={14} className="inline-block align-middle" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default ListPagination;
