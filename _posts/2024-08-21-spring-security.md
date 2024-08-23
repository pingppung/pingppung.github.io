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

## Spring Security란?
Spring Security는 Java 애플리케이션에서 보안을 관리하는 데 도움을 주는 프레임워크입니다. 주로 인증과 권한 부여를 처리하는 데 사용됩니다. 인증은 사용자가 누구인지 확인하는 과정이고, 권한 부여는 사용자가 어떤 자원에 접근할 수 있는지를 결정하는 과정입니다.

- **인증(Autentication)** : 사용자가 로그인할 때, Spring Security는 사용자가 누구인지 확인합니다. 예를 들어, 아이디와 비밀번호를 입력하면, 이 정보를 바탕으로 사용자가 올바른지 검증합니다.

- **권한 부여(Authorization)** : 사용자가 인증된 후, 어떤 자원이나 기능에 접근할 수 있는지를 결정합니다. 예를 들어, 관리자만 접근할 수 있는 페이지가 있다면, Spring Security는 인증된 사용자의 권한을 확인하여 이 페이지에 접근할 수 있는지 결정합니다.

## Spring Security의 인증 처리 과정

Spring Security는 사용자가 로그인할 때 인증을 처리하기 위해 여러 클래스를 순차적으로 사용합니다. 이 과정은 요청이 서버에 도착한 순간부터 사용자가 누구인지 확인하고, 인증된 정보를 안전하게 관리하는 흐름입니다. 이를 통해 애플리케이션은 사용자의 신원을 확실히 확인하고, 적절한 권한을 부여하여 보안을 유지합니다.

아래는 Spring Security가 사용자의 인증을 처리하는 일반적인 흐름입니다.

![Security](https://pingppung.github.io/assets/img/posts/2024-08-21/architecture.png)


1. 사용자가 애플리케이션에 로그인하거나 보호된 리소스에 접근하려고 할 때 요청이 서버에 도착합니다.

2. **Authentication Filter**가 요청을 가로채어 인증이 필요한지 확인합니다.

3. 인증이 필요한 경우, **AuthenticationFilter**는 요청을 **AuthenticationManager**에게 넘겨 실제 인증 작업을 처리하도록 합니다.

4. **AuthenticationManager**는 여러 Authentication Provider 중에서 적절한 것을 선택해 사용자의 자격 증명(예: 아이디와 비밀번호)을 검증합니다.

5. **AuthenticationProvider**는 사용자의 자격 증명을 검증하기 위해 UserDetailsService를 사용하여 데이터베이스나 다른 저장소에서 사용자 정보를 조회합니다.

6. 인증이 성공하면, 인증된 사용자 정보는 **SecurityContextHolder**에 저장됩니다. 이 정보는 사용자의 인증 상태를 나타내며, 애플리케이션 전반에서 활용됩니다.

7. 인증된 정보는 **SecurityContextHolder**를 통해 접근할 수 있으며, 애플리케이션의 다른 부분, 특히 Spring Controller에서 사용자의 권한을 확인하고 요청을 처리하는 데 사용됩니다.

8. 인증이 완료된 후, **SecurityContextHolder**에 저장된 사용자 인증 정보는 Spring Security가 제공하는 다양한 기능에서 활용됩니다. 예를 들어, 애플리케이션 내의 접근 제어와 권한 부여에서 이 정보를 사용합니다.

9. 사용자가 애플리케이션의 다른 보호된 리소스에 접근하려고 할 때, **SecurityContextHolder**에 저장된 인증 정보는 다시 **AuthenticationFilter**를 거쳐 확인됩니다. 이로 인해 사용자는 재인증 없이도 동일한 세션 내에서 계속해서 보호된 리소스에 접근할 수 있습니다.

10. 최종적으로, 인증된 사용자에 대한 정보와 권한은 애플리케이션의 비즈니스 로직이나 프레젠테이션 계층에서 활용되며, 사용자에게 적절한 권한을 부여하고, 보호된 리소스에 대한 접근을 제어하는 데 사용됩니다.


## spring security 내부 구조 흐름

https://velog.io/@jinjukim-dev/Spring-Security  
| **클래스**              | **역할**                                                                 |
|--------------------------|--------------------------------------------------------------------------|
| **SecurityContextHolder** | 인증 정보를 저장하고 관리하는 중심 역할을 담당합니다.                   |
| **Authentication**        | 사용자 인증 상태를 나타내며, 인증된 사용자의 정보를 포함합니다.          |
| **AuthenticationManager** | 다양한 인증 제공자를 관리하며, 인증 요청을 처리합니다.                 |
| **AuthenticationProvider**| 특정 인증 논리를 처리하며, **UserDetailsService**를 통해 사용자 정보를 로드합니다.|
| **UserDetailsService**    | 사용자 정보를 로드하여 **UserDetails** 객체로 반환합니다.               |
| **PasswordEncoder**       | 비밀번호를 인코딩하고, 비밀번호 검증을 수행합니다.                      |
| **Security Filters**      | 다양한 보안 기능을 처리합니다.                                        |

## security Filter Chain