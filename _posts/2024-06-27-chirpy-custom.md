---
title: jekyll로 GitHub Pages 만들기(3)
description: 나만의 GitHub Pages 커스터마이징
author: pingppung
date: 2024-06-27 13:33:00 +0800
categories: [Blogging]
tags: [blog]
pin: false
math: false
mermaid: true
---
## 개발자 도구
저는 보통 CSS를 수정할 때 크롬 개발자 도구(F12)를 활용하여 미리 구성을 확인한 다음, VSCode에서 수정하는 방식으로 진행하고 있습니다.

![dev mode](https://pingppung.github.io/assets/img/posts/2024-06-27/개발자_모드.PNG)

## 커스터마이징

- 프로필 사진 변경
- 사이드바 수정
- Favicon 이미지 변경


### 프로필 사진
프로필 이미지는 /assets/img/ 폴더에 넣으면 됩니다. <br>
로컬에서는 해당 경로만 적어도 잘 나오지만 원격에 올리면 이미지가 제대로 뜨지 않는 오류가 발생할 수 있습니다. 이 문제를 해결하기 위해 <mark>절대 경로</mark>를 사용해야 합니다.
```ruby
https://pingppung.github.io/assets/img/사진이름.확장자
``` 

### 사이드바
개발자 모드로 찾아본 기존 Chirpy의 사이드바 CSS는 아래와 같습니다.
```css
#sidebar {
    padding-left: 0;
    padding-right: 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    overflow-y: auto;
    width: 260px;
    z-index: 99;
    background: #c7d6e6;
    border-right: 1px solid var(--sidebar-border-color);
    text-align: center;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
```

#### 사이드바 배경 설정 
사이드바의 CSS를 변경하려면 **`_sass/addon`** 폴더 내의 custom.scss 파일을 수정합니다. 예를 들어, 사이드바의 색상을 변경하려면 background 속성을 변경하면 됩니다.

사이드바에 배경 이미지를 추가하려면 custom.scss 파일에 다음 코드를 추가합니다.
```css
.sidebar {
  background-image: url('https://pingppung.github.io/assets/img/background.jpg');
  background-size: cover;
}
```

#### Contact 정보 변경
**`_data`** 폴더 내의 contact.yml 파일을 수정하여 연락처 정보를 업데이트합니다.
필요하신 부분 이외에는 삭제하거나 주석처리하면 사라집니다.<br>
아이콘부분은 [fontawesome](https://fontawesome.com/icons)에서 원하는 아이콘으로 변경할 수 있습니다.
![fontawesome](https://pingppung.github.io/assets/img/posts/2024-06-27/fontawesome.PNG)


### favicon 이미지
Favicon은 브라우저 탭에 표시되는 이미지를 말합니다. <br>
![favicon](https://pingppung.github.io/assets/img/posts/2024-06-27/favicon.PNG)

Favicon은 이미지나 글자 등 본인이 원하는대로 제작을 하신 후 [favicon 제작 사이트](https://favicon.io/favicon-generator/)에서 ico를 생성합니다. 생성한 파일들을 /assets/img/favicon/ 폴더에 덮어씌웁니다.<br>
만약, 파일명이 다르면 favicon을 적용시키는 파일을 찾아 경로를 수정해야 합니다. 저는 파일명이 같기 때문에 경로를 수정하는 과정은 진행하지 않았습니다.
<br>

> 저는 <a href="https://kr.freepik.com/free-vector/cute-doodle-emoticon-set-journal-sticker_16446841.htm#query=%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98&position=14&from_view=keyword&track=ais_user&uuid=9994d256-1eaf-478f-b7f2-baefabe2009e">작가 rawpixel.com</a> 무료 이모지를 사용했습니다.  출처 Freepik 
{: .prompt-tip }

