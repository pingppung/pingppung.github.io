---
title: Spring 트랜잭션
author: pingppung
date: 2024-07-12 13:33:00 +0800
categories: [Development, Spring]
tags: [spring, java]
pin: false
math: true
mermaid: true
---

## 트랜잭션이란?
트랜잭션(Transaction)은 데이터베이스에서 하나의 작업 단위를 말합니다. 트랜잭션은 여러 작업을 하나의 논리적인 작업을 묶어서 처리하며, <span style="color:red">ACID 특징</span>을 가지고 있습니다.

### ACID 속성

1. **원자성(Atomicity)**: 트랜잭션의 모든 작업이 완료되거나, 전혀 수행되지 않은 상태를 보장

2. **일관성(Consistency)**: 트랜잭션이 완료되면 데이터베이스 항상 일관된 상태 유지

3. **격리성(Isolation)**: 동시에 실행되는 트랜잭션들이 서로의 작업에 영향을 미치지 않도록 격리

4. **지속성(Durability)**: 트랜잭션이 완료된 후에는 시스템 오류가 발생하더라도 그 결과 지속

## 트랜잭션 관리
트랜잭션 관리는 데이터 일관성을 유지하고 데이터베이스 작업 중 오류가 발생했을 때 안전하게 복구할 수 있도록 도와주는 중요한 기능입니다. 

Spring 프레임워크에서는 트랜잭션 관리를 위해 `@Transactional` 어노테이션을 제공합니다.

#### `@Transactional` 어노테이션 사용법
`@Transactional` 어노테이션은 클래스나 메서드에 적용할 수 있습니다.

```java
@Service
public class MyService {

    private final MyRepository myRepository;

    public MyService(MyRepository myRepository) {
        this.myRepository = myRepository;
    }

    @Transactional
    public void performTransaction() {
        // 트랜잭션 내에서 실행될 코드
        myRepository.save(new Entity());
        myRepository.update(new Entity());
        ...
    }
}
```
## 커밋과 롤백
- **커밋(commit)**

    - <u>트랜잭션이 성공적으로 완료</u>되면 <span style="background-color:#E6E6FA">커밋</span>을 통해 모든 변경 사항을 확정합니다.</span>
    
    - 커밋이 수행되면 트랜잭션 내에서 이루어진 모든 데이터 변경이 데이터베이스에 영구적으로 반영됩니다.

    - 커밋이 완료된 후에는 해당 세션이 종료되며, 다른 트랜잭션이나 커넥션에서도 이 변경 사항을 볼 수 있게 됩니다.

- **롤백(rollback)**

    - <u>트랜잭션 내에서 오류가 발생하거나, 중간에 작업을 취소할 필요가 있는 경우</u> <span style="background-color:#E6E6FA">롤백</span>을 통해 모든 변경 사항을 취소합니다.

    - 롤백이 수행되면 트랜잭션 시작 이전 상태로 데이터베이스가 복구됩니다.

    - 롤백 후에는 해당 세션이 종료되며, 변경 사항이 데이터베이스에 반영되지 않기 때문에 다른 트랜잭션이나 커넥션에서는 롤백된 내용을 볼 수 없습니다.

## 트랜잭션 진행 중 데이터 접근
하나의 트랜잭션이 진행 중일 때, 다른 트랜잭션이나 커넥션에서 해당 데이터에 접근하면 현재 트랜잭션 격리 수준에 따라 데이터 접근 방식이 달라집니다.

### 트랜잭션 격리 수준
트랜잭션 격리 수준은 트랜잭션이 다른 트랜잭션의 작업을 얼마나 격리할지를 결정합니다. 이를 통해 하나의 트랜잭션이 진행 중일 때 다른 트랜잭션이 어떻게 데이터를 볼 수 있는지 제어할 수 있습니다.

#### Spring 격리 수준 지정
`isolation` 속성을 사용하여 트랜잭션의 격리 수준을 설정할 수 있습니다.

1. `DEFAULT`: 기본 데이터베이스 격리 수준 사용
2. `READ_UNCOMMITTED`: 가장 낮은 격리 수준, "더티 리드" 허용
3. `READ_COMMITTED`: 커밋된 데이터만 읽음
4. `REPEATABLE_READ`: 동일한 쿼리 반복 시 항상 동일한 결과 반환
5. `SERIALIZABLE`: 가장 높은 격리 수준, 트랜잭션이 순차적으로 실행되는 것처럼 보장
```java
@Transactional(isolation = Isolation.READ_COMMITTED)
```

## 주의사항
1. **트랜잭션 크기**: 너무 큰 트랜잭션은 데이터베이스 Lock 문제가 발생할 수 있기 때문에 가능한 작게 유지하는 것이 좋습니다.

2. **예외처리**: 트랜잭션 내에서 예외가 발생하면 Spring은 기본적으로 해당 트랜잭션을 롤백합니다. 그러나 모든 예외가 자동으로 롤백되는 것은 아니며, 예외를 적절히 처리하지 않으면 예상치 못한 동작이 발생할 수 있습니다.

3. **성능**: 데이터베이서의 성능에 영향을 미칠 수 있어, 필요한 최소한의 범위에서 사용해야 합니다.