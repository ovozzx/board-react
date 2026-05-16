import {z} from 'zod'

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{4,15}$/;

export const writeBoardValidate =
    z.object({
    createUser: z.string().min(1, '작성자는 필수'),
    password: z.string().regex(passwordRegex, '영문/숫자/특수문자 포함 4~15자여야 합니다'),
    passwordConfirm: z.string().min(1),
    title: z.string().min(1, '제목 필수'),
    content: z.string().min(1, '내용 필수'),
    categoryId: z.string().min(1, '카테고리 필수')
    }).refine(data => data.password === data.passwordConfirm, { // 직접 짠 로직 검증
        // data : 위에서 정의한 객체 스키마의 필드들이 통째로 담긴 객체
        message: '비밀번호 불일치',
        path: ['passwordConfirm'] // 에러가 어느 필드에 관한 건지 지정
    });

export const modifyBoardValidate = z.object({
    createUser: z.string().min(1, '작성자는 필수'),
    userPassword: z.string().min(1),
    title: z.string().min(1, '제목 필수'),
    content: z.string().min(1, '내용 필수')
});