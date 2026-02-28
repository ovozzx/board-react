'use client';

import { useState } from 'react';
import { deleteBoard } from "@/api/apiUrl";

const DeleteModal = ({ boardId, onClose, onDeleted }) => {
    const [password, setPassword] = useState("");

    const handleDelete = async () => {
        if (!password.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        const res = await deleteBoard(boardId, password);

        if (res.ok) {
            alert("삭제되었습니다.");
            onDeleted(); // 부모에게 삭제 완료 알림 (페이지 이동 등)
        } else {
            alert("비밀번호가 일치하지 않거나 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
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
                        onClick={onClose}
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
    );
};

export default DeleteModal;
