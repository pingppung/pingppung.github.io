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
- **키-값 저장소**<br>
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