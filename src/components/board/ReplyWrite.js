'use client';

import { useState } from 'react';
import {getBoard, registerReply} from "@/api/apiUrl";

const ReplyWrite = ({ boardId, parentId, onSuccess }) => { // 서버에서 내려온 초기 댓글 목록
    const [replyContent, setReplyContent] = useState("");

    const handleReplyRegister = async () => {
        if(!replyContent.trim()){
            alert("댓글을 입력해주세요.");
            return;
        }
        const res = await registerReply(boardId, parentId, replyContent);

        if(res.ok){
            setReplyContent("");
            // 댓글 등록 후 최신 댓글 목록 다시 조회
            onSuccess();
        } else{
            alert("댓글 등록에 실패하였습니다.");
        }
    };

    return (

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

    );
};

export default ReplyWrite;
