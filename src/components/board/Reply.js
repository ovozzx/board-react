'use client';

import { useState } from 'react';
import {getBoard, registerReply} from "@/api/apiUrl";
import ReplyWrite from "@/components/board/ReplyWrite";

const Reply = ({ boardId, replyList: initialReplyList }) => { // 서버에서 내려온 초기 댓글 목록
    const [replyContent, setReplyContent] = useState("");
    const [replyList, setReplyList] = useState(initialReplyList); // 댓글 목록을 자체 state로 관리
    const [activeReplyId, setActiveReplyId] = useState(null); // 답글 활성화된 댓글 id

    // 답글 달기
    const onRereplyHandler = async (replyId) => {
        setActiveReplyId(replyId);
    }

    // 등록 후 갱신
    const onReloadReplyList = async () => {
        const res = await getBoard(boardId);
        const data = await res.json();
        setReplyList(data.replyList);
        setActiveReplyId(null);
    }

    return (
        <div className="mt-8">
            <h2 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                댓글
            </h2>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden mb-4">
                {replyList?.length === 0 && (
                    <div className="px-4 py-6 text-sm text-gray-400 text-center">댓글이 없습니다.</div>
                )}
                {replyList?.map((reply) => ( // 현재요소, 순번
                    <>
                        <div key={reply.replyId} className="flex items-start gap-3 px-4 py-3" style={{marginLeft: reply.depth * 20}}>
                            <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{reply.createDate}</span>
                            <span className="text-sm text-gray-700">{reply.content}</span>
                            { (reply.depth != 4) &&
                                <button className="px-2 py-1 bg-gray-700 text-white text-sm rounded"
                                    onClick={() => onRereplyHandler(reply.replyId)}
                                    style={{fontSize: 12 }}>
                                답글 달기
                            </button>}
                        </div>
                        {(reply.replyId == activeReplyId ? true : false) && <ReplyWrite boardId={boardId} parentId={reply.replyId} onSuccess={onReloadReplyList}/>}
                    </>
                ))}
            </div>
            <ReplyWrite boardId={boardId} onSuccess={onReloadReplyList}/>
        </div>
    );
};

export default Reply;
