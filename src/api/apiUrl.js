export const API_BASE_URL = "http://localhost:8081/api";

// 게시글 목록 조회
export const getBoards = async (params) => {
    return await fetch(`${API_BASE_URL}/board/list?${params.toString()}`);
};

// 게시글 상세 조회
export const getBoard = async (boardId) => {
    return await fetch(`${API_BASE_URL}/board/view/${boardId}`);
};

// 게시글 수정 데이터 조회
export const getBoardForModify = async (boardId) => {
    return await fetch(`${API_BASE_URL}/board/modify/${boardId}`);
};

// 카테고리 목록 조회
export const getCategoriesForWrite = async () => {
    return await fetch(`${API_BASE_URL}/board/write`);
};

// 게시글 등록
export const createBoard = async (formData) => {
    return await fetch(`${API_BASE_URL}/board/write`, {
        method: 'POST',
        body: formData
    });
};

// 게시글 수정
export const updateBoard = async (formData) => {
    return await fetch(`${API_BASE_URL}/board/modify`, {
        method: 'POST',
        body: formData
    });
};

// 게시글 삭제
export const deleteBoard = async (boardId, password) => {
    return await fetch(`${API_BASE_URL}/board/delete`, {
        method: "POST",
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
export const createReply = async (boardId, replyContent) => {
    return await fetch(`${API_BASE_URL}/reply/write`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            boardId: boardId,
            content: replyContent
        })
    });
};

// 첨부파일 다운로드 URL
export const getDownloadUrl = (fileId) => {
    return `${API_BASE_URL}/board/download?fileId=${fileId}`;
};
