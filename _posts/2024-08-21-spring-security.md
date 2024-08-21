---
title: Spring Security 인증 요청 처리 과정
author: pingppung
date: 2024-08-21 09:00:00 +0800
categories: [Programming, React, Spring]
tags: [jwt, spring, java, react, javascript, web, security]
pin: false
math: false
mermaid: false
---


Spring Security에서 인증 요청이 처리되는 과정은 여러 단계로 이루어지며, 각 단계마다 특정 클래스들이 관여합니다. 여기서는 JWT 인증을 사용하는 시나리오를 예로 들어, 로그인 요청이 들어올 때 Spring Security가 어떻게 처리하는지 순서대로 설명하겠습니다.

## Spring Security의 인증 처리 과정

Spring Security에서 로그인 요청이 들어오면, 인증을 처리하기 위해 여러 클래스가 순차적으로 동작합니다. 이 과정은 사용자 요청이 서버에 들어온 순간부터, 그 사용자가 누구인지 확인하고, 인증된 정보를 안전하게 관리하는 일련의 흐름입니다. 이를 통해 애플리케이션은 사용자가 누구인지 확실히 알고, 그에 맞는 권한을 부여하여 안전한 환경을 유지할 수 있습니다.

아래는 Spring Security가 사용자의 인증을 처리하는 일반적인 흐름입니다.

1. **요청 수신**  
   사용자가 로그인 또는 보호된 리소스에 접근합니다.

2. **Authentication Filter가 요청 가로채기**  
   요청이 서버에 도착하면 **Authentication Filter**가 이를 가로채어 인증이 필요한지 확인합니다.

3. **Authentication Manager로 요청 전달**  
   **Authentication Filter**는 요청을 **Authentication Manager**에게 넘겨 인증 작업을 처리하도록 합니다.

4. **Authentication Provider에서 인증 처리**  
   **Authentication Manager**는 여러 **Authentication Provider** 중 적절한 것을 선택하여 사용자의 자격 증명을 검증합니다.

5. **UserDetailsService에서 사용자 정보 조회**  
   **Authentication Provider**는 **UserDetailsService**를 통해 사용자 정보를 데이터베이스에서 조회합니다.

6. **SecurityContextHolder에 인증 정보 저장**  
   인증이 성공하면, 인증된 사용자 정보는 **SecurityContextHolder**에 저장됩니다.

7. **Spring Controller에서 인증 정보 사용**  
   인증된 정보는 애플리케이션에서 요청을 처리하고, 사용자 권한을 확인하는 데 사용됩니다.


## spring security 내부 구조 흐름

#### 1. **SecurityContextHolder**
- **SecurityContextHolder**는 인증 정보를 저장하고 관리하는 역할을 합니다.

#### 2. **Authentication**
- **Authentication** 객체는 사용자 인증 상태를 나타내며, 인증된 사용자의 정보를 포함합니다.

#### 3. **AuthenticationManager**
- **AuthenticationManager**는 다양한 인증 제공자를 관리하며, 인증 요청을 처리합니다.

#### 4. **AuthenticationProvider**
- **AuthenticationProvider**는 특정 인증 논리를 처리하며, 필요한 경우 **UserDetailsService**를 사용해 사용자 정보를 로드합니다.

#### 5. **UserDetailsService**
- **UserDetailsService**는 사용자 정보를 로드하여 **UserDetails** 객체로 반환합니다.

#### 6. **UserDetails**
- **UserDetails**는 사용자 이름, 비밀번호, 권한 등의 정보를 담고 있습니다.객체입니다.

#### 7. **PasswordEncoder**
- **PasswordEncoder**는 비밀번호를 인코딩하고, 비밀번호 검증을 수행합니다.

#### 8. **Security Filters**
- Spring Security의 필터들은 인증 외에도 다양한 보안 기능을 처리합니다. 예를 들어, **UsernamePasswordAuthenticationFilter**는 로그인 요청을 처리하고, **BasicAuthenticationFilter**는 HTTP 기본 인증을 처리하는 등의 역할을 합니다.
