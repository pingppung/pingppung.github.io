---
title: React와 Spring Boot의 REST API를 통한 데이터 통신
author: pingppung
date: 2024-08-14 19:33:00 +0800
categories: [Programming, React, Spring]
tags: [spring, java, react, javascript, web]
pin: false
math: false
mermaid: false
---

## React와 Spring Boot 연동
처음 React와 Spring Boot를 함께 사용하려고 할 때, 가장 먼저 떠오른 것은 "이 둘을 어떻게 연결할까?"였습니다. React는 프론트엔드 라이브러리로서, 주로 사용자 인터페이스를 만들 때 사용되고, Spring Boot는 백엔드 프레임워크로서 서버 측 로직을 처리합니다. 이 두 가지를 연결하는 방법 중 가장 일반적인 방법은 REST API를 사용하는 것입니다.

REST API는 클라이언트(React)와 서버(Spring Boot)가 서로 데이터를 주고받을 수 있도록 해주는 표준화된 인터페이스입니다. 서버에서 데이터를 제공하는 엔드포인트를 정의하고, 클라이언트는 이 엔드포인트를 호출하여 필요한 데이터를 가져오거나 서버에 데이터를 전송할 수 있습니다.

## Spring Boot에서 REST API 만들기
예를 들어, 간단한 유저 정보를 제공하는 API를 만들어보겠습니다.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
}
```
이 코드에서 `@RestController`와 `@GetMapping` 어노테이션을 사용하여 `/api/users/{id}` 경로로 GET 요청이 들어오면, 해당 유저의 정보를 반환하는 API를 만들었습니다.

## React에서 API 호출하기
이제 React에서 Spring Boot의 REST API를 호출해 데이터를 가져오는 방법을 설명하겠습니다. React에서 API를 호출할 때는 주로 `fetch`나 `axios` 같은 라이브러리를 사용합니다. 개인적으로는 `axios`가 더 편리해서 자주 사용하고 있습니다.

아래는 `axios`를 사용하여 Spring Boot API에서 유저 정보를 가져오는 예제입니다.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserInfo({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
      });
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default UserInfo;
```
이 코드에서는 `useEffect`를 사용해 컴포넌트가 렌더링될 때 API를 호출하고, 응답 데이터를 `user` 상태에 저장했습니다. `user` 상태가 null일 때는 `Loading...` 메시지를 표시하고, 데이터가 로드되면 유저의 이름과 이메일을 화면에 출력합니다.