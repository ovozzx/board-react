'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 클라이언트 컴포넌트에서 "코드로 페이지 이동"하려면 useRouter()를 써야 한다. => 페이지 전체 새로고침 안 함 (필요 부분만 교체)
import {getBoardForEdit, getBoardForModify, updateBoard} from "@/api/apiUrl";
import Loading from "@/components/common/Loading";

export default function BoardModifyPage({params}) { // params: { boardId: "5" },
    const router = useRouter();
    const [data, setData] = useState(null);
    const boardId = params.boardId; // Next.js => [폴더명] = URL 파라미터
    const [createUser, setCreateUser] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [fileInputs, setFileInputs] = useState([[], [], []]); // 추가 첨부파일
    const [deleteFileIds, setDeleteFileIds] = useState([]); // 삭제 첨부파일
    const [errors, setErrors] = useState({ passwordRegex: false });
    const [saveDisabled, setSaveDisabled] = useState(true);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{4,15}$/;

    useEffect(() => {
        fetchBoardModify(boardId);
    }, []);

    // 입력 검증
    useEffect(() => {
        const allFilled = createUser && passwordInput && title && content;
        const passwordValid = passwordRegex.test(passwordInput);

        setErrors({
            passwordRegex: !passwordValid
        });

        setSaveDisabled(!(allFilled && passwordValid));
    }, [createUser, passwordInput, title, content]);


    const fetchBoardModify = async (boardId) => {

        const res = await getBoardForModify(boardId);

        const result = await res.json(); // response 객체 변환
        setData(result);
        setCreateUser(result.board.createUser);
        setTitle(result.board.title);
        setContent(result.board.content);
    };

    if (!data) return <Loading />;

    const handleModifySubmit = async (e) => {
        e.preventDefault(); // form의 기본 제출 동작(페이지 새로고침)을 막음 => router.push가 정상 실행
        if (saveDisabled) return;

        const formData = new FormData();
        formData.append('boardId', boardId);
        formData.append('createUser', createUser);
        formData.append('passwordInput', passwordInput);
        formData.append('title', title);
        formData.append('content', content);
        deleteFileIds.forEach(id => formData.append('deleteIds', id));
        fileInputs.flat().forEach(file => formData.append('attachmentList', file));
        // flat() = "배열 안 배열을 풀어서 1차원 배열로 만들어주는 함수". 안쓰면 배열 자체가 들어가서 서버에서 제대로 인식 안됨
        try {
            const res = await updateBoard(formData);

            if (res.ok) {
                alert("수정이 완료되었습니다.");
                window.location.href = `/board/view/${boardId}`; // SSR 페이지는 하드 네비게이션으로 최신 데이터 반영
            } else {
                res.text().then(msg => alert(msg)); // res.text() / res.json() → Promise 반환 ==> await 또는 then 으로 결과 받아야 함
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류');
        }
    };

    const handleFileChange = (index, e) => {
        const updated = [...fileInputs]; // 기존 배열을 복사해서 새로운 배열 생성
        updated[index] = [...e.target.files]; // 배열 복사! e.target.files → FileList 객체. 선택된 파일이 하나라도 FileList[0] 형태로 들어있음 => 파일 하나라도 배열처럼 다뤄야 함
        setFileInputs(updated);
    };

    // 파일 삭제
    const handleDeleteExistingFile = (fileId) => {
        setDeleteFileIds(prev => [...prev, fileId]);
        setData(prev => ({
            ...prev,
            fileList: prev.fileList.filter(file => file.attachmentId !== fileId)
        }));
        console.log("삭제 id : ", deleteFileIds);
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                게시판 - 수정
            </h1>

            <form onSubmit={handleModifySubmit}>
                <div className="border border-gray-200 rounded-lg overflow-hidden">

                    {/* 카테고리 */}
                    <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">카테고리</div>
                        <div className="px-4 py-3">
                            <input
                                type="text"
                                value={data.board.categoryName}
                                readOnly
                                className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-500 bg-gray-50 focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* 작성자 / 등록일시 / 수정일시 */}
                    <div className="grid grid-cols-[120px_1fr_120px_1fr_120px_1fr] border-b border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">작성자</div>
                        <div className="px-4 py-3">
                            <input
                                type="text"
                                name="createUser"
                                value={createUser}
                                onChange={(e) => setCreateUser(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">등록일시</div>
                        <div className="px-4 py-3 text-sm text-gray-700 flex items-center">{data.board.createDate}</div>
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">수정일시</div>
                        <div className="px-4 py-3 text-sm text-gray-700 flex items-center">{data.board.modifyDate || "-"}</div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">비밀번호</div>
                        <div className="px-4 py-3">
                            <input
                                type="password"
                                name="password"
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full max-w-xs border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* 제목 */}
                    <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">제목</div>
                        <div className="px-4 py-3">
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* 내용 */}
                    <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">내용</div>
                        <div className="px-4 py-3">
                            <textarea
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={10}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* 첨부 파일 */}
                    <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">기존 파일</div>
                        <div className="px-4 py-3 space-y-1">
                            {data.fileList?.map(file => (
                                <div key={file.attachmentId} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">{file.originalName}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingFile(file.attachmentId)}
                                        className="text-xs text-red-500 border border-red-300 rounded px-2 py-0.5 hover:bg-red-50 transition-colors"
                                    >
                                        삭제
                                    </button>
                                </div>
                            ))}
                            {/*남은 것만큼 input 생성 = 3 - 기존 파일 수*/}
                            {/*(element, index) => index ===> 각 요소를 어떻게 채울지 결정하는 콜백 == “각 요소를 인덱스로 채워라”*/}
                            {Array.from({length: 3 - (data.fileList?.length || 0)}, (element, index) => index).map(arrElement => ( // 배열 요소값, 배열 인덱스 파라미터 순서로 구분
                                <input
                                    key={arrElement + data.fileList?.length}
                                    type="file"
                                    onChange={(e) => handleFileChange(arrElement + data.fileList?.length, e)}
                                    className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:text-gray-600 file:bg-white hover:file:bg-gray-50"
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => router.push(`/board/view/${boardId}`)}
                        className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={saveDisabled}
                        className={`px-4 py-2 rounded text-sm text-white transition-colors ${saveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}
