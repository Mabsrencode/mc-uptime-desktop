import React from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
const Pagination: React.FC<{
  postsPerPage: number;
  totalPosts: number;
  paginate: (number: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  currentPage: number;
}> = ({
  postsPerPage,
  totalPosts,
  paginate,
  previousPage,
  nextPage,
  currentPage,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const visiblePages = pageNumbers.slice(
    Math.max(0, currentPage - 3),
    Math.min(pageNumbers.length, currentPage + 1)
  );

  return (
    <div className="mb-8 mt-2">
      <ul className="flex justify-end items-center w-full mx-auto">
        <li
          onClick={previousPage}
          className="border border-white/20 p-2 h-[30px]"
        >
          <FaAngleLeft className="h-full" />
        </li>
        {currentPage > 4 && (
          <>
            <li
              onClick={() => paginate(1)}
              className={`border text-xs flex items-center justify-center border-white/20 p-2 h-[30px] text-white ${
                currentPage === 1 && "bg-green-500"
              }`}
            >
              1
            </li>
            <li className="p-2 h-[30px] border border-white/20 text-xs flex items-center justify-center">
              ...
            </li>
          </>
        )}
        {visiblePages.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
            className={`border text-xs flex items-center justify-center border-white/20 p-2 h-[30px] text-white  ${
              currentPage === number && "bg-green-950"
            }`}
          >
            {number}
          </li>
        ))}
        {currentPage < pageNumbers.length - 1 && (
          <>
            <li className="border border-white/20 p-2 h-[30px] text-xs flex items-center justify-center">
              ...
            </li>
            <li
              onClick={() => paginate(pageNumbers.length)}
              className={`border border-white/20 p-2 h-[30px] text-xs flex items-center justify-center${
                currentPage === pageNumbers.length ? "bg-green-500" : ""
              }`}
            >
              {pageNumbers.length}
            </li>
          </>
        )}
        <li onClick={nextPage} className="border border-white/20 p-2 h-[30px]">
          <FaAngleRight className="h-full" />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
