---
title: 프로세스와 스레드 - 개념과 차이점
author: pingppung
date: 2024-07-23 19:33:00 +0800
categories: [Development, Operating Systems]
tags: [processes, threads, os]
pin: false
math: true
mermaid: true
---
# 프로세스와 스레드
프로세스와 스레드는 우리가 사용하는 컴퓨터 시스템의 핵심 구성 요소입니다.

![Process, Thread](https://pingppung.github.io/assets/img/posts/2024-07-23/process-thread.PNG)

## 프로세스 (Processes)
프로세스는 실행 중인 프로그램의 독립적인 인스턴스입니다. 하나의 프로그램이 여러 번 실행되면, 각 실행마다 별도의 프로세스가 생성됩니다. 각 프로세스는 최소 1개의 스레드를 가지고 있습니다.

### 특징
- 독립적인 메모리 공간
- 자원의 독립적인 관리
- 프로세스 간의 통신이 필요

### 작동 방식
프로세스는 운영 체제에 의해 관리되며, 각각 독립적인 주소 공간을 가지고 실행됩니다. 운영 체제는 각 프로세스에 메모리와 자원을 할당하고, 이 자원은 프로세스가 종료될 때까지 유지됩니다.

## 스레드 (Threads)
스레드는 프로세스 내에서 실행되는 작은 실행 단위입니다. 스레드는 프로세스의 자원을 공유하여 실행되며, 다른 스레드의 실행 결과를 바로 확인할 수 있습니다.

### 특징
- 메모리와 자원 공유
- 빠른 생성과 종료
- 동기화 문제 발생 가능

### 작동 방식
스레드는 같은 프로세스 내에서 여러 작업을 동시에 수행할 수 있습니다. 이로 인해, 더 효율적으로 작업을 수행할 수 있으며 특히 멀티코어 시스템에서 유리합니다.


## 프로세스와 스레드의 차이점
### **메모리 관리**
프로세스는 독립적인 메모리 공간을 가지며, 스레드는 이 메모리를 공유합니다. 이는 프로세스 간의 간섭을 막아 안정성을 높이지만, 메모리 사용량이 많아질 수 있습니다. 반면 스레드는 메모리를 공유함으로써 자원을 효율적으로 사용할 수 있지만, 동기화 문제로 인해 데이터 일관성을 유지하는 것이 중요합니다.

### **자원 관리**
프로세스는 자원을 독립적으로 관리합니다. 이는 한 프로세스가 다른 프로세스의 자원에 접근할 수 없음을 의미하며, 각 프로세스가 독립적으로 실행되어 안정성이 높습니다. 반면 스레드는 자원을 공유하여 작업을 수행하므로 더 빠르고 효율적이지만, 동기화 문제로 인해 충돌이 발생할 수 있습니다.