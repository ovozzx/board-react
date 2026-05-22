export const API_BASE_URL = "http://localhost:8081/api";

// TODO 주석 아래처럼 js doc
// TODO 글로벌 핸들러 ex. 네트워크 오류. 사용자 반응이 없는 오류 최악의 케이스 등 (관리자가 짐작할 수 있게)
// 예외 글로벌 핸들러에 단일 스레드라 안 잡힘...
/**
 *
 * @param params
 * @returns {Promise<any>}
 */
// 게시글 목록 조회
export const getBoards = async (params) => {
    const res = await fetch(`${API_BASE_URL}/boards?${params.toString()}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`목록 조회 실패 (${res.status})`);
    return await res.json();
};

// 게시글 상세 조회
export const getBoard = async (boardId) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`);
    if (!res.ok) throw new Error(`게시글 조회 실패 (${res.status})`);
    return await res.json();
};

// 카테고리 목록 조회
export const getCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/boards/cateogories`);
    if (!res.ok) throw new Error(`카테고리 조회 실패 (${res.status})`);
    return await res.json();
};

// 게시글 등록
export const writeBoard = async (formData) => {
    return await fetch(`${API_BASE_URL}/boards`, {
        method: 'POST',
        body: formData
    });
};

// 게시글 수정 조회
export const getBoardForModify = async (boardId) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}/modify`);
    if (!res.ok) throw new Error(`게시글 조회 실패 (${res.status})`);
    return await res.json();
};

// 게시글 수정
export const modifyBoard = async (boardId, formData) => {
    return await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'PUT',
        body: formData
    });
};

// 게시글 삭제
export const deleteBoard = async (boardId, password) => {
    return await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            boardId: boardId,
            passwordInput: password
        })
    });
};

// 댓글 등록
export const registerReply = async (boardId, parentId, replyContent) => {
    return await fetch(`${API_BASE_URL}/boards/{boardId}/replies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            boardId: boardId,
            parentReplyId: parentId,
            content: replyContent
        })
    });
};

// 첨부파일 다운로드 URL
export const getAttachment = (boardId, attachmentId) => {
    return `${API_BASE_URL}/boards/${boardId}/attachments/${attachmentId}`;
};
