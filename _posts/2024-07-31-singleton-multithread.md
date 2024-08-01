---
title: 멀티스레드 환경에서의 싱글톤 패턴 적용 경험
author: pingppung
date: 2024-07-31 19:33:00 +0800
categories: [Programming, Design Patterns]
tags: [java, singleton]
pin: false
math: true
mermaid: true
---

서버 애플리케이션을 개발하면서 특정 클래스의 인스턴스를 한 번만 생성하고 여러 클래스에서 사용할 필요가 있었습니다. 처음에는 의존성 주입을 통해 이를 해결했지만, 여러 클래스에 걸쳐 인스턴스를 넘겨주다 보니 코드가 복잡해졌습니다. 그래서 싱글톤 패턴을 적용해 보기로 했습니다. 그러나, 멀티스레드 환경에서 예상치 못한 문제가 발생하여 결국 다시 의존성 주입으로 돌아가게 되었습니다.

## 문제 상황
서버 애플리케이션에는 사용자 관리 및 메시지 브로드캐스트를 관리하는 `UserManager` 클래스가 있었습니다. 이 클래스는 여러 곳에서 공유되어야 했습니다. 처음에는 `UserManager` 인스턴스를 메인 서버 클래스에서 생성한 후, 소켓 연결 클래스, 클라이언트 연결 클래스, 유저 스레드 등 여러 곳에 의존성 주입을 통해 넘겨주었습니다. 각 클래스에 인스턴스를 넘겨주는 과정이 복잡하고 번거로웠습니다.

```java
public class JavaGameServer extends JFrame {
	public static void main(String[] args) {
        ServerWindow serverUI = new ServerWindow();
        serverUI.setVisible(true);

        UserManager userManager = new UserManager(); //해당 
        ServerSocketHandler serverSocketHandler = new ServerSocketHandler(serverUI, userManager);

        serverUI.setServerSocketHandler(serverSocketHandler);
	}
}
```
이 접근 방식은 시간이 지나면서 코드가 점점 복잡해졌습니다. 인스턴스를 여러 클래스에 넘겨주는 과정이 번거로웠고, 유지보수가 어려웠습니다. 인스턴스를 넘겨주는 과정에서 코드가 복잡해지기 때문에 이를 단순화하기 위해 싱글톤 패턴을 적용하기로 했습니다.

## 싱글톤 패턴 적용
싱글톤 패턴을 적용하여 `UserManager` 클래스를 단 하나의 인스턴스로 관리하려 했습니다.

```java
public class UserManager {
    private static UserManager instance;

    private UserManager() {}

    public static UserManager getInstance() {
        if (instance == null) {
            instance = new UserManager();
        }
        return instance;
    }
    //...
}
```
그리고 필요한 곳에서 `UserManager.getInstance()`를 호출하여 인스턴스를 사용하도록 했습니다.


## 발생한 문제
싱글톤 패턴을 적용한 후, 서버를 실행해 보니 하나의 유저만 제대로 작동하고 나머지 유저는 전혀 실행되지 않는 문제가 발생했습니다. 이 문제는 멀티스레드 환경에서 `UserManager` 인스턴스를 생성하는 과정에서 여러 스레드가 동시에 접근하면서 발생한 것으로 추측되었습니다. `UserManager`의 인스턴스가 제대로 초기화되지 않아, 두 번째 유저부터는 실행조차 되지 않는 상황이었습니다.

![problem](https://pingppung.github.io/assets/img/posts/2024-07-31/싱글톤 문제.PNG)

## 문제 해결 시도
문제를 해결하기 위해 synchronized 키워드를 사용해 보았습니다.
```java
public static synchronized UserManager getInstance() {
        if (instance == null) {
            instance = new UserManager();
        }
        return instance;
    }
```
그러나, 이 변경 후에도 여전히 문제가 해결되지 않았고, 여러 유저가 동시에 접근하는 상황에서 `UserManager`의 인스턴스가 제대로 생성되지 않는 문제는 여전히 발생했습니다. 이로 인해 멀티스레드 환경에서 싱글톤 패턴이 예상대로 동작하지 않는다는 것을 확인했습니다.

## 결론
결국, 싱글톤 패턴을 포기하고 다시 의존성 주입 방식으로 돌아갔습니다. 의존성 주입 방식은 각 클래스에 `UserManager` 인스턴스를 직접 넘겨주는 방식으로, 멀티스레드 환경에서 안정적으로 작동했습니다. 이 경험을 통해, 특정 상황에서는 싱글톤 패턴이 아닌 다른 설계 방식이 더 적합할 수 있다는 것을 깨달았습니다. 이 경험을 통해, 디자인 패턴의 장단점을 잘 이해하고 상황에 맞게 적용하는 것이 중요하다는 것을 깨닫게 되었습니다.