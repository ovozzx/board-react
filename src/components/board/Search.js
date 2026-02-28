const Search = ({ startDate, endDate, categoryId, keyword, categoryList,
                   onStartDateChange, onEndDateChange, onCategoryChange, onKeywordChange, onSearch }) => { // state를 부모에 두고 props로 전달
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">등록일</span>
            <div className="flex items-center gap-2">
                <input
                    name="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-gray-400">~</span>
                <input
                    name="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
            </div>
            <select
                name="categoryId"
                value={categoryId}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
                <option value="0">전체 카테고리</option>
                {categoryList?.map((category) => ( // 나중 렌더링 고려.. => 저장할 부분
                    <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                    </option>
                ))}
            </select>
            <input
                name="keyword"
                type="text"
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                placeholder="검색어를 입력해 주세요. (제목+작성자+내용)"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 flex-1 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
                type="button"
                onClick={onSearch}
                className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
                검색
            </button>
        </div>
    );
};

export default Search;
