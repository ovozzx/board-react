export const API_BASE_URL = "http://localhost:8081/api";

// 게시글 목록 조회
export const getBoards = async (params) => {
    return await fetch(`${API_BASE_URL}/boards?${params.toString()}`);
};

// 게시글 상세 조회
export const getBoard = async (boardId) => {
    return await fetch(`${API_BASE_URL}/boards/${boardId}`);
};

// 카테고리 목록 조회
export const getCategories = async () => {
    return await fetch(`${API_BASE_URL}/boards/cateogories`);
};

// 게시글 등록
export const writeBoard = async (formData) => {
    return await fetch(`${API_BASE_URL}/boards`, {
        method: 'POST',
        body: formData
    });
};
// 고차함수와 연관  doSome()()();

// const doSome = ()=>{
//     console.log("1depth")
//     return ()=>{ console.log("2depth")}
// }
//
// doSome(); -> 1
// doSome()(); -> 1, 2
// TODO : 클로즈업, 끌어올리기 (호이스팅) => 둘 관련 있음 / 실행 컨텍스트 / promise 확실하게 (실제 샘플) ** 프라미스 리턴하는 함수 만들어서 그 함수 사용하기 **


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
