"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  queryParams = {},
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLimit, setSelectedLimit] = useState(
    Number(queryParams.limit) || 10
  );


  useEffect(() => {
    const limitFromQuery = Number(queryParams.limit);
    if (!isNaN(limitFromQuery) && limitFromQuery !== selectedLimit) {
      setSelectedLimit(limitFromQuery);
    }
  }, [queryParams.limit, selectedLimit]);


  const buildLink = useCallback(
    (page: number, limit: number) => {
      const newParams = new URLSearchParams(searchParams.toString());  
      newParams.set("page", page.toString());
      newParams.set("limit", limit.toString());
      return `${basePath}?${newParams.toString()}`;
    },
    [basePath, searchParams]
  );

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setSelectedLimit(newLimit);
    router.push(buildLink(1, newLimit));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <Link
          key={1}
          href={buildLink(1, selectedLimit)}
          className={`mx-1 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300`}
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="dots-start" className="mx-1 px-3 py-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Link
          key={i}
          href={buildLink(i, selectedLimit)}
          className={`mx-1 px-3 py-2 rounded-lg ${
            i === currentPage
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-all duration-200`}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="dots-end" className="mx-1 px-3 py-2">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <Link
          key={totalPages}
          href={buildLink(totalPages, selectedLimit)}
          className={`mx-1 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300`}
        >
          {totalPages}
        </Link>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {currentPage > 1 && (
          <Link
            href={buildLink(currentPage - 1, selectedLimit)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors shadow-sm"
          >
            &larr; Trang trước
          </Link>
        )}

        {renderPageNumbers()}

        {currentPage < totalPages && (
          <Link
            href={buildLink(currentPage + 1, selectedLimit)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors shadow-sm"
          >
            Trang sau &rarr;
          </Link>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <label
          htmlFor="limit-select"
          className="mr-3 text-gray-700 font-medium text-base"
        >
          Hiển thị mỗi trang:
        </label>
        <select
          id="limit-select"
          value={selectedLimit}
          onChange={handleLimitChange}
          className="border border-gray-300 rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 10, 20, 50].map((value) => (
            <option key={value} value={value}>
              {value} tài liệu
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
