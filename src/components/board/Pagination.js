const Pagination = ({ page, pageTotalCount, startPage, endPage, onPageChange }) => {
    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {/*첫 페이지*/}
            <button className="px-3 py-2 rounded border text-sm transition-colors" onClick={() => onPageChange(1)}>«</button>
            {/*이전 그룹의 마지막 페이지*/}
            <button className="px-3 py-2 rounded border text-sm transition-colors" onClick={() => onPageChange(startPage - 1)}>‹</button>
            {Array.from({length: endPage - startPage + 1}, (element, i) => startPage + i).map((pageNum) => (
                // 길이가 pageTotalCount인 배열을 만들고, 각 자리에 i+1 값을 채워 넣는다
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 rounded border text-sm transition-colors ${
                        pageNum === page
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {pageNum}
                </button>
            ))}
            {/*다음 그룹의 첫 페이지*/}
            <button className="px-3 py-2 rounded border text-sm transition-colors" onClick={() => onPageChange(endPage + 1)}>›</button>
            {/*마지막 페이지*/}
            <button className="px-3 py-2 rounded border text-sm transition-colors" onClick={() => onPageChange(pageTotalCount)}>»</button>
        </div>
    );
};

export default Pagination;
