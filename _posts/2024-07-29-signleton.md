---
title: 싱글톤 패턴(Singleton Pattern)
author: pingppung
date: 2024-07-29 19:33:00 +0800
categories: [Programming, Design Patterns]
tags: [java, singleton]
pin: false
math: true
mermaid: true
---

## 싱글톤 패턴이란?
싱글톤 패턴은 특정 클래스의 인스턴스를 하나만 생성하여 전역적으로 접근할 수 있도록 보장하는 디자인 패턴입니다. 예를 들어, 애플리케이션 설정을 하나의 중앙 객체로 관리하거나, 데이터베이스 연결을 단일 인스턴스로 유지하거나, 로그를 하나의 객체에서 처리해야 할 때 사용할 수 있습니다. 싱글톤 패턴을 통해 시스템 내에서 하나의 객체만 존재하게 하여 자원 낭비를 방지하고, 전역적으로 접근 가능한 객체를 제공할 수 있습니다.


## 싱글톤 패턴을 사용하는 이유

### 싱글톤 패턴의 특징
- **단일 인스턴스**: 클래스의 인스턴스가 하나만 생성됩니다. 메모리 낭비를 줄이고 자원을 효율적으로 사용할 수 있습니다.

- **전역 접근**: 프로그램 어디서든 인스턴스에 접근할 수 있습니다. 객체 지향적으로 접근할 수 있어 코드의 유지보수성과 가독성을 높입니다.

### 장단점
**장점**:
- **인스턴스 생성 비용 절감** : 객체를 매번 새로 생성하지 않으므로 자원을 절약할 수 있습니다.

- **전역 상태 관리** : 애플리케이션 전반에 걸쳐 공유되는 자원이나 설정을 관리하기 쉽습니다. 

**단점**:
- **테스트하기 어려움** : 싱글톤은 전역 상태를 유지하기 때문에 단위 테스트 작성이 어려울 수 있습니다. 객체가 전역적으로 접근 가능하므로 테스트 환경에서 상태를 초기화하거나 변경하는 데 어려움이 있습니다.

- **의존성 숨기기 가능성** : 싱글톤을 과도하게 사용하면 코드의 의존성을 명확하게 알기 어렵게 됩니다. 

## 싱글톤 패턴 구현하기

### 기본 구현
싱글톤 패턴의 기본 구현은 클래스 내부에 인스턴스를 생성하고 이를 반환하는 방법입니다.
```java
public class Singleton {
    // 클래스의 유일한 인스턴스를 저장할 정적 변수
    private static Singleton instance;

    // 생성자를 private으로 지정하여 외부에서 인스턴스 생성 불가
    private Singleton() {}

    // 클래스의 유일한 인스턴스를 반환하는 정적 메서드
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton(); // 인스턴스가 없다면 새로 생성
        }
        return instance; // 이미 있다면 기존 인스턴스 반환
    }
}
```
위 구현은 단순하고 이해하기 쉽지만, 멀티스레드 환경에서는 문제가 발생할 수 있습니다. 여러 스레드가 동시에 `getInstance()` 메서드에 접근하면, 두 개 이상의 인스턴스가 생성될 수 있습니다.


## 싱글톤 패턴의 문제점
### 쓰레드 안전성

멀티스레드 환경에서는 여러 스레드가 동시에 `getInstance()` 메서드에 접근하면, 두 개 이상의 인스턴스가 생성될 수 있습니다. 이를 방지하려면 쓰레드 안전성을 확보해야 합니다. 가장 간단한 방법은 `synchronized` 키워드를 사용하는 것입니다. `synchronized` 키워드를 사용하면 동시에 여러 스레드가 `getInstance()` 메서드에 접근하지 못하도록 막아줍니다.

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

이 방법은 쓰레드 안전성을 보장하지만, 매번 `getInstance()` 메서드를 호출할 때마다 `synchronized` 블록에 진입하기 때문에 성능에 영향을 미칠 수 있습니다. 인스턴스가 이미 생성된 이후에도 동기화 오버헤드가 발생하기 때문에 성능이 저하될 수 있습니다.

## 결론

싱글톤 패턴은 특정 클래스의 인스턴스를 하나만 생성하여 전역적으로 접근할 수 있도록 보장하는 유용한 디자인 패턴입니다. 그러나 멀티스레드 환경에서는 추가적인 동기화 처리가 필요합니다. 이러한 패턴을 잘 활용하면 자원 낭비를 줄이고, 애플리케이션의 일관성을 유지하는 데 도움이 됩니다.