'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBoards } from "@/api/apiUrl";


// 검색, 페이징, 목록 테이블 등 인터랙션(사용자 ↔ 화면)이 필요한 영역 (클라이언트 컴포넌트)
const BoardList = ({ initialData }) => { // 서버에서 내려온 초기 데이터
    const router = useRouter();
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1); // 현재 위치하는 페이지 정보
    const [startDate, setStartDate] = useState(initialData.startDate);
    const [endDate, setEndDate] = useState(initialData.endDate);
    const [categoryId, setCategoryId] = useState('');
    const [keyword, setKeyword] = useState('');
    const [pageSize, setPageSize] = useState(10); // 한 페이지에 몇개의 게시물을 보여줄 것인지

    useEffect(() => {
        fetchBoardList();
    }, [pageSize, page]); // pageSize 또는 page가 바뀌면 → fetchBoardList()를 다시 실행

    const fetchBoardList = async () => {
        const params = new URLSearchParams({
            page: page || 1,
            startDate: startDate || '',
            endDate: endDate || '',
            categoryId: categoryId || '',
            keyword: keyword || '',
            pageSize: pageSize || 10
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

    // 페이지네이션 계산, 서버에 요청: page, pageSize만 보냄
    const pageTotalCount = Math.ceil(data.boardListCount / pageSize);
    const pageGroupSize = 10; // 하위 한 그룹에 보여줄 페이지 수
    const currentGroup = Math.ceil(page / pageGroupSize); // 지금 몇 번째 그룹인지
    const startPage = (currentGroup - 1) * pageGroupSize + 1; // 그룹의 첫 페이지 번호
    const endPage = Math.min(currentGroup * pageGroupSize, pageTotalCount); // 그룹의 마지막 페이지 번호

    // 등록일 시작 날짜 변경 핸들러
    const onStartDateChange = (startDate) => {
        setStartDate(startDate);
    };

    // 등록일 끝 날짜 변경 핸들러
    const onEndDateChange = (endDate) => {
        setEndDate(endDate);
    };

    const onCategoryChange = (category) => {
        setCategoryId(category);
    };

    // 검색바 - 페이지 사이즈 변경 핸들러
    const onPageSizeChange = (pageSize) => {
        setPageSize(pageSize);
        setPage(1);
    }

    // 키워드 검색
    const onKeywordChange = (keyword) => {
        setKeyword(keyword);
    }

    // 검색 클릭
    const handleSearch = () => {
        setPage(1);
        fetchBoardList();
    };

    // 페이지네이션 내 페이지 이동
    const onPageChange = (page) => {
        if(page < 1 || page > pageTotalCount){
            return;
        } else{
            setPage(page);
        }
    }

    return (
        <>
            {/* 검색 영역 */}
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
                    // onChange={onCategoryChange} 어떤 문제 생길 수 있음
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                    <option value="0">전체 카테고리</option>
                    {data.categoryList?.map((category) => ( // 나중 렌더링 고려.. => 저장할 부분
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
                <select onChange={(e) => {onPageSizeChange(e.target.value)}}>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
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
                    onClick={() => handleSearch()}
                    className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
                >
                    검색
                </button>
            </div>

            {/* 총 건수 + 등록 버튼 */}
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                    총 <span className="font-semibold text-gray-700">{data.boardListCount}</span> 건
                </div>
                <button
                    onClick={() => router.push('/boards/write')}
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
                            onClick={() => router.push(`/boards/${board.boardId}`)}>
                                {board.title} {board.hasAttachment && <img className="inline-block w-4 h-4 ml-1 align-middle" src="https://cdn-icons-png.freepik.com/512/8455/8455362.png" />}
                            </div>
                            <div className="text-gray-500">{board.createUser}</div>
                            <div className="text-gray-500">{board.viewCount}</div>
                            <div className="text-gray-400">{board.createDate?.slice(0, 10)}</div>
                            <div className="text-gray-400">{board.modifyDate?.slice(0, 10) || "-"}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/*TODO : 페이지네이션 컴포넌트화*/}
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
        </>
    );
};

export default BoardList;
