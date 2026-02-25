'use client';

import { useEffect, useState } from 'react';
import {API_BASE_URL} from "@/api/apiUrl";
import { useRouter } from 'next/navigation';



// // 프리미티브 타입 : int, long ... 크기가 정해져 있음
// int a = 10;
// int b = 20;
// // 레퍼런스 타입 : String, 배열 ... 크기가 가변적 (알 수 없음)
// Class Person{
//     name;
// }
//
// Person a = new Person();
// Person b = a;
// b.name

const func1 = ()=>{}


const someFunc = ()=>{}
const func2n = someFunc;
// 이번주 보완만.. 멀티형 게시판
// 컴포넌트 분리 : 위에서부터 크게 분리 . grid => 파라미터 주고 받기 설계 ==> context 하나로 하면 문제
export default function BoardListPage() {
    const router = useRouter();
    const [data, setData] = useState({
        boardList: [],
        boardListCount: 0,
        categoryList: [],});
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
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
        const res = await fetch(
            `${API_BASE_URL}/board/list?${params.toString()}`
        ); // 네트워크 구간 => 객체 사용해서 할 수 있도록 (ex) get board list

        if(res.ok){
            const result = await res.json(); // response 객체 변환
            setData(result);
            setStartDate(result.startDate);
            setEndDate(result.endDate);
        }
    };

    if (!data) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500 text-lg">Loading...</div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                게시글 목록
            </h1>

            {/* 검색 영역 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">등록일</span>
                <div className="flex items-center gap-2">
                    <input
                        name="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)} // onChange=함수 이렇게 변경하기. return 영역 역할 분담
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="text-gray-400">~</span>
                    <input
                        name="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                </div>
                <select
                    name="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                    <option value="0">전체 카테고리</option>
                    {data.categoryList?.map((category) => ( // 나중 렌더링 고려.. => 저장할 부분
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
                <input
                    name="keyword"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="검색어를 입력해 주세요. (제목+작성자+내용)"
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 flex-1 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                    type="button"
                    onClick={() => fetchBoardList(1)}
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
            {data.pageInfo && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                        onClick={() => setPage(data.pageInfo.startPage - 1)}
                        disabled={data.pageInfo.startPage === 1}
                        className="px-3 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        이전
                    </button>
                    {/*밖으로*/}
                    {Array.from(
                        { length: data.pageInfo.endPage - data.pageInfo.startPage + 1 },
                        (element, index) => data.pageInfo.startPage + index
                    ).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-2 rounded border text-sm transition-colors ${
                                pageNum === data.pageInfo.currentPage
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(data.pageInfo.endPage + 1)}
                        disabled={data.pageInfo.endPage === data.pageInfo.totalPages}
                        className="px-3 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        다음
                    </button>
                </div>
            )}

        </div>
    );
}
