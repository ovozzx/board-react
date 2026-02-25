'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 클라이언트 컴포넌트에서 "코드로 페이지 이동"하려면 useRouter()를 써야 한다. => 페이지 전체 새로고침 안 함 (필요 부분만 교체)
import {API_BASE_URL} from "@/api/apiUrl";

// ssr (서버 side 렌더링) 적용 : 보기/목록만 ssr
// next 쓰는 이유
export default function BoardDetailPage({params}) { // params: { boardId: "5" },
    const router = useRouter();
    const [data, setData] = useState(null);
    const [showModal, setshowModal] = useState(null);
    const [replyContent, setReplyContent] = useState(null);
    const [page, setPage] = useState(1);
    const boardId = params.boardId; // Next.js => [폴더명] = URL 파라미터

    // 삭제
    const [password, setPassword] = useState("");

    useEffect(() => {
        fetchBoardDetail(boardId);
    }, []); // boardId 넣어서 해야할듯 테스트

    const fetchBoardDetail = async (boardId) => {
        const params = new URLSearchParams({
            boardId: boardId
        });

        const res = await fetch(
            `${API_BASE_URL}/board/view?${params.toString()}`
        );

        const result = await res.json(); // response 객체 변환
        setData(result);
    };

    if (!data) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500 text-lg">Loading...</div>
        </div>
    ); // 컴포넌트화

    const handleReplyRegister = async () => {
      if(!replyContent.trim()){
          alert("댓글을 입력해주세요.");
          return;
      }
      const res = await fetch(`${API_BASE_URL}/reply/write`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              boardId: boardId,
              content: replyContent
          })
      });

      if(res.ok){
          setReplyContent("");
          await fetchBoardDetail(boardId);
      } else{
          alert("댓글 등록에 실패하였습니다.");
      }
    };

    // 삭제 기능
    const handleDelete = async () => {
        if (!password.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        const res = await fetch(`${API_BASE_URL}/board/delete`, { // fetch 모두 숨기기
            method: "POST", // 또는 DELETE
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                boardId: boardId,
                passwordInput: password
            })
        });

        if (res.ok) {
            alert("삭제되었습니다.");
            router.push("/board/list");
        }
        // else if (res.status === 403) {
        //     alert("비밀번호가 일치하지 않습니다.");
        // }
        else {
            alert("비밀번호가 일치하지 않거나 삭제 중 오류가 발생했습니다.");
        }

    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                게시판 - 보기
            </h1>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* 제목 행 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">카테고리</div>
                    <div className="px-4 py-3 text-sm text-gray-700">[{data.board.categoryName}]</div>
                </div>
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
                                    href={`${API_BASE_URL}/board/download?fileId=${file.attachmentId}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {file.originalName}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => router.push("/board/list")}
                    className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    목록
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/board/modify/${data.board.boardId}`)}
                        className="px-4 py-2 rounded border border-blue-400 text-sm text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                        수정
                    </button>
                    <button
                        onClick={() => setshowModal(true)}
                        className="px-4 py-2 rounded border border-red-400 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/* 댓글 */}
            <div className="mt-8">
                <h2 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                    댓글
                </h2>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden mb-4">
                    {data.replyList?.length === 0 && (
                        <div className="px-4 py-6 text-sm text-gray-400 text-center">댓글이 없습니다.</div>
                    )}
                    {data.replyList?.map((reply, index) => ( // 현재요소, 순번
                        <div key={index} className="flex items-start gap-3 px-4 py-3">
                            <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{reply.createDate}</span>
                            <span className="text-sm text-gray-700">{reply.content}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <textarea
                        // value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="댓글을 입력해 주세요."
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                        rows={3}
                    />
                    <button
                        onClick={handleReplyRegister}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors self-end">
                        등록
                    </button>
                </div>
            </div>

            {/* 삭제 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">게시글 삭제</h3>
                        <p className="text-sm text-gray-500 mb-4">비밀번호를 입력하면 삭제됩니다.</p>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-red-400"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setshowModal(false)}
                                className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
