# CORS 및 JSON 응답 설정 가이드

## 현재 발생한 문제

### 1. CORS 에러
```
Access to XMLHttpRequest at 'http://localhost:8081/api/list' from origin 'http://localhost:3000'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

### 2. JSON 응답 형식 문제
API가 JSON 대신 Java 객체의 toString() 결과를 반환하고 있습니다:
```
CategoryVO@3693dfe0], boardList=[BoardVO{boardId=53, ...
```

## 해결 방법

### 1. CORS 설정 추가 (Spring Boot)

백엔드 프로젝트에 `WebConfig.java` 파일을 생성하세요:

```java
package com.board.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

또는 **@CrossOrigin 어노테이션** 사용:

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {
    // ...
}
```

### 2. JSON 응답 설정

Controller에서 **@RestController**와 **@ResponseBody**를 사용하여 JSON으로 응답하도록 설정:

#### 올바른 Controller 예시:

```java
@RestController  // @Controller 대신 @RestController 사용
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {

    @Autowired
    private BoardService boardService;

    // 게시판 목록 조회
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getBoardList(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page) {

        Map<String, Object> result = boardService.getBoardList(
            startDate, endDate, categoryId, keyword, page
        );

        return ResponseEntity.ok(result);
    }

    // 카테고리 목록 조회
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryVO>> getCategories() {
        List<CategoryVO> categories = boardService.getCategories();
        return ResponseEntity.ok(categories);
    }
}
```

### 3. 응답 DTO 구조

React에서 예상하는 JSON 응답 형식:

#### 게시판 목록 응답:
```json
{
  "boardList": [
    {
      "boardId": 53,
      "categoryId": 1,
      "categoryName": "Database",
      "title": "첨부 3",
      "content": "3333",
      "createUser": "ㅇ",
      "viewCount": 27,
      "createDate": "2026-02-13T22:30:42",
      "modifyDate": null,
      "hasAttachment": false
    }
  ],
  "totalCount": 100,
  "currentPage": 1,
  "pageCount": 10,
  "startPage": 1,
  "endPage": 10
}
```

#### Service에서 Map 구성 예시:

```java
@Service
public class BoardService {

    @Autowired
    private BoardMapper boardMapper;

    public Map<String, Object> getBoardList(
            String startDate, String endDate,
            int categoryId, String keyword, int page) {

        Map<String, Object> result = new HashMap<>();

        // 검색 조건 설정
        SearchVO searchVO = new SearchVO();
        searchVO.setStartDate(startDate);
        searchVO.setEndDate(endDate);
        searchVO.setCategoryId(categoryId);
        searchVO.setKeyword(keyword);
        searchVO.setPage(page);

        // 게시글 목록 조회
        List<BoardVO> boardList = boardMapper.selectBoardList(searchVO);

        // 전체 개수 조회
        int totalCount = boardMapper.selectBoardCount(searchVO);

        // 페이지 정보 계산
        int pageSize = 10;
        int pageCount = (int) Math.ceil((double) totalCount / pageSize);
        int startPage = ((page - 1) / 10) * 10 + 1;
        int endPage = Math.min(startPage + 9, pageCount);

        // 결과 맵 구성
        result.put("boardList", boardList);
        result.put("totalCount", totalCount);
        result.put("currentPage", page);
        result.put("pageCount", pageCount);
        result.put("startPage", startPage);
        result.put("endPage", endPage);

        return result;
    }
}
```

### 4. Jackson 라이브러리 의존성 확인

`pom.xml` (Maven) 또는 `build.gradle` (Gradle)에 Jackson 라이브러리가 있는지 확인:

#### Maven:
```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

#### Gradle:
```gradle
implementation 'com.fasterxml.jackson.core:jackson-databind'
```

Spring Boot를 사용하면 기본적으로 포함되어 있습니다.

### 5. application.properties 설정

```properties
# JSON 날짜 형식 설정
spring.jackson.date-format=yyyy-MM-dd'T'HH:mm:ss
spring.jackson.time-zone=Asia/Seoul

# NULL 값 제외하지 않음 (선택사항)
spring.jackson.default-property-inclusion=always
```

## 확인 방법

### 1. Postman이나 브라우저에서 직접 테스트:
```
http://localhost:8081/api/list?page=1&categoryId=0
```

응답이 JSON 형식으로 오는지 확인:
```json
{
  "boardList": [...],
  "totalCount": 100,
  ...
}
```

### 2. Response Headers 확인:
```
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
```

## 체크리스트

- [ ] WebConfig.java에 CORS 설정 추가
- [ ] Controller에 @RestController 어노테이션 사용
- [ ] Controller 메서드에서 ResponseEntity 또는 객체 직접 반환
- [ ] Jackson 라이브러리 의존성 확인
- [ ] Postman으로 API 응답이 JSON 형식인지 테스트
- [ ] Response Headers에 Access-Control-Allow-Origin 포함 확인
- [ ] React 앱에서 정상 동작 확인

## 추가 팁

### 개발 환경에서 모든 Origin 허용 (주의: 프로덕션에서는 사용 금지)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")  // 모든 origin 허용
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

### Spring Security 사용 시

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .authorizeRequests()
            .anyRequest().permitAll();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```
