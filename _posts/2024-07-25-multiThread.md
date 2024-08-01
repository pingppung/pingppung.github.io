---
title: 소켓 게임 서버 개발- 멀티스레드 활용
author: pingppung
date: 2024-07-25 19:33:00 +0800
categories: [Development, Operating Systems]
tags: [java, processes, threads, os]
pin: false
math: true
mermaid: true
---

# 소켓 게임 개발
자바를 사용한 멀티유저 소켓 게임 서버 개발 프로젝트에서 스레드를 활용한 경험에 대한 내용입니다.

## 프로젝트 개요
### 프로젝트 설명
이 프로젝트는 자바로 개발한 멀티플레이어 소켓 게임으로, 여러 클라이언트가 동시에 접속하고 상호작용할 수 있는 퀴즈 게임입니다. 주요 기능은 클라이언트 간의 실시간 소통과 퀴즈 진행입니다.	

### 기술 스택
- **자바 (Java)**
- **소켓 프로그래밍**
- **멀티스레딩**

## 스레드 구현
서버는 다수의 클라이언트와 동시에 상호작용할 수 있어야 합니다. 이를 위해 각 클라이언트의 연결을 별도의 스레드에서 처리하였습니다. 

### 서버 스레드 구조
서버는 클라이언트의 연결을 수신하기 위해 `AcceptServer` 스레드를 사용하고, 각 클라이언트의 요청을 처리하기 위해 `UserService` 스레드를 생성합니다.
```java
// 새로운 참가자 accept() 하고 user thread를 새로 생성한다.
class AcceptServer extends Thread {
	@SuppressWarnings("unchecked")
	public void run() {
		while (true) { 
			// 사용자 접속을 계속해서 받기 위해 
		}
    }
}
// 클라이언트 요청을 처리하는 스레드
class UserService extends Thread {
		private Socket clientSocket;

    public UserService(Socket clientSocket) {
        this.clientSocket = clientSocket;
    }

    public void run() {
        // 클라이언트와의 상호작용 처리
    }
}
```

## 데이터 충돌 문제
여러 플레이어가 동시에 여러 방에 참가하거나 게임을 진행할 때 데이터 충돌 문제가 발생했습니다. 하나의 서버 파일에서 모든 것을 관리하는 방식으로 인해 중간에 플레이어가 들어오면 값이 변경되어 다른 플레이어에게 영향을 주는 상황이 발생했습니다.

### 문제 해결
문제를 해결하기 위해 각 플레이어별로 스레드를 생성하여 동시에 여러 방에 참가할 수 있도록 했습니다. 또한, 각 방의 상태를 독립적으로 관리하기 위해 `Room` 객체와 `RoomManager` 클래스를 도입했습니다.

#### Room 객체와 RoomManager 클래스
각 방의 상태를 효율적으로 관리하기 위해 Room 객체와 RoomManager 클래스를 만들었습니다.

```java
class Room {
    private String roomName;
    private Vector<UserService> users;

    public Room(String roomName) {
        this.roomName = roomName;
        this.users = new Vector<>();
    }

    public void addUser(UserService user) {
        users.add(user);
    }

    public void removeUser(UserService user) {
        users.remove(user);
    }
}

class RoomManager {
    private Map<String, Room> rooms;

    public RoomManager() {
        rooms = new HashMap<>();
    }

    public Room getRoom(String roomName) {
        return rooms.get(roomName);
    }

    public void createRoom(String roomName) {
        rooms.put(roomName, new Room(roomName));
    }
}
```