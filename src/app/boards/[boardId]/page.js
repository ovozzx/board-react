'use client'

import {API_BASE_URL, getAttachment, getBoard} from "@/api/apiUrl";
import Reply from "@/components/board/Reply";
import DeleteModal from "@/components/board/DeleteModal";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Loading from "@/components/common/Loading";

export default function BoardDetailPage({ params }) {

    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState();

    const boardId = params.boardId;

    // useEffect => 첫 렌더 이후에야 실행
    useEffect(() => { // useEffect의 콜백은 cleanup 함수를 반환해야 해서 async로 만들면 안됨!
        const fetchDetail = async () => {
            const res = await getBoard(boardId);
            if (res.ok) {
                const data = await res.json();
                setData(data);
            } else {
                // return <div className="max-w-5xl mx-auto px-4 py-10 text-red-500">게시글을 불러올 수 없습니다.
                //     (status: {res.status})</div>;
            }
        }
        fetchDetail();

    }, [boardId]);

    if (!data) return <Loading />; //  useEffect는 렌더링이 성공적으로 끝난 후에야 실행되기 떄문에 추가,  첫 렌더가 무사히 끝나면 의존성 배열이 있든 없든 무조건 한 번 실행!

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                게시판 - 보기
            </h1>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* 카테고리 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">카테고리</div>
                    <div className="px-4 py-3 text-sm text-gray-700">[{data.board.categoryName}]</div>
                </div>
                {/* 제목 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">제목</div>
                    <div className="px-4 py-3 text-base font-medium text-gray-800">{data.board.title}</div>
                </div>

                {/* 작성자 정보 행 */}
                <div className="grid grid-cols-[120px_1fr_120px_1fr_120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">작성자</div>
                    <div className="px-4 py-3 text-sm text-gray-700">{data.board.createUser}</div>
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">수정일시</div>
                    <div className="px-4 py-3 text-sm text-gray-700">{data.board.modifyDate || "-"}</div>
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">등록일시</div>
                    <div className="px-4 py-3 text-sm text-gray-700">{data.board.createDate}</div>
                </div>
                <div className="grid grid-cols-[120px_1fr_120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">조회수</div>
                    <div className="px-4 py-3 text-sm text-gray-700">{data.board.viewCount}</div>
                </div>

                {/* 내용 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">내용</div>
                    <div className="px-4 py-6 text-sm text-gray-800 min-h-[200px] whitespace-pre-wrap leading-relaxed">
                        {data.board.content}
                    </div>
                </div>

                {/* 첨부파일 */}
                <div className="grid grid-cols-[120px_1fr]">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">첨부파일</div>
                    <div className="px-4 py-3 text-sm">
                        {data.fileList?.length === 0 && (
                            <span className="text-gray-400">첨부파일 없음</span>
                        )}
                        {data.fileList?.map((file) => (
                            <div key={file.attachmentId}>
                                <a
                                    href={getAttachment(boardId, file.attachmentId)}
                                    className="text-blue-500 hover:underline"
                                >
                                    {file.originalName}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 버튼 + 삭제 모달 (클라이언트 컴포넌트) */}
            {/* 버튼 영역 */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => router.push("/boards")}
                    className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    목록
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/boards/${boardId}/modify`)}
                        className="px-4 py-2 rounded border border-blue-400 text-sm text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                        수정
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 rounded border border-red-400 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/* 삭제 모달 */}
            {showModal && (
                <DeleteModal
                    boardId={boardId}
                    onClose={() => setShowModal(false)}
                    onDeleted={() => window.location.href = "/boards"}
                />
            )}

            {/* 댓글 (클라이언트 컴포넌트) */}
            <Reply
                boardId={boardId}
                replyList={data.replyList}
            />
        </div>
    );
}
