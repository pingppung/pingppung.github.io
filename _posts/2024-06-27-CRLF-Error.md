---
title: LF will be replaced by CRLF 경고
author: pingppung
date: 2024-06-27 15:33:00 +0800
categories: [Blogging]
tags: [blog]
pin: false
math: false
mermaid: true
---

Git에 파일을 커밋하려고 **`git add -A`**를 실행할 때, 아래와 같은 경고 메시지가 나타날 수 있습니다. 

```shell
LF will be replaced by CRLF the next time Git touches it
```
이 메시지는 Git이 파일의 줄바꿈 문자를 바꾸려고 한다는 경고입니다. 쉽게 말해서, 파일의 줄바꿈 방식이 변경될 것이라는 뜻입니다.

그렇다면 왜 줄바꿈 방식이 변경되는 것일까? <br>

Git은 기본적으로 플랫폼 간 호환성을 위해 줄바꿈 문자를 자동으로 변환하려고 합니다. 예를 들어, Windows에서 작업한 파일을 커밋하면 Git은 파일의 줄바꿈 문자를 LF에서 CRLF로 변환하여 저장할 수 있습니다. 이 변환 과정이 경고 메시지를 발생시키는 이유입니다.

해결 방법은 Git이 CRLF 대신 LF를 사용하도록 설정을 변경하는 것입니다. 다음 명령어를 실행한 후 다시 git add를 시도하면 문제 없이 파일을 추가할 수 있습니다.

```shell
git config --global core.autocrlf true
```
이 명령어는 Git의 core.autocrlf 설정을 전역적으로 true로 변경하여, Git이 자동으로 CRLF를 LF로 변환하도록 합니다.

