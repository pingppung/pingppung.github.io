---
title: Spring MVC의 구조
author: pingppung
date: 2024-06-30 13:33:00 +0800
categories: [Development, Spring]
tags: [spring, mvc]
pin: false
math: false
mermaid: true
---

## MVC 패턴이란?
MVC (모델-뷰-컨트롤러) 패턴은 소프트웨어 디자인 패턴으로, 애플리케이션을 세 가지 주요 부분으로 나누어 개발합니다. 이 패턴은 사용자 인터페이스, 데이터, 그리고 비즈니스 로직을 더 쉽게 관리하고 유지보수하기 위해 널리 사용됩니다.

![MVC_Pattern](https://pingppung.github.io/assets/img/posts/2024-06-30/mvc패턴.PNG)

- **`Model(모델)`**
    > 모델은 데이터와 게임 로직을 담당
    - 비즈니스 로직과 데이터 상태를 관리
    - 데이터의 상태 변화와 업데이트를 처리
    - 데이터를 가져오거나 업데이트하는 데 필요한 메서드와 속성을 제공

- **`View(뷰)`**
    > 뷰는 사용자 인터페이스와 출력을 담당
    - 사용자 인터페이스(UI)를 나타내며, 데이터를 표시하고 사용자 입력을 받음
    - 모델의 변경 사항을 감지하여 업데이트
    - 데이터와 사용자 인터페이스를 분리

- **`Controller(컨트롤러)`**
    > 컨트롤러는 사용자 입력을 처리하고 모델과 뷰를 조정
    - 사용자 입력을 처리하고, 모델 및 뷰 간의 상호작용을 조정
    - 모델과 뷰 사이의 중개 역할을 수행
    - 사용자 입력에 따라 모델을 업데이트하고 뷰를 업데이트하는 메서드를 제공

---

## Spring MVC란?
Spring MVC는 Spring 프레임워크에서 제공하는 웹 모듈입니다. 이 모듈은 Model, View, Controller 세 가지 주요 구성 요소를 사용하여 사용자의 요청을 받아들이고, 데이터를 처리하며, 최종적으로 사용자에게 화면을 제공하는 과정을 효율적으로 관리할 수 있습니다.

### Spring MVC의 구조

![Spring_MVC](https://pingppung.github.io/assets/img/posts/2024-06-30/SpringMVC.PNG)

#### <span style="background-color:#FFE6E6">DispatcherServlet</span> : HTTP Request를 처리하는 Controller
`DispatcherServlet`은 Spring MVC의 핵심이 되는 서블릿입니다. 클라이언트로부터 HTTP 요청이 들어왔을 때, `DispatcherServlet`은 모든 HTTP 요청을 수신하고, 요청을 처리할 컨트롤러를 찾아 요청을 전달하며, 응답을 생성하여 클라이언트에게 반환하는 역할을 합니다.


#### <span style="background-color:#FFE6E6">HandlerMapping</span> : HTTP Request URL을 어떤 컨트롤러가 처리할지 결정
`HandlerMapping`은 HTTP 요청 URL을 분석하여 어떤 컨트롤러가 해당 요청을 처리할지 결정합니다. 이를 통해 요청 URL과 컨트롤러 메서드를 매핑합니다.


#### <span style="background-color:#FFE6E6">HandlerAdapter</span> : 컨트롤러를 실행하고 결과를 생성
`HandlerAdapter`는 `HandlerMapping`에 의해 결정된 컨트롤러를 실행하는 역할을 합니다. `HandlerAdapter`는 해당 컨트롤러의 메서드를 호출하고, 그 결과를 처리하여 `DispatcherServlet`에 Model 객체와 View 이름을 반환합니다.


#### <span style="background-color:#FFE6E6">Handler</span> : HTTP Request 처리하고, 비지니스 로직을 실행하여 결과를 생성하는 Controller
컨트롤러는 HTTP 요청을 처리하고 비즈니스 로직을 실행하여 결과를 생성하는 역할을 합니다. `HandlerAdapter`를 통해 해당 컨트롤러의 메서드가 호출되며, 비즈니스 로직을 처리한 결과를 반환합니다.
- 비즈니스 로직의 흐름
    - Service : 비즈니스 로직을 처리하는 레이어. 비즈니스 규칙과 트랜잭션 관리를 담당합니다.
    - DAO : 데이터베이스와 상호작용하는 레이어. 데이터를 생성, 읽기, 업데이트, 삭제(CRUD) 작업을 수행합니다.
    - DB : 실제 데이터를 저장하고 관리하는 데이터베이스 시스템. DAO를 통해 접근됩니다.


#### <span style="background-color:#FFE6E6">ViewResolver</span> : 논리적 뷰 이름을 실제 View 객체로 변환
`ViewResolver`는 컨트롤러가 반환한 논리적인 뷰 이름을 실제 View 객체로 변환합니다. 이를 통해 논리적 뷰 이름을 기반으로 적절한 뷰를 찾아 렌더링할 수 있도록 합니다.


#### <span style="background-color:#FFE6E6">View</span> : 사용자에게 보여지는 화면을 렌더링
최종적으로 클라이언트에게 표시되는 페이지를 만듭니다.
