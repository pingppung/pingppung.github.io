---
title: MongoDB에서 MySQL로의 전환 - 관계형 데이터베이스에서 리스트 저장 문제
author: pingppung
date: 2024-07-16 13:33:00 +0800
categories: [Development, Test]
tags: [java, tdd]
pin: false
math: true
mermaid: true
---

## MongoDB에서의 데이터 관리 경험

MongoDB를 통해 데이터를 관리하면서 얻은 경험과 기술적인 고민을 다음과 같이 정리했습니다.

![MongoDB](https://pingppung.github.io/assets/img/posts/2024-07-16/mongoDB에서.PNG)


### 데이터 모델링과 문서형 데이터베이스의 활용

MongoDB는 문서형 데이터베이스로서 스키마 없는 구조를 제공하여 초기 데이터 모델링과 저장이 매우 유연했습니다. 예를 들어, 다음과 같은 방식으로 데이터를 저장할 수 있었습니다

```json
{
  "_id": ObjectId("..."),
  "title": "작품 제목",
  "coverImg": "작품 이미지",
  "summary": "작품 요약",
  "genre": "장르",
  "site": ["사이트1", "사이트2", "사이트3"],
  "adultContent": false
}
```
하나의 작품이 여러 사이트에서 연재될 수 있다는 점을 고려하여, 해당 작품의 사이트 정보를 리스트로 저장할 수 있도록 했습니다. MongoDB는 유연한 데이터 모델을 제공하여 <span style="background-color:#E6E6FA">리스트 형태의 데이터를 쉽게 다룰 수 있었습니다.</span>

### 초기 장점과 유연성

MongoDB의 문서형 데이터베이스 특성 덕분에, 각 문서에 다양한 필드와 데이터 구조를 유연하게 저장할 수 있었습니다. 이 방식은 초기 데이터 모델링과 저장이 매우 간편하고 직관적이었으며, 프로젝트의 초기 단계에서 빠르게 발전할 수 있도록 도와주었습니다.

## 고민

Selenium을 사용하여 웹페이지에서 추출한 데이터를 MongoDB에 저장한 후, 다음과 같은 기술적인 고민을 하게 되었습니다.

### MySQL로의 전환 이유

Selenium으로 웹페이지에서 추출한 데이터를 데이터베이스에 저장한 후 화면에 띄우기 위해, 처음에는 비관계형 데이터베이스인 `MongoDB`를 사용했습니다. `MongoDB`는 유연한 스키마와 문서 기반 저장 방식 덕분에 초기 개발 및 데이터 저장이 용이했습니다.

하지만 프로젝트를 진행하면서 좀 더 정교한 데이터 관리 기능이 필요하다는 것을 느꼈습니다. 유저의 좋아요 기능을 추가하려면 유저와 작품 데이터 간의 관계를 명확히 표시할 수 있어야 했습니다.  `MongoDB`는 유연한 데이터 모델을 제공했지만, 복잡한 관계를 관리하는 데 한계가 있었습니다. 이러한 관계형 데이터를 효과적으로 관리하기 위해 관계형 데이터베이스로 전환을 고려하게 되었습니다.

### 문제점

관계형 데이터베이스로 전환하는 과정에서, 연재되는 사이트를 리스트로 관리해왔던 것이 `MySQL`에서는 직접적으로 리스트 저장이 불가능하다는 문제를 발견하게 되었습니다. `MongoDB`에서는 리스트 데이터를 자연스럽게 저장하고 관리할 수 있었지만, `MySQL`에서는 이러한 데이터를 효과적으로 저장하고 처리하기 위해 추가적인 설계가 필요했습니다.

## 해결 방안

### 데이터 모델 재구성과 novel_site 테이블 설계

MySQL에서는 리스트 형태의 데이터를 직접 저장하는 것이 어려웠기 때문에, 각 작품과 사이트의 관계를 명확히 나타낼 수 있는 novle_site 테이블을 생성하여 데이터베이스를 설계하였습니다. 사이트 ID와 작품 ID를 저장하는 방식으로 이를 통해 각각의 작품이 여러 사이트에서 연재되는 정보를 효과적으로 관리할 수 있게 되었습니다.

```sql
-- 작품 테이블
CREATE TABLE novle (
    novle_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cover_img VARCHAR(255),
    summary TEXT,
    genre VARCHAR(50),
    adult_content BOOLEAN
);

-- 사이트 테이블
CREATE TABLE site (
    site_id INT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL
);

-- 작품-사이트 관계 테이블
CREATE TABLE novle_site (
    id INT AUTO_INCREMENT PRIMARY KEY,
    novle_id INT,
    site_id INT,
    FOREIGN KEY (novle_id) REFERENCES novle(novle_id),
    FOREIGN KEY (site_id) REFERENCES site(site_id)
);
```