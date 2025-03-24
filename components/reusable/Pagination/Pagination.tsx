import React from "react";

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
    <div className="my-16">
      <ul className="flex gap-1 justify-center items-center max-w-[330px] mx-auto">
        <li
          onClick={previousPage}
          className="hover:bg-yellow-300 focus:bg-yellow-300 cursor-pointer border border-gray-300 px-2 md:px-3 rounded-md font-semibold text-gray-300 hover:text-yellow-900"
        >
          <i className="fa-solid fa-angle-left"></i>
        </li>
        {currentPage > 4 && (
          <>
            <li
              onClick={() => paginate(1)}
              className={`hover:bg-yellow-300 focus:bg-yellow-300 cursor-pointer border border-gray-300 px-2 md:px-3 rounded-md font-semibold text-yellow-900 ${
                currentPage === 1 ? "bg-yellow-300" : ""
              }`}
            >
              1
            </li>
            <li className="px-2 md:px-3">...</li>
          </>
        )}
        {visiblePages.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
            className={`hover:bg-yellow-300 focus:bg-yellow-300 cursor-pointer border border-gray-300 px-2 md:px-3 rounded-md font-semibold ${
              currentPage === number
                ? "bg-yellow-300 text-yellow-900"
                : "text-yellow-900"
            }`}
          >
            {number}
          </li>
        ))}
        {currentPage < pageNumbers.length - 1 && (
          <>
            <li className="px-2 md:px-3">...</li>
            <li
              onClick={() => paginate(pageNumbers.length)}
              className={`hover:bg-yellow-300 focus:bg-yellow-300 cursor-pointer border border-gray-300 px-2 md:px-3 rounded-md font-semibold text-yellow-900 ${
                currentPage === pageNumbers.length ? "bg-yellow-300" : ""
              }`}
            >
              {pageNumbers.length}
            </li>
          </>
        )}
        <li
          onClick={nextPage}
          className="hover:bg-yellow-300 focus:bg-yellow-300 cursor-pointer border border-gray-300 px-2 md:px-3 rounded-md font-semibold text-gray-300 hover:text-yellow-900"
        >
          <i className="fa-solid fa-angle-right"></i>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
