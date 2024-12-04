---
title: "ORM 엔티티 설계: Single Table, Table Per Class, Joined Table"
author: pingppung
date: 2024-11-24 11:33:00 +0800
categories: [Backend, ORM]
tags: [orm, entity design, database, spring boot, mysql]
pin: false
math: false
mermaid: false
---

처음에는 소설, 웹툰, 드라마, 영화와 같은 각각의 콘텐츠 유형에 대해 독립적인 엔티티를 만들어 관리하려고 했습니다. 하지만 콘텐츠 유형이 다양해질수록 공통된 속성을 공유하는 상위 클래스 `Content`를 만들어 상속 구조를 설계하는 것이 더 효율적이라고 판단했습니다.

### 왜 상속 구조가 유용할까?

1. **공통된 속성 관리**<br>
모든 콘텐츠가 공통적으로 가지는 속성(예: 제목, 설명, 카데고리 등)을 상위 클래스에 정의하면 코드 중복을 줄이고, 확장성을 높일 수 있습니다.

2. **유형별 속성 추가 가능**<br>
각 콘텐츠에 특화된 속성은 하위 클래스에서 별도로 정의할 수 있습니다.

3. **유지보수와 확장성 향상**<br>
새로운 콘텐츠 유형(예: 음악, 게임)을 추가할 때도 기존 구조를 유지하면서 간단히 확장할 수 있습니다.

### 설계

**상위 클래스: Content**<br>
공통 속성 정의

```java
@Entity
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
}
```

**하위 클래스: 소설, 웹툰, 드라마, 영화**<br>
각각의 고유한 속성 정의
```java
@Entity
public class Novel extends Content {
    private String author;
    private int pageCount;
}

@Entity
public class Webtoon extends Content {
    private String artist;
    private int episodeCount;
}

@Entity
public class Drama extends Content {
    private int seasonCount;
    private String broadcaster;
}

@Entity
public class Movie extends Content {
    private int duration;
    private String director;
}

```

### 상속 구조의 장점
1. **코드 재사용성**<br>
공통된 필드와 메서드를 상위 클래스에서 정의하여 중복 코드 제거할 수 있습니다.

2. **확장성**<br>
새로운 콘텐츠 유형을 추가하려면 단순히 `Content`를 상속하는 클래스만 만들면 됩니다.

3. **ORM 전략의 유연성**<br>
`@Inheritance` 어노테이션을 사용하여 `Single Table`, `Table Per Class`, `Joined Table` 등 다양한 테이블 설계 전략을 유연하게 선택할 수 있습니다.

### 테이블 설계 방식

#### Single Table (단일 테이블)
모든 데이터를 하나의 테이블에 저장하며, 쿼리는 빠르지만 필드가 많아지고 Null 값이 발생할 수 있습니다. 데이터가 많아지면 관리와 성능에 문제가 생길 수 있습니다.

> Content Table

{: .small-table }

| id | title      | description | releaseDate | type   | author    | pageCount | artist   | episodeCount | seasonCount | broadcaster | duration | director |
|----|------------|-------------|-------------|--------|-----------|-----------|----------|--------------|-------------|-------------|----------|----------|
| 1  | Novel A    | Description | 2024-01-01  | Novel  | Author A  | 300       |          |              |             |             |          |          |
| 2  | Webtoon B  | Description | 2024-02-01  | Webtoon|           |           | Artist B | 50           |             |             |          |          |
| 3  | Movie C    | Description | 2024-03-01  | Movie  |           |           |          |              |             |             | 120      | Director |

모든 데이터를 하나의 테이블에 저장하여 조회 시 `JOIN`이 필요 없지만, 테이블이 커질수록 관리가 어려워지고, 필드가 많아져 불필요한 Null 값이 발생할 수 있습니다.


#### Table Per Class (클래스별 테이블)
각 하위 클래스가 고유 속성뿐만 아니라 공통 속성도 포함하는 테이블을 생성합니다. `Content` 테이블 없이 각 하위 클래스 테이블에 모든 데이터를 저장합니다.

> Novel Table

{: .small-table }

| id  | title    | description | releaseDate | author   | pageCount |
|-----|----------|-------------|-------------|----------|-----------|
| 1   | Novel A  | Description | 2024-01-01  | Author A | 300       |


> Webtoon Table

{: .small-table }

| id  | title    | description | releaseDate | artist   | episodeCount |
|-----|----------|-------------|-------------|----------|--------------|
| 2   | Webtoon B| Description | 2024-02-01  | Artist B | 50           |

별도의 `JOIN`이 필요하지 않지만, 데이터 중복이 발생할 수 있고, 데이터 관리가 비효율적일 수 있습니다.

#### Joined Table (조인 방식)
공통 속성은 상위 테이블에 저장하고, 하위 클래스의 고유 속성은 별도의 테이블에 나눠 저장하는 방식입니다. 여러 테이블을 `JOIN`하여 데이터를 조회할 수 있지만, 쿼리가 복잡해지고 성능에 영향을 줄 수 있습니다.

> Content Table

{: .small-table }

| id | title      | description | releaseDate |
|----|------------|-------------|-------------|
| 1  | Novel A    | Description | 2024-01-01  |
| 2  | Webtoon B  | Description | 2024-02-01  |
| 3  | Movie C    | Description | 2024-03-01  |


> Novel Table

{: .small-table }

| id | author    | pageCount |
|----|-----------|-----------|
| 1  | Author A  | 300       |


> Webtoon Table

{: .small-table }

| id | artist   | episodeCount |
|----|----------|--------------|
| 2  | Artist B | 50           |

데이터를 중복 없이 저장할 수 있지만, 조회 시 `JOIN` 연산이 많아져 성능에 영향을 미칠 수 있습니다.


## 결론
처음에는 공통된 속성을 Content 테이블에 저장하는 대신 각 콘텐츠 유형별로 별도의 테이블에 저장하는 방식인 Table Per Class 방식을 사용할 생각이었습니다. 하지만 이 방식을 사용하다 보니 데이터 중복이 발생하고, 관리가 복잡해지는 문제를 겪게 되었습니다. 또한, 여러 사이트에서 연재 중인 콘텐츠의 정보를 처리하는 과정에서 중복 데이터나 관계 설정의 어려움이 있었고, 이를 해결하는 데 어려움을 겪었습니다.

결국, 더 효율적인 설계를 위해 다른 방식들을 고려하게 되었고, 그 경험과 해결 방법에 대해서는 다음 글에서 이어서 다루려고 합니다.