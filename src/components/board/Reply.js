'use client';

import { useState } from 'react';
import { createReply, getBoard } from "@/api/apiUrl";

const Reply = ({ boardId, replyList: initialReplyList }) => { // 서버에서 내려온 초기 댓글 목록
    const [replyContent, setReplyContent] = useState("");
    const [replyList, setReplyList] = useState(initialReplyList); // 댓글 목록을 자체 state로 관리

    const handleReplyRegister = async () => {
        if(!replyContent.trim()){
            alert("댓글을 입력해주세요.");
            return;
        }
        const res = await createReply(boardId, replyContent);

        if(res.ok){
            setReplyContent("");
            // 댓글 등록 후 최신 댓글 목록 다시 조회
            const boardRes = await getBoard(boardId);
            const data = await boardRes.json();
            setReplyList(data.replyList);
        } else{
            alert("댓글 등록에 실패하였습니다.");
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                댓글
            </h2>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden mb-4">
                {replyList?.length === 0 && (
                    <div className="px-4 py-6 text-sm text-gray-400 text-center">댓글이 없습니다.</div>
                )}
                {replyList?.map((reply, index) => ( // 현재요소, 순번
                    <div key={index} className="flex items-start gap-3 px-4 py-3">
                        <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{reply.createDate}</span>
                        <span className="text-sm text-gray-700">{reply.content}</span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <textarea
                    value={replyContent}
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
    );
};

export default Reply;
