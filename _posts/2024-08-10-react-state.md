---
title: 로그인 상태 관리 - React에서 데이터를 컴포넌트 간에 전달
author: pingppung
date: 2024-08-10 19:33:00 +0800
categories: [Programming, React]
tags: [react, javascript, web]
pin: false
math: false
mermaid: false
---
React로 프로젝트를 진행하면서, 저는 주로 함수형 컴포넌트를 사용해왔습니다. 처음에는 `useState` 훅을 사용해 간단하게 상태를 관리할 수 있었지만, 여러 컴포넌트 간에 상태를 공유해야 할 때 복잡함이 증가하면서 어려움을 겪기도 했습니다. 특히, 로그인 기능이 포함된 애플리케이션에서 상태 관리가 점점 복잡해지기 시작했는데, 그 과정에서 여러 문제에 직면했습니다.

## 문제 상황
로그인 기능을 구현할 때, 사용자가 로그인하면 해당 정보를 다른 컴포넌트에서도 표시해야 했습니다. 처음에는 로그인 컴포넌트에서 사용자 정보를 받아서 바로 다른 컴포넌트들(**Home**, **MyPage** 등)로 전달하려 했습니다. 하지만 이런 방식은 상태 관리가 점점 복잡해지면서, 특히 사용자 정보가 필요한 시점에 제대로 전달되지 않는 문제가 발생했습니다.

### 문제 1 : 자식 컴포넌트 간 상태 전달
처음에는 로그인 컴포넌트 내에서 `useState`를 사용해 유저의 로그인 상태와 닉네임을 관리했습니다. 로그인에 성공한 후, 이 상태를 다른 컴포넌트에 전달하기 위해 props를 통해 데이터를 주고받으려 했습니다. 그러나 자식 컴포넌트들 간에 직접 상태를 전달하는 방식은 유지보수나 확장성 측면에서 한계가 분명했습니다. 데이터 흐름이 복잡해지면서 상태가 여러 컴포넌트에 분산되었고, 이로 인해 코드가 이해하기 어려워졌습니다.


### 해결책 1 : 상태를 부모 컴포넌트로 이동
이 문제를 해결하기 위해, 상태를 최상위 부모 컴포넌트인 **`App`**으로 옮기고, 이 컴포넌트가 모든 상태를 관리하도록 구조를 변경했습니다. 이렇게 하니, 자식 컴포넌트들은 부모 컴포넌트로부터 필요한 데이터를 props로 받아 사용할 수 있었고, 데이터 흐름이 단순하고 명확해졌습니다.

```javascript
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");

  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={
            <Home name={name} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          }
        />
        <Route
          path="/login"
          element={
            <LoginForm setLoggedIn={setLoggedIn} setUserName={setName} />
          }
        />
      </Routes>
      <Route element={<PrivateRoute redirectPath="/login"/>} >
        <Route path="/user" element={<MyPage />} />
      </Route>
    </Router>
  );
}
```

### 문제 2 : Null 값 문제
상태를 App 컴포넌트로 옮겨서 상태 전달은 훨씬 간단해졌지만, 컴포넌트에서 전달된 상태가 null로 나타나는 문제가 발생했습니다. 이는 상태가 아직 업데이트되기 전에 컴포넌트가 렌더링되면서 발생한 문제였습니다. 

### 해결책 2 : useOutletContext 활용
이 문제를 해결하기 위해 React Router의 `useOutletContext`를 사용했습니다. `useOutletContext`는 부모 라우트에서 자식 컴포넌트로 데이터를 전달할 때 사용되는 훅입니다. 일반적으로 상태를 자식 컴포넌트에 props로 전달하거나, 전역 상태 관리 방법을 사용하는데, `useOutletContext`를 활용하면 중첩된 라우트 구조에서도 부모 컴포넌트에서 설정한 context를 자식 컴포넌트가 쉽게 접근할 수 있게 됩니다.

이를 통해 부모 컴포넌트에서 관리하는 상태를 자식 컴포넌트로 보다 안정적으로 전달할 수 있었고, null 값 문제를 해결할 수 있었습니다. 

```javascript
import React from "react";
import { useOutletContext } from "react-router-dom";

function MyPage() {
  const userInfo = useOutletContext(); // 부모 라우트에서 전달된 데이터 사용

  return (
    <div className="MyPage_container">
      {userInfo ? `${userInfo}님의 페이지입니다.` : "유저 정보가 없습니다."}
    </div>
  );
}

export default MyPage;
```
#### useOutletContext와 props의 차이점
- **props** : 일반적으로 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달할 때 사용하는 방법입니다. 부모 컴포넌트에서 자식 컴포넌트로 전달하려는 데이터를 명시적으로 설정하고, 그 데이터를 자식 컴포넌트의 props로 넘깁니다.

- **useOutletContext** : React Router에서 사용하는 훅으로, 부모 라우트의 데이터를 하위 라우트에서 쉽게 접근할 수 있도록 해줍니다. 이는 여러 라우트 간에 데이터를 공유할 때 유용합니다.

#### props 사용 시 null문제가 발생하는 이유

`props`를 사용할 때 `null` 문제가 발생하는 이유는 비동기 상태 업데이트 및 라우트 전환 시점과 관련이 있습니다:

- **비동기 상태 업데이트**: `useEffect`와 같은 비동기 작업이 완료되기 전에 컴포넌트가 먼저 렌더링될 수 있습니다. 이 경우, 아직 상태가 업데이트되지 않아서 `props`로 전달되는 값이 `null`이 될 수 있습니다.

- **라우트 전환의 타이밍**: 특정 라우트에서 다른 라우트로 이동할 때, 부모 컴포넌트가 아직 데이터를 준비하지 않은 상태에서 자식 컴포넌트가 렌더링될 수 있습니다. 이 경우, 자식 컴포넌트에서 `props`를 통해 받는 데이터가 `null`이 될 수 있습니다.

#### useOutletContext가 잘 동작하는 이유

`useOutletContext`는 부모 라우트에서 데이터가 준비된 후에 자식 라우트에서 해당 데이터를 사용할 수 있도록 보장합니다. 이로 인해 `null` 문제가 발생하지 않으며, 다음과 같은 장점이 있습니다:

- **데이터 준비 타이밍**: 부모 라우트에서 데이터가 준비된 후에 자식 라우트가 해당 데이터를 사용하게 되므로, 자식 라우트가 데이터 준비가 완료되지 않은 상태에서 렌더링되는 일이 줄어듭니다.

- **컨텍스트 기반 데이터 접근**: `useOutletContext`는 React의 컨텍스트 API를 기반으로 하므로, 데이터가 필요한 모든 하위 라우트에서 일관되게 데이터를 접근할 수 있습니다. 이는 데이터 흐름이 보다 명확하고 안정적으로 이루어질 수 있게 해줍니다.

- **렌더링 순서 보장**: `useOutletContext`는 React Router의 라우트 렌더링 순서에 의해 컨텍스트를 전달하므로, 부모 라우트의 데이터가 준비되기 전에 자식 라우트가 렌더링되는 일이 줄어듭니다.

## 느낀 점
이렇게 두 가지 문제를 해결하면서, React에서 상태 관리를 어떻게 최적화하고 데이터 전달을 보다 명확하게 할 수 있는지 배웠습니다. 컴포넌트 간의 상태 전달은 처음에는 다소 헷갈릴 수 있지만, 구조를 잘 잡아 나가면서 점점 더 이해하기 쉬운 코드를 작성할 수 있었습니다.