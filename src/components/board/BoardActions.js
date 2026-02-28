'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteModal from "@/components/board/DeleteModal";

// 버튼 영역 + 삭제 모달 (클라이언트 컴포넌트 - onClick, useState 필요)
const BoardActions = ({ boardId }) => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
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
                        onClick={() => router.push(`/board/modify/${boardId}`)}
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
                    onDeleted={() => window.location.href = "/board/list"}
                />
            )}
        </>
    );
};

export default BoardActions;
