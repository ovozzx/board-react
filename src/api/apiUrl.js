export const API_BASE_URL = "http://localhost:8081/api";

// TODO 주석 아래처럼 js doc
// TODO 글로벌 핸들러 ex. 네트워크 오류. 사용자 반응이 없는 오류 최악의 케이스 등 (관리자가 짐작할 수 있게)
// 예외 글로벌 핸들러에 단일 스레드라 안 잡힘...
/**
 * 게시글 목록 조회
 * @param {URLSearchParams} params - 검색/페이징 조건 (page, pageSize, startDate, endDate, categoryId, keyword)
 * @returns {Promise<{
 *   categoryList: Object[],
 *   boardList: Object[],
 *   boardListCount: number,
 *   startDate: string,
 *   endDate: string
 * }>}
 * @throws {Error} 응답이 정상(2xx)이 아닐 때
 */
export const getBoards = async (params) => {
    // 목록은 항상 최신 상태여야 하므로 캐시 사용 안 함
    const res = await fetch(`${API_BASE_URL}/boards?${params.toString()}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`목록 조회 실패 (${res.status})`);
    return await res.json();
};

/**
 * 게시글 상세 조회
 * @param boardId
 * @returns {Promise<{
 *  board: Object,
 *  replyList: Object[],
 *  fileList: Object[]
 * }>}
 * @throws {Error} 응답이 정상(2xx)이 아닐 때
 */
export const getBoard = async (boardId) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`);
    if (!res.ok) throw new Error(`게시글 조회 실패 (${res.status})`);
    return await res.json();
};


/**
 * 카테고리 목록 조회
 * @returns {Promise<{
 *  categoryId: number,
 *  categoryName: string
 *  @throws {Error} 응답이 정상(2xx)이 아닐 때
 * }>}
 */
export const getCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/boards/cateogories`);
    if (!res.ok) throw new Error(`카테고리 조회 실패 (${res.status})`);
    return await res.json();
};


/**
 * 게시글 등록
 * @param formData
 * @returns {Promise<Response>}
 */
export const writeBoard = async (formData) => {
    return await fetch(`${API_BASE_URL}/boards`, {
        method: 'POST',
        body: formData
    });
};


/**
 * 게시글 수정 조회
 * @param boardId
 * @returns {Promise<{
 *  board: Object,
 *  fileList: Object[]
 * }>}
 */
export const getBoardForModify = async (boardId) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}/modify`);
    if (!res.ok) throw new Error(`게시글 조회 실패 (${res.status})`);
    return await res.json();
};


/**
 * 게시글 수정
 * @param boardId
 * @param formData
 * @returns {Promise<Response>}
 */
export const modifyBoard = async (boardId, formData) => {
    return await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'PUT',
        body: formData
    });
};


/**
 * 게시글 삭제
 * @param boardId
 * @param password
 * @returns {Promise<Response>}
 */
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

/**
 * 댓글 등록
 * @param boardId
 * @param parentId
 * @param replyContent
 * @returns {Promise<Response>}
 */
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


/**
 * 첨부파일 다운로드 URL
 * @param boardId
 * @param attachmentId
 * @returns {`http://localhost:8081/api/boards/${string}/attachments/${string}`}
 */
export const getAttachment = (boardId, attachmentId) => {
    return `${API_BASE_URL}/boards/${boardId}/attachments/${attachmentId}`;
};
