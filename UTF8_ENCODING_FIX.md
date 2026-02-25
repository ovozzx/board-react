# UTF-8 인코딩 문제 해결 가이드

## 현재 문제

API 응답에서 한글이 깨져서 나타남:
```
"title":"泥⑤� 3"
"createUser":"��"
```

정상적으로 표시되어야 할 내용:
```
"title":"첨부 3"
"createUser":"ㅇ"
```

## 해결 방법 (Spring Boot)

### 1. application.properties 설정

`src/main/resources/application.properties`에 다음 설정 추가:

```properties
# UTF-8 인코딩 설정
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true

# HTTP 메시지 변환기 인코딩
spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
spring.http.encoding.force=true

# JSON 응답 인코딩
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=Asia/Seoul

# Thymeleaf 인코딩 (사용하는 경우)
spring.thymeleaf.encoding=UTF-8

# 데이터베이스 인코딩 (MySQL 사용 시)
spring.datasource.url=jdbc:mysql://localhost:3306/your_database?useUnicode=true&characterEncoding=utf8mb4&serverTimezone=Asia/Seoul
```

### 2. WebMvcConfigurer 설정 추가

기존 `WebConfig.java`에 인코딩 필터 추가:

```java
package com.board.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.charset.StandardCharsets;
import java.util.List;

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

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        stringConverter.setWriteAcceptCharset(false);
        converters.add(stringConverter);
    }
}
```

### 3. pom.xml 설정 (Maven 사용 시)

```xml
<project>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
    </properties>
</project>
```

### 4. MyBatis 설정 (MyBatis 사용 시)

`mybatis-config.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="jdbcTypeForNull" value="NULL"/>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
</configuration>
```

### 5. 데이터베이스 인코딩 확인 (MySQL)

```sql
-- 데이터베이스 인코딩 확인
SHOW VARIABLES LIKE 'character%';

-- 테이블 인코딩 확인
SHOW CREATE TABLE board;

-- 테이블 인코딩 변경 (필요 시)
ALTER TABLE board CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE category CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 데이터베이스 기본 인코딩 설정
ALTER DATABASE your_database CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
```

### 6. Tomcat 설정 (Tomcat 사용 시)

`server.xml`:

```xml
<Connector port="8081"
           protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443"
           URIEncoding="UTF-8"
           useBodyEncodingForURI="true"/>
```

## 확인 방법

### 1. Postman으로 테스트

```
GET http://localhost:8081/api/list?page=1
```

응답 헤더 확인:
```
Content-Type: application/json;charset=UTF-8
```

응답 본문에서 한글이 제대로 표시되는지 확인:
```json
{
  "boardList": [
    {
      "title": "첨부 3",
      "createUser": "ㅇ"
    }
  ]
}
```

### 2. 브라우저 개발자 도구

Network 탭에서:
- Response Headers: `Content-Type: application/json;charset=UTF-8`
- Response Preview: 한글이 깨지지 않고 표시됨

## IDE 설정 (IntelliJ IDEA)

1. **File > Settings > Editor > File Encodings**
   - Global Encoding: UTF-8
   - Project Encoding: UTF-8
   - Default encoding for properties files: UTF-8

2. **소스 파일 인코딩**
   - 모든 `.java`, `.xml`, `.properties` 파일이 UTF-8로 저장되어 있는지 확인

## 빠른 체크리스트

- [ ] application.properties에 UTF-8 설정 추가
- [ ] WebConfig에 CharacterEncodingFilter 추가
- [ ] pom.xml 또는 build.gradle에 UTF-8 인코딩 설정
- [ ] 데이터베이스 테이블 인코딩이 utf8mb4인지 확인
- [ ] MyBatis 설정 확인 (사용하는 경우)
- [ ] IDE 인코딩 설정이 UTF-8인지 확인
- [ ] 서버 재시작
- [ ] Postman으로 API 응답 확인
- [ ] React 앱에서 한글 정상 표시 확인

## 여전히 문제가 있다면

1. **서버 재시작**: 설정 변경 후 반드시 서버 재시작
2. **브라우저 캐시 삭제**: Ctrl+Shift+R (강제 새로고침)
3. **데이터베이스 데이터 확인**: DB에 저장된 데이터 자체가 깨져있을 수 있음
4. **로그 확인**: 서버 콘솔에서 인코딩 관련 경고/에러 확인

## 추가 참고사항

### Response 헤더 직접 설정

Controller에서 직접 Content-Type 설정:

```java
@GetMapping(value = "/list", produces = "application/json;charset=UTF-8")
public ResponseEntity<Map<String, Object>> getBoardList(...) {
    // ...
}
```

### Spring Boot 2.x 이상

Spring Boot 2.x 이상에서는 기본적으로 UTF-8이 설정되어 있지만,
명시적으로 설정하는 것이 안전합니다.
