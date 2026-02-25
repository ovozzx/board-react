# 게시판 React 프로젝트

## 실행 방법

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 → 자동으로 `/board/list`로 이동

## API 서버 설정

백엔드 API 서버가 `http://localhost:8081`에서 실행되어야 합니다.

### 필요한 API 엔드포인트

```
GET http://localhost:8081/api/list?page=1&keyword=&categoryId=0
```

### 응답 형식

```json
{
  "categoryList": [
    {
      "categoryId": 1,
      "categoryName": "Database"
    }
  ],
  "boardList": [
    {
      "boardId": "1",
      "categoryName": "Database",
      "title": "게시글 제목",
      "createUser": "작성자",
      "viewCount": 10,
      "createDate": "2026-02-13 22:30:42",
      "hasAttachment": false
    }
  ],
  "pageInfo": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5,
    "startPage": 1,
    "endPage": 5,
    "totalCount": 48
  }
}
```

## 백엔드 CORS 설정

`WebConfig.java`:

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

    @Bean
    public CharacterEncodingFilter characterEncodingFilter() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        filter.setForceEncoding(true);
        return filter;
    }
}
```

## UTF-8 인코딩 설정

`application.properties`:

```properties
# UTF-8 인코딩
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true

# MySQL 연결 (중요!)
spring.datasource.url=jdbc:mysql://localhost:3306/your_db?useUnicode=true&characterEncoding=utf8mb4&serverTimezone=Asia/Seoul
```

## 기능

- ✅ 게시판 목록 조회
- ✅ 카테고리 선택 검색
- ✅ 키워드 검색
- ✅ 페이지네이션

## 구조

```
src/app/
├── board/
│   └── list/
│       └── page_bk.js    # 게시판 목록 페이지
├── layout.js
└── page_bk.js            # 메인 (자동으로 /board/list로 리다이렉트)
```