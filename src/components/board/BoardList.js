'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBoards } from "@/api/apiUrl";
import Search from "@/components/board/Search";
import Pagination from "@/components/common/Pagination";

// 검색, 페이징, 목록 테이블 등 인터랙션이 필요한 영역 (클라이언트 컴포넌트)
const BoardList = ({ initialData }) => { // 서버에서 내려온 초기 데이터
    const router = useRouter();
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(initialData.startDate);
    const [endDate, setEndDate] = useState(initialData.endDate);
    const [categoryId, setCategoryId] = useState();
    const [keyword, setKeyword] = useState();

    useEffect(() => {
        fetchBoardList(page);
    }, [page]);

    const fetchBoardList = async (pageNumber) => {
        const params = new URLSearchParams({
            page: pageNumber || 1,
            startDate: startDate || '',
            endDate: endDate || '',
            categoryId: categoryId || '',
            keyword: keyword || ''
        });
        // get은 body 안됨
        const res = await getBoards(params);

        if(res.ok){
            const result = await res.json();
            setData(result);
            setStartDate(result.startDate);
            setEndDate(result.endDate);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchBoardList(1);
    };

    return (
        <>
            {/* 검색 영역 */}
            <Search
                startDate={startDate}
                endDate={endDate}
                categoryId={categoryId}
                keyword={keyword}
                categoryList={data.categoryList}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onCategoryChange={setCategoryId}
                onKeywordChange={setKeyword}
                onSearch={handleSearch}
            />

            {/* 총 건수 + 등록 버튼 */}
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                    총 <span className="font-semibold text-gray-700">{data.boardListCount}</span> 건
                </div>
                <button
                    onClick={() => router.push('/board/write')}
                    className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                    등록
                </button>
            </div>

            {/* 목록 테이블 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* 컬럼 헤더 */}
                <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] bg-gray-100 border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 text-center">
                    <div>카테고리</div>
                    <div className="text-left">제목</div>
                    <div>작성자</div>
                    <div>조회수</div>
                    <div>등록일</div>
                    <div>수정일</div>
                </div>

                {/* 목록 */}
                <div className="divide-y divide-gray-100">
                    {data.boardList?.map((board) => (
                        <div
                            key={board.boardId}
                            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center px-4 py-3 text-sm text-center hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                            <div className="text-gray-500">{board.categoryName}</div>
                            <div className="text-gray-800 font-medium text-left truncate"
                            onClick={() => router.push(`/board/view/${board.boardId}`)}>
                                {board.title}
                            </div>
                            <div className="text-gray-500">{board.createUser}</div>
                            <div className="text-gray-500">{board.viewCount}</div>
                            <div className="text-gray-400">{board.createDate?.slice(0, 10)}</div>
                            <div className="text-gray-400">{board.modifyDate?.slice(0, 10)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 페이징 */}
            <Pagination
                pageInfo={data.pageInfo}
                onPageChange={setPage}
            />
        </>
    );
};

export default BoardList;
