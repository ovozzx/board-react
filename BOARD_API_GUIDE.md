# 게시판 React 프로젝트 - API 연동 가이드

## 프로젝트 구조

```
board/
├── src/
│   ├── app/
│   │   ├── board/
│   │   │   └── list/
│   │   │       ├── page_bk.js      # 게시판 목록 페이지
│   │   │       └── list.css     # 게시판 스타일
│   │   ├── layout.js
│   │   └── page_bk.js
│   └── lib/
│       └── api.js               # API 호출 함수 모음
└── package.json
```

## 실행 방법

### 1. 개발 서버 실행

```bash
cd board
npm run dev
```

기본적으로 `http://localhost:3000`에서 실행됩니다.

### 2. 게시판 목록 페이지 접속

```
http://localhost:3000/board/list
```

## API 연동 정보

### API 서버 주소

```
http://localhost:8081/api
```

### 필요한 API 엔드포인트

#### 1. 카테고리 목록 조회

```
GET /api/categories
```

**응답 예시:**
```json
[
  {
    "categoryId": 1,
    "categoryName": "공지사항"
  },
  {
    "categoryId": 2,
    "categoryName": "자유게시판"
  }
]
```

#### 2. 게시판 목록 조회

```
GET /api/boards?page=1&startDate=2024-01-01&endDate=2024-12-31&categoryId=0&keyword=검색어
```

**요청 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `startDate`: 검색 시작일 (YYYY-MM-DD)
- `endDate`: 검색 종료일 (YYYY-MM-DD)
- `categoryId`: 카테고리 ID (0: 전체)
- `keyword`: 검색 키워드 (제목+작성자+내용)

**응답 예시:**
```json
{
  "boardList": [
    {
      "boardId": 1,
      "categoryName": "자유게시판",
      "title": "게시글 제목",
      "createUser": "작성자",
      "viewCount": 10,
      "createDate": "2024-01-01T12:00:00",
      "modifyDate": "2024-01-02T15:30:00",
      "hasAttachment": true
    }
  ],
  "totalCount": 100,
  "currentPage": 1,
  "pageCount": 10,
  "startPage": 1,
  "endPage": 10
}
```

#### 3. 게시판 상세 조회

```
GET /api/boards/{boardId}
```

**응답 예시:**
```json
{
  "boardId": 1,
  "categoryId": 2,
  "categoryName": "자유게시판",
  "title": "게시글 제목",
  "content": "게시글 내용",
  "createUser": "작성자",
  "viewCount": 10,
  "createDate": "2024-01-01T12:00:00",
  "modifyDate": "2024-01-02T15:30:00",
  "attachments": [
    {
      "fileId": 1,
      "fileName": "파일명.pdf",
      "fileSize": 102400
    }
  ]
}
```

#### 4. 게시판 등록

```
POST /api/boards
Content-Type: multipart/form-data
```

**요청 데이터:**
- `categoryId`: 카테고리 ID (required)
- `title`: 제목 (4~100자, required)
- `createUser`: 작성자 (3~5자, required)
- `password`: 비밀번호 (4~16자, required)
- `content`: 내용 (4~2000자, required)
- `files`: 첨부파일 (multiple files, optional)

#### 5. 게시판 수정

```
PUT /api/boards/{boardId}
Content-Type: multipart/form-data
```

**요청 데이터:**
- `categoryId`: 카테고리 ID (required)
- `title`: 제목 (4~100자, required)
- `createUser`: 작성자 (3~5자, required)
- `password`: 비밀번호 (4~16자, required)
- `content`: 내용 (4~2000자, required)
- `files`: 추가 첨부파일 (multiple files, optional)

#### 6. 게시판 삭제

```
DELETE /api/boards/{boardId}
```

#### 7. 댓글 목록 조회

```
GET /api/boards/{boardId}/comments
```

**응답 예시:**
```json
[
  {
    "commentId": 1,
    "content": "댓글 내용",
    "createUser": "댓글작성자",
    "createDate": "2024-01-01T13:00:00"
  }
]
```

#### 8. 댓글 등록

```
POST /api/boards/{boardId}/comments
Content-Type: application/json
```

**요청 데이터:**
```json
{
  "content": "댓글 내용"
}
```

#### 9. 첨부파일 다운로드

```
GET /api/files/{fileId}
```

## 주요 기능

### 1. 검색 기능
- 등록일 범위 검색 (시작일 ~ 종료일)
- 카테고리 선택 검색
- 키워드 검색 (제목, 작성자, 내용)

### 2. 게시판 목록
- 카테고리, 제목, 작성자, 조회수, 등록일시, 수정일시 표시
- 첨부파일 아이콘 표시
- 제목 길이 제한 (80자 초과 시 말줄임표)
- 수정일시 없을 경우 "-" 표시

### 3. 페이지네이션
- 맨 처음으로 (<<)
- 이전 페이지 (<)
- 페이지 번호 (현재 페이지 강조)
- 다음 페이지 (>)
- 맨 마지막으로 (>>)

### 4. 게시글 등록
- 하단의 "등록" 버튼 클릭

## API 서버 설정 필요사항

### CORS 설정

React 앱이 `http://localhost:3000`에서 실행되므로,
백엔드 API 서버(`http://localhost:8081`)에서 CORS를 허용해야 합니다.

**Spring Boot 예시:**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 구현된 페이지

모든 주요 기능이 구현되었습니다:
- ✅ 게시판 목록 (`/board/list`)
- ✅ 게시판 상세 (`/board/view?boardId=1`)
- ✅ 게시판 등록 (`/board/write`)
- ✅ 게시판 수정 (`/board/edit?boardId=1`)

## 페이지별 기능

### 1. 게시판 목록 (`/board/list`)
- 검색 기능 (날짜, 카테고리, 키워드)
- 페이지네이션
- 게시글 목록 테이블
- 등록 버튼

### 2. 게시판 상세 (`/board/view`)
- 게시글 상세 내용 조회
- 첨부파일 다운로드
- 댓글 작성 및 조회
- 수정/삭제 버튼
- 목록으로 돌아가기

### 3. 게시판 등록 (`/board/write`)
- 카테고리 선택
- 제목, 작성자, 비밀번호, 내용 입력
- 첨부파일 업로드
- 유효성 검사

### 4. 게시판 수정 (`/board/edit`)
- 기존 게시글 정보 불러오기
- 비밀번호 확인
- 내용 수정
- 추가 첨부파일 업로드

## 문제 해결

### API 연결 실패 시
1. 백엔드 서버가 `http://localhost:8081`에서 실행 중인지 확인
2. CORS 설정이 올바른지 확인
3. 브라우저 개발자 도구의 Network 탭에서 API 응답 확인

### 페이지가 표시되지 않을 때
1. `npm run dev` 명령으로 개발 서버 실행 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. `/board/list` 경로로 정확히 접속했는지 확인