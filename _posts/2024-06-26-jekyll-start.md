---
title: jekyll로 GitHub Pages 만들기(1)
description: 개발자에게 블로그는 필수라던데…
author: pingppung
date: 2024-06-26 11:33:00 +0800
categories: [Blogging]
tags: [blog]
pin: false
math: false
mermaid: true
---

## **개발 블로그 시작하기**

글을 못 쓰기도 했고 누군가 내 글을 볼 수 있다는 생각에 블로그를 꺼려졌습니다. 이로 인해 지금까지는 필요한 내용만 노션에 작성하는 식으로 진행해왔습니다. 그러나 면접 준비를 하면서 기술 지식이 부족하다는 것을 깨닫고, 이를 극복하기 위해 블로그를 시작하여 기술적인 내용을 깊이 있게 공부하고자 합니다. 

개발 블로그를 시작하기 위해서 많은 고민을 해왔습니다. 어떤 플랫폼을 사용하면 좋을까?

***`Velog`***, ***`GitHub Pages`***, ***`네이버 블로그`***, ***`티스토리`*** 등 여러 가지 블로그 플랫폼 중에서 어떤 것을 선택해야 할지 많은 고민했습니다.

최종적으로 **깔끔한 디자인으로 커스터마이징할 수 있다는 점**과 **마크다운 지원**을 우선순위로 두고 GitHub Pages를 사용하기로 결정했습니다.

---
## **로컬 환경 설정**
#### 1. Ruby 설치

jekyll 사용하기 위해서는 Ruby를 설치해줘야 합니다. <br>
→ <mark>꼭 Devkit 있는 버전으로 다운받기!!</mark> <br>
https://rubyinstaller.org/downloads/
![ruby_install](https://pingppung.github.io/assets/img/posts/2024-06-26/ruby_install.PNG ){:style="border:1px solid #606060; padding: 0px;"}

#### 2. 깃허브 Repository 생성
`본인 깃허브 계정명`.github.io의 Repository를 생성해줘야합니다.
Repository이 생성됐다면, 본인 컴퓨터에 로컬 저장소에 clone을 해주면 됩니다
```shell
git clone https://github.com/{github_username}/{github_username}.github.io  
```
#### 3. jekyll 설치
```shell
gem install jekyll
gem install bundler
```
---
## **chirpy 테마 설치**
Chirpy 테마를 설치하는 방법에 대해서는 소스를 zip 파일로 다운로드 받아 설치하는 작업으로 진행했습니다.

#### 1. Chirpy GitHub에서 zip 파일 다운로드
먼저, [Chirpy 테마의 GitHub 저장소](https://github.com/cotes2020/jekyll-theme-chirpy)에서 최신 소스 코드를 zip 파일로 다운로드합니다.
         
#### 2. 다운받은 파일 본인 로컬 저장소로 옮기기
다운로드한 zip 파일을 본인의 로컬 저장소에 적절한 위치로 옮깁니다.

#### 3. chirpy 초기화
Linux에서는 ***`bash tools/init.sh*** 명령어로 chirpy 테마를 초기화할 수 있습니다. 하지만 Windows에서는 이 명령어를 사용할 수 없으므로, 수동으로 초기화를 진행해야 합니다. 아래는 Windows에서 chirpy 테마 초기화를 위한 과정입니다:
- ***`github/workflows/pages-deploy.yml`*** 파일을 제외한 나머지 파일 삭제<br>
→ starter 폴더 내에 있는 경우엔 옮기고 해당 폴더 삭제해도 상관 X
- ***`docs`*** 폴더 삭제
- ***`Gemfile.lock`*** 파일 삭제
이외에도 추가적으로 다른 블로그에서는 삭제해야될 파일, 폴더가 있는 경우, 본인의 판단에 맞게 진행하면 됩니다. 저는 해당 파일과 폴더만 삭제 후 다음 과정을 진행했습니다.

#### 4. 로컬에서 실행
아래 명령어를 입력 후 http://127.0.0.1:4000/ 로 접속하면 완료
```shell
cd 로컬 저장소 주소  
bundle  //Gemfile.lock 파일 생성하는 과정
bundle exec jekyll serve
```

---
## **마무리**
로컬 환경에서의 블로그 구성이 완료되었습니다. 다음 포스트에서는 원하는 블로그 환경으로 수정하고 GitHub에 업로드하는 과정을 마무리짓겠습니다.