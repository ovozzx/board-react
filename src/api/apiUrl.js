export const API_BASE_URL = "http://localhost:8081/api";

// TODO 주석 아래처럼 js doc
// TODO 글로벌 핸들러 ex. 네트워크 오류. 사용자 반응이 없는 오류 최악의 케이스 등 (관리자가 짐작할 수 있게)
// 예외 글로벌 핸들러에 단일 스레드라 안 잡힘... fetch는 interceptor가 없어서 각 메서드에서 exceptionHandler를 명시 호출

const exceptionHandler = async (res) => {
    const text = await res.text(); // 본문 없는 응답(등록/수정/삭제 성공 시 200 + 빈 body)
    const data = text ? JSON.parse(text) : null;

    if(res.ok) return data;
    if(data.code === "INTERNAL_ERROR"){
        alert(data.message);
    }else if(data.code === "INVALID_INPUT"){
        alert(data.message);
    }else if(data.code === "BAD_REQUEST"){
        alert(data.message);
    }else if(data.code === "NOT_FOUND"){
        alert(data.message);
    }else if(data.code === "PASSWORD_MISMATCH"){
        alert(data.message);
    }else if(data.code === "FILE_SIZE_EXCEEDED"){
        alert(data.message);
    }else{
        alert("오류 발생");
    }
    throw new Error(data.message);
}

const apiRequest = async (request) => {
    try{
        const res = await request();
        return await exceptionHandler(res);
    } catch (err){
        if(err instanceof TypeError){ // 서버 꺼짐, CORS 거부 등
            alert("네트워크 오류가 발생했습니다.");
        }
        throw err; // 모든 에러 던짐
    }
}

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
export const getBoards = (params) => {
    // 목록은 항상 최신 상태여야 하므로 캐시 사용 안 함
    return apiRequest(() =>  fetch(`${API_BASE_URL}/boards?${params.toString()}`, {
        cache: 'no-store'
    })); //  () => fetch(...) 함수 자체를 전달

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
export const getBoard = (boardId) => {
    return apiRequest(() => fetch(`${API_BASE_URL}/boards/${boardId}`));
};


/**
 * 카테고리 목록 조회
 * @returns {Promise<Array<{
 *   categoryId: number,
 *   categoryName: string
 * }>>}
 * @throws {Error} 응답이 정상(2xx)이 아닐 때
 */
export const getCategories = () => {
    return apiRequest(() => fetch(`${API_BASE_URL}/boards/categories`));
};


/**
 * 게시글 등록
 * @param formData
 * @returns {Promise<null>}
 * @throws {Error} 응답이 정상(2xx)이 아닐 때
 */
export const writeBoard = (formData) => {
    return apiRequest(() => fetch(`${API_BASE_URL}/boards`, {
        method: 'POST',
        body: formData
    }));
};


/**
 * 게시글 수정 조회
 * @param boardId
 * @returns {Promise<{
 *  board: Object,
 *  fileList: Object[]
 * }>}
 */
export const getBoardForModify = (boardId) => {
    return apiRequest(() => fetch(`${API_BASE_URL}/boards/${boardId}/modify`));
};


/**
 * 게시글 수정
 * @param boardId
 * @param formData
 * @returns {Promise<null>}
 * @throws {Error} 응답이 정상(2xx)이 아닐 때
 */
export const modifyBoard = (boardId, formData) => {
    return apiRequest(() => fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'PUT',
        body: formData
    }));
};


/**
 * 게시글 삭제
 * @param boardId
 * @param password
 * @returns {Promise<null>}
 * @throws {Error} 응답이 정상(2xx)이 아닐 때
 */
export const deleteBoard = (boardId, password) => {
    return apiRequest(() => fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            boardId: boardId,
            passwordInput: password
        })
    }));
};

/**
 * 댓글 등록
 * @param boardId
 * @param parentId
 * @param replyContent
 * @returns {Promise<null>}
 * @throws {Error} 응답이 정상(2xx)이 아닐 때
 */
export const registerReply = (boardId, parentId, replyContent) => {
    return apiRequest(() => fetch(`${API_BASE_URL}/boards/${boardId}/replies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            boardId: boardId,
            parentReplyId: parentId,
            content: replyContent
        })
    }));
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
