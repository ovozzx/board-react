// SSR (서버 컴포넌트) - 'use client' 없음
// 서버에서 데이터를 가져온 후 완성된 HTML을 내려줌 (Loading 불필요)
import { API_BASE_URL } from "@/api/apiUrl";
import { getDownloadUrl } from "@/api/apiUrl";
import Reply from "@/components/board/Reply";
import BoardActions from "@/components/board/BoardActions";

export default async function BoardDetailPage({ params }) { // async 서버 컴포넌트
    const boardId = params.boardId;

    // 서버에서 직접 fetch (useEffect 불필요)
    const res = await fetch(`${API_BASE_URL}/board/view/${boardId}`, {
        cache: 'no-store' // 항상 최신 데이터 (조회수 등)
    });

    if (!res.ok) {
        return <div className="max-w-5xl mx-auto px-4 py-10 text-red-500">게시글을 불러올 수 없습니다. (status: {res.status})</div>;
    }

    const data = await res.json();

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
                                    href={getDownloadUrl(file.attachmentId)}
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
            <BoardActions boardId={boardId} />

            {/* 댓글 (클라이언트 컴포넌트) */}
            <Reply
                boardId={boardId}
                replyList={data.replyList}
            />
        </div>
    );
}
