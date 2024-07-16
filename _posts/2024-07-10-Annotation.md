---
title: 어노테이션(Annotation), @
author: pingppung
date: 2024-07-10 13:33:00 +0800
categories: [Development, Spring]
tags: [spring, java]
pin: false
math: true
mermaid: true
---

## 어노테이션
Spring 프레임워크는 다양한 어노테이션을 통해 개발자가 코드를 간결하고 명확하게 작성할 수 있도록 도와줍니다. 여기서 어노테이션은 무엇일까요?<br>

어노테이션(Annotation)은 코드에 추가적인 정보를 제공하는 특별한 표식입니다. 주석처럼 보이지만, 차이점은 실행 중에도 이 정보를 사용할 수 있다는 점입니다. 주석은 단순히 코드에 대한 설명을 추가하는 것이지만, 어노테이션은 프로그램이 실행될 때도 읽히고 사용될 수 있습니다.

### 어노테이션의 역할
Spring 프레임워크에서는 어노테이션을 사용해 다음과 같은 작업을 할 수 있습니다:

1. **Bean 정의**: Spring이 관리할 객체(Bean)를 정의할 때 사용합니다.

2. **의존성 주입**: 객체들 간의 의존 관계를 설정할 때 사용합니다.

3. **요청 매핑**: 웹 요청을 특정 메서드와 연결할 때 사용합니다.

쉽게 말해, 어노테이션은 Spring에게 "이 객체는 Bean으로 관리해줘", "이 메서드는 웹 요청을 처리해줘" 등의 지시를 내리는 도구입니다.

## 주요 어노테이션

### @Component, @Service, @Repository
이 어노테이션들은 Spring의 컴포넌트 스캔을 통해 자동으로 Bean으로 등록됩니다.

- `@Component`: 일반적인 Spring 관리 객체에 사용

- `@Service`: 서비스 레이어에 사용, 비즈니스 로직을 포함

- `@Repository`: 데이터 접근 객체(DAO)에 사용, 예외 처리를 Spring의 데이터 접근 예외로 변환

```java
@Component
public class MyComponent {
    ...
}

@Service
public class MyService {
    ...
}

@Repository
public class MyRepository {
    ...
}
```

### @Autowired
의존성 주입을 위해 사용됩니다. 생성자, 필드, 메서드에 적용할 수 있습니다.

```java
@Service
public class MyService {

    @Autowired
    private MyRepository myRepository;
    ...
}
```

### @Configuration, @Bean
Spring 설정 클래스를 정의하고 Bean을 생성하는 방법을 제공합니다.

- `@Configuration`: 하나 이상의 @Bean 메서드를 포함하는 클래스에 사용

- `@Bean`: Spring 컨테이너가 관리하는 Bean을 생성하는 메서드에 사용

```java
@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyService();
    }
}
```
### @Controller, @RestController
Spring MVC에서 컨트롤러 역할을 하는 클래스에 사용됩니다.

- `@Controller`: 뷰를 반환하는 컨트롤러에 사용

- `@RestController`: RESTful 웹 서비스의 컨트롤러에 사용, JSON/XML 형태로 객체 반환

```java
@Controller
public class MyController {

    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }
}

@RestController
public class MyRestController {

    @GetMapping("/api/hello")
    public String apiHello() {
        return "hello";
    }
}
```
### @RequestMapping, @GetMapping, @PostMapping
HTTP 요청을 처리하기 위한 매핑 어노테이션입니다.

- `@RequestMapping`: 모든 HTTP 메서드를 처리

- `@GetMapping`: HTTP GET 요청을 처리

- `@PostMapping`: HTTP POST 요청을 처리

```java
@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/items")
    public List<Item> getItems() {
        return itemService.getAllItems();
    }

    @PostMapping("/items")
    public Item createItem(@RequestBody Item item) {
        return itemService.saveItem(item);
    }
}
```
### @Transactional
<a href="https://pingppung.github.io/posts/Transaction/">트랜잭션 관리</a>를 위한 어노테이션입니다. 메서드나 클래스에 적용하여 해당 범위 내의 작업을 트랜잭션으로 묶어줍니다.

```java
@Service
public class MyService {

    @Transactional
    public void performTransaction() {
        // 트랜잭션 내에서 실행될 코드
    }
}
```
### @Valid, @NotNull, @Size
데이터 유효성 검사를 위한 어노테이션입니다.

- `@Valid`: 객체의 유효성을 검사

- `@NotNull`: 필드가 null이 아니어야 함을 명시

- `@Size`: 문자열, 배열 등의 크기를 제한

```java
public class User {

    @NotNull
    private String username;

    @Size(min = 6, max = 20)
    private String password;
    ...
}

@RestController
@RequestMapping("/users")
public class UserController {

    @PostMapping
    public ResponseEntity<String> createUser(@Valid @RequestBody User user) {   
        ...
        return ResponseEntity.ok("유저 생성 성공");
    }
}
```