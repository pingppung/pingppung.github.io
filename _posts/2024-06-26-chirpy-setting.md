---
title: jekyll로 GitHub Pages 만들기(2)
description: GitHub Pages 환경 설정 후 배포 과정
author: pingppung
date: 2024-06-26 13:33:00 +0800
categories: [Blogging]
tags: [blog]
pin: false
math: false
mermaid: true
---
## **chirpy 환경 설정**

본인 블로그 환경에 맞춰 _config.yml 파일 설정을 변경해야합니다.<br>
제가 수정한 부분만 적어두었습니다.
```yaml
theme: jekyll-theme-chirpy
lang: ko
timezone: Asia/Seoul
title: 블로그 제목
tagline: title의 부연 설명
description: SEO를 위한 키워드
url: 블로그 실제 url "ex)https://pingppung.github.io"
github:
    username: 본인의 github 닉네임 입력
social:
    name: 본인 닉네임 or 이름
    email: 본인 이메일 계정
    links: 소셜 링크들
avatar: 왼쪽 바에 표시될 이미지의 경로
```


## **배포**
변경된 내용을 커밋하고 원격 저장소로 푸시합니다.
```shell
git add -A
git commit -m "커밋 메시지"
git push
```
### 문제 해결
#### 1. --- layout: home # Index page --- 
로컬 환경에서는 사이트가 잘 실행되었지만, push 후 웹페이지에 접속하면 다음과 같은 화면이 나타나는 문제가 발생했습니다.

![css_problem](https://pingppung.github.io/assets/img/posts/2024-06-26/css적용%20문제.PNG)

**해결방안**

![css_solve](https://pingppung.github.io/assets/img/posts/2024-06-26/github%20actions.PNG)
> GitHub Actions 설정 변경
  
- 해당 GitHub Repository의 Settings로 이동

- Pages 섹션에서 Build and Deployment의 Source를 GitHub Actions로 변경

- Configure를 클릭하여 jekyll.yml을 커밋


> 기존 배포 설정 파일 삭제

- 원래 github/workflows 폴더 내에 있던 pages-deploy.yml 파일을 삭제

- 삭제 후 커밋 & push



#### 2. js파일 does not exist

원격 저장소로 push하면 **`internal scripy /assets/js/dist/*.min.js does not exist.`** 오류 발생

**해결방안**

해당 명령어로 /assets/js/dist/*.min.js 파일 생성
```
npm install && npm run build.
```
.gitignore 파일에 다음 부분을 주석 처리
```
# Misc
# _sass/dist
# assets/js/dist
```

#### 3. jekyll-theme-chirpy.scss 위치
다른 분들의 블로그를 참고하여 jekyll-theme-chirpy.scss 파일을 `_sass` 폴더 내에 위치시켰을 때 `/app.min.js` 오류가 발생했었습니다.

그러나 원래 상태인 `/assets/css/` 폴더 밑에 위치시켜도 실행 잘 되니깐 옮기지 마세요!! 저도 파일 구조가 왜 다르지 하고 옮겼다가 오류나서 시간 엄청 잡아먹었습니다.😱

## 마무리
GitHub 블로그 생성을 완료했습니다. 다음 단계로는 Chirpy 테마를 커스터마이징하는 과정에 대해 설명하겠습니다. 