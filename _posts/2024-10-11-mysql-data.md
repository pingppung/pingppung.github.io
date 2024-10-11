---
title: MySQL 데이터 백업 및 복원
author: pingppung
date: 2024-10-11 11:33:00 +0800
categories: [DevOps, Docker]
tags: [docker, spring boot, react, mysql, deployment]
pin: false
math: false
mermaid: false
---

로컬 환경에서 MySQL을 사용하다가 프로젝트가 진행되면서 Docker로 환경을 옮기게 됐다. Docker 환경으로 전환하면서, 로컬에서 작업했던 데이터가 Docker에서도 있을 거라 생각했다. 하지만 Docker 컨테이너에는 아무 데이터도 없었다. 로컬과 Docker는 완전히 별개 환경이기 때문에 데이터가 자동으로 전환되지 않는다는 점을 깨달았다.

![db](https://pingppung.github.io/assets/img/posts/2024-10-11/복원할 데이터베이스.png)

## 로컬 MySQL 데이터 백업
로컬에서 MySQL 데이터를 백업하려면 mysqldump 명령어를 사용한다. 
이 명령어는 데이터베이스의 테이블, 데이터, 인덱스 등을 SQL 파일로 추출해 저장한다. 아래와 같이 명령어를 실행하여 데이터를 백업할 수 있다.
```bash
mysqldump -u root -p <백업할 데이터베이스 이름> > <데이터를 저장할 경로와 파일 이름>
mysqldump -u root -p contenthub > C:\Users\pingppung\Documents\contenthub_dump.sql
```
이 명령어로 로컬 데이터를 덤프 파일로 저장했다. 백업 경로를 정확하게 지정하지 않으면 파일이 저장되지 않는 문제가 생길 수 있으니 주의가 필요하다.

**덤프 파일이란?**
덤프 파일은 데이터베이스의 데이터를 파일로 추출한 것으로, 주로 백업이나 복원을 위해 사용된다. 이 파일에는 데이터베이스의 구조와 데이터가 SQL 쿼리문 형태로 저장된다. 예를 들어, 테이블을 생성하는 `CREATE TABLE` 문이나 데이터를 삽입하는 `INSERT INTO` 문이 포함되며, 이 파일을 이용해 데이터베이스를 복구할 수 있다.

## Docker 컨테이너로 데이터 복사
로컬에서 백업한 `contenthub_dump.sql` 파일을 Docker 컨테이너로 복사해야 한다. `docker cp` 명령어를 사용하여 파일을 컨테이너로 전송할 수 있다.

```bash
docker cp <저장했던 파일 위치> <MySQL이 실행 중인 Docker 컨테이너 이름>:<컨테이너 내 파일을 저장할 경로>
docker cp C:\Users\pingppung\Documents\contenthub_dump.sql contenthub-db-1:/tmp/
```
이 명령어로 `contenthub_dump.sql` 파일을 MySQL이 실행 중인 Docker 컨테이너의 `/tmp/` 디렉토리로 복사했다.

## Docker에서 데이터 복원
복사한 파일을 Docker 컨테이너 내에서 MySQL을 통해 복원할 수 있다. 컨테이너에 접속하여 MySQL에 로그인하고, 덤프 파일을 사용해 데이터를 복원한다.

```bash
docker exec -it contenthub-db-1 mysql -u root -p
USE contenthub;
SOURCE /tmp/contenthub_dump.sql;
```
- `docker exec -it contenthub-db-1 mysql -u root -p` : MySQL이 실행 중인 Docker 컨테이너에 접속하고 MySQL에 로그인한다.
- `USE contenthub;` : 복원할 데이터베이스를 선택한다.
- `SOURCE /tmp/contenthub_dump.sql;` : 덤프 파일을 실행하여 데이터를 복원한다.

![restore_db](https://pingppung.github.io/assets/img/posts/2024-10-11/덤프파일로 복원.png)

위 이미지는 덤프 파일을 통해 데이터베이스를 복원하는 과정을 보여준다. 

복원이 완료된 후, 직접 데이터베이스에 접근해 제대로 데이터가 들어갔는지 확인했다. SELECT 쿼리를 사용해 데이터를 조회해 본 결과, 로컬에서 사용했던 데이터들이 모두 정상적으로 복원되어 있었다. 로컬에서 Docker로 환경을 옮기면서 발생했던 데이터 손실 문제를 이렇게 해결할 수 있었다.


![complete_db](https://pingppung.github.io/assets/img/posts/2024-10-11/데이터복원완료.png)

복원이 완료되어 회원가입했던 유저들의 정보들이 잘 넘어간 것을 볼 수 있다.

## 마무리
이처럼 로컬 환경에서 Docker 환경으로 전환하면서 데이터도 함께 옮기는 과정이 필요했다. 앞으로는 데이터의 안전성을 위해 항상 백업을 고려하는 것이 좋을 것 같다. 데이터 손실, 하드웨어 고장 또는 기타 문제를 방지하기 위해 정기적인 백업을 실시하고, 실제 운영 환경에서는 데이터가 매우 중요하므로 언제든지 복구할 수 있는 방법을 마련해 두는 것이 좋을 것 같다.