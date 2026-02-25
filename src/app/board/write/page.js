'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/api/apiUrl';
import { useRouter } from 'next/navigation';

export default function BoardWritePage() {
    const router = useRouter();
    const [createUser, setCreateUser] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [fileInputs, setFileInputs] = useState([[], [], []]);
    const [errors, setErrors] = useState({ passwordMatch: false, passwordRegex: false });
    const [saveDisabled, setSaveDisabled] = useState(true);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{4,15}$/;

    const [categoryList, setCategoryList] = useState(null);

    const fetchCategoryList = async () => {
        const res = await fetch(`${API_BASE_URL}/board/write`);
        const categoryList = await res.json();
        setCategoryList(categoryList);
        console.log(categoryList);
    };

    useEffect(() => {
        fetchCategoryList();
    }, []);

    useEffect(() => {
        if (categoryList && categoryList.length > 0 && !categoryId) {
            setCategoryId(categoryList[0].categoryId);
        }
    }, [categoryList]);

    // 입력 검증
    useEffect(() => {
        const allFilled = createUser && password && passwordConfirm && title && content && categoryId;
        const passwordMatch = password === passwordConfirm;
        const passwordValid = passwordRegex.test(password);

        setErrors({
            passwordMatch: !passwordMatch,
            passwordRegex: !passwordValid
        });

        setSaveDisabled(!(allFilled && passwordMatch && passwordValid));
    }, [createUser, password, passwordConfirm, title, content, categoryId]);

    const handleFileChange = (index, e) => {
        const updated = [...fileInputs]; // 기존 배열을 복사해서 새로운 배열 생성
        updated[index] = [...e.target.files]; // 배열 복사! e.target.files → FileList 객체. 선택된 파일이 하나라도 FileList[0] 형태로 들어있음 => 파일 하나라도 배열처럼 다뤄야 함
        setFileInputs(updated);
    };
    // TODO : 최대 10개, 가변 '+' 클릭

    const handleSubmit = async () => {
        if (saveDisabled) return;

        const formData = new FormData();
        formData.append('createUser', createUser);
        formData.append('userPassword', password);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('categoryId', categoryId);
        fileInputs.flat().forEach(file => formData.append('attachmentList', file));
        // flat() = "배열 안 배열을 풀어서 1차원 배열로 만들어주는 함수". 안쓰면 배열 자체가 들어가서 서버에서 제대로 인식 안됨
        try {
            const res = await fetch(`${API_BASE_URL}/board/write`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                router.push('/board/list');
            } else {
                alert('등록 실패');
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                게시판 - 등록
            </h1>

            <div className="border border-gray-200 rounded-lg overflow-hidden">

                {/* 카테고리 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">카테고리</div>
                    <div className="px-4 py-3">
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            {categoryList?.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 작성자 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">작성자</div>
                    <div className="px-4 py-3">
                        <input
                            type="text"
                            placeholder="작성자"
                            value={createUser}
                            onChange={(e) => setCreateUser(e.target.value)}
                            className="w-full max-w-xs border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* 비밀번호 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">비밀번호</div>
                    <div className="px-4 py-3 space-y-2">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full max-w-xs border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            placeholder="비밀번호 확인"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            className="w-full max-w-xs border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        {errors.passwordMatch && <p className="text-red-500 text-xs">비밀번호가 일치하지 않습니다.</p>}
                        {errors.passwordRegex && <p className="text-red-500 text-xs">영문/숫자/특수문자 포함 4~15자여야 합니다.</p>}
                    </div>
                </div>

                {/* 제목 */}
                <div className="grid grid-cols-[120px_1fr] border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">제목</div>
                    <div className="px-4 py-3">
                        <input
                            type="text"
                            placeholder="제목"
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
                            placeholder="내용"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* 첨부파일 */}
                <div className="grid grid-cols-[120px_1fr]">
                    <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">첨부파일</div>
                    <div className="px-4 py-3 space-y-2">
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 w-4">{index + 1}</span>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(index, e)}
                                    className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:text-gray-600 file:bg-white hover:file:bg-gray-50"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={() => router.push('/board/list')}
                    className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={saveDisabled}
                    className={`px-4 py-2 rounded text-sm text-white transition-colors ${saveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    저장
                </button>
            </div>
        </div>
    );
}
