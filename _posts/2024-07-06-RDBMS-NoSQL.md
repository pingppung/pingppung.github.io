---
title: 관계형 / 비관계형 데이터베이스
author: pingppung
date: 2024-07-06 13:33:00 +0800
categories: [Development, Spring]
tags: [spring, java, database]
pin: false
math: true
mermaid: true
---
## 데이터베이스
데이터베이스는 데이터를 효율적으로 저장하고 관리하는 시스템입니다. 데이터베이스는 크게 관계형 데이터베이스(Relational Database, RDBMS)와 비관계형 데이터베이스(Non-Relational Database, NoSQL)로 나눌 수 있습니다. 

## 관계형 데이터베이스 (RDBMS)
관계형 데이터베이스는 데이터를 테이블 형태로 저장합니다. 테이블은 행과 열로 구성되며, 각 행은 개별 레코드를, 각 열은 속성을 나타냅니다. RDBMS는 데이터를 SQL을 통해 관리합니다<br> 

![RDBMS](https://pingppung.github.io/assets/img/posts/2024-07-06/관계형.PNG)

#### 특징
> 장점

- **데이터 무결성과 일관성 보장**: 데이터의 정확성과 일관성을 유지합니다.

- **복잡한 쿼리 가능**: SQL을 사용하여 복잡한 데이터 조회 및 조작이 가능합니다.

- **데이터 관계 관리**: 데이터 간의 명확한 관계를 정의하고 관리할 수 있습니다.

> 단점

- **스키마 변경의 어려움**: 데이터 구조 변경이 어렵고 번거롭습니다.

- **확장성의 한계**: 대규모 데이터 처리에 한계가 있을 수 있습니다.

- **비정형 데이터 처리의 어려움**: 정형화되지 않은 데이터를 처리하기 어렵습니다.

#### 주요 RDBMS 종류
- MySQL
- PostgreSQL
- Oracle Database
- Microsoft SQL Server


## 비관계형 데이터베이스 (NoSQL)
비관계형 데이터베이스는 다양한 데이터 모델을 지원하며, 유연한 스키마를 제공합니다. 이는 특히 대규모 데이터 처리와 높은 확장성이 필요한 환경에서 유리합니다.

![NoSQL](https://pingppung.github.io/assets/img/posts/2024-07-06/비관계형.PNG)

#### 특징
>장점

- **스키마의 유연성**: 데이터 구조가 고정되어 있지 않아 다양한 데이터 형식을 저장할 수 있습니다.

- **높은 확장성**: 수평적 확장이 용이하여 대규모 데이터 처리가 가능합니다.

- **빠른 성능**: 특정 사용 사례에 최적화된 데이터 접근 및 조회 속도를 제공합니다.

>단점

- **일관성 보장 어려움**: ACID 특성을 완전히 보장하지 않을 수 있어 데이터 일관성에 문제가 발생할 수 있습니다.

- **제한된 복잡한 쿼리**: 관계형 데이터베이스만큼 복잡한 쿼리를 지원하지 않을 수 있습니다.

- **표준화 부족**: 다양한 NoSQL 데이터베이스가 존재하며, 각기 다른 API와 쿼리 언어를 사용합니다.


#### 유형
- **키-값 데이터베이스**<br>
 단순한 키와 값 쌍으로 데이터를 저장됩니다.

 ```json
    ""Student:1" : {"Name": "Kim", "BirthDate": "2000-01-15"}
```

- **문서 지향 데이터베이스**<br>
각 도큐먼트는 JSON, BSON 또는 XML 형식으로 저장됩니다.

```json
{
  "StudentID": 1,
  "Name": "Kim",
  "BirthDate": "2000-01-15",
  "Classes": [
    {"ClassID": 101, "ClassName": "Math", "TeacherName": "Mr. Thompson"},
    {"ClassID": 102, "ClassName": "Science", "TeacherName": "Mrs. Lee"}
  ]
}
```

- **컬럼 지향 데이터베이스**<br>
행과 열로 구성된 테이블 형태를 사용합니다.

```sql
    CREATE TABLE Students (
    StudentID uuid PRIMARY KEY,
    FirstName text,
    LastName text,
    BirthDate date
    );

    CREATE TABLE StudentClasses (
    StudentID uuid,
    ClassID uuid,
    ClassName text,
    PRIMARY KEY (StudentID, ClassID)
    );
```

- **그래프 데이터베이스**<br>

노드와 엣지로 구성된 그래프 형태로 데이터를 저장합니다.

```php
    CREATE (s:Student {StudentID: 1, FirstName: "John", LastName: "Doe", BirthDate: "2000-01-15"})
    CREATE (c1:Class {ClassID: 101, ClassName: "Math", TeacherName: "Mr. Thompson"})
    CREATE (c2:Class {ClassID: 102, ClassName: "Science", TeacherName: "Mrs. Lee"})
    CREATE (s)-[:ENROLLED_IN]->(c1)
    CREATE (s)-[:ENROLLED_IN]->(c2)

```

#### 주요 NoSQL DB 종류
- MongoDB
- Cassandra
- Redis
- Neo4j

## 요약


| 특징                    | 관계형 데이터베이스 (RDBMS)          | 비관계형 데이터베이스 (NoSQL) |
| :---------------------- | :----------------------------------- | :---------------------------- |
| 데이터 모델              | 테이블 기반 (행과 열)                 | 다양한 모델 (문서, 키-값, 컬럼 패밀리, 그래프 등) |
| 스키마                   | 고정된 스키마                         | 유연한 스키마 또는 스키마 없음 |
| 언어                     | SQL                                  | 데이터베이스에 따라 다양한 쿼리 언어 |
| ACID 특성                | 지원 (Atomicity, Consistency, Isolation, Durability) | 일부 데이터베이스에서만 지원 |
| 확장성                   | 수직적 확장 (서버 성능 향상)          | 수평적 확장 (노드 추가)        |
| 일관성                   | 강한 일관성                           | 최종 일관성 또는 이벤트 일관성 (데이터베이스에 따라 다름) |
| 복잡한 쿼리               | 지원 (조인, 서브쿼리 등)              | 일부 데이터베이스에서 제한적으로 지원 |
| 적용 사례                | 트랜잭션 처리, 복잡한 쿼리 및 보고서 생성 | 대규모 데이터 처리, 비정형 데이터, 분산 시스템 |
| 유형 예시                | MySQL, PostgreSQL, Oracle, Microsoft SQL Server | MongoDB, Cassandra, Redis, Neo4j |
| 데이터 무결성            | 높은 수준의 데이터 무결성 보장        | 데이터 무결성 보장이 약함 (유연성 강조) |
| 관계 정의                | 테이블 간의 명확한 관계 (외래 키)      | 명시적인 관계 정의가 없음 (애플리케이션 수준에서 관리) |
| 운영 및 유지보수          | 상대적으로 복잡한 운영 및 유지보수    | 상대적으로 간단한 운영 및 유지보수 |