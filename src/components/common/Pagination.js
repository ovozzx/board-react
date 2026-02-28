const Pagination = ({ pageInfo, onPageChange }) => {
    // 페이지 정보 (startPage, endPage, currentPage ...)
    // 페이지 번호 클릭 시 부모의 setPage 호출
    if (!pageInfo) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button
                onClick={() => onPageChange(pageInfo.startPage - 1)}
                disabled={pageInfo.startPage === 1}
                className="px-3 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                이전
            </button>
            {Array.from(
                { length: pageInfo.endPage - pageInfo.startPage + 1 },
                (element, index) => pageInfo.startPage + index
            ).map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 rounded border text-sm transition-colors ${
                        pageNum === pageInfo.currentPage
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {pageNum}
                </button>
            ))}
            <button
                onClick={() => onPageChange(pageInfo.endPage + 1)}
                disabled={pageInfo.endPage === pageInfo.totalPages}
                className="px-3 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                다음
            </button>
        </div>
    );
};

export default Pagination;
