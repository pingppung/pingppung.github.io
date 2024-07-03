---
title: 데이터 접근과 전송을 위한 객체들 - DAO, DTO, VO, Record, Entity
author: pingppung
date: 2024-07-01 13:33:00 +0800
categories: [Development, Spring]
tags: [spring, java]
pin: false
math: false
mermaid: true
---

## **DAO (Data Access Object)**
> 데데이터 액세스 로직을 담당하는 객체

주로 JDBC나 Hibernate 같은 ORM 프레임워크를 사용하지 않고 순수한 SQL 쿼리나 JDBC 코드를 이용하여 데이터베이스와 상호작용을 합니다.

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDao {
    
    private Connection connection;

    public UserDao(Connection connection) {
        this.connection = connection;
    }

    public void save(User user) throws SQLException {...}

    public User findById(Long id) throws SQLException {...}

    // 기타 데이터 액세스 메서드들...
}

```
위의 예제에서 Connection 객체를 사용하여 데이터베이스와의 연결을 설정하고, save 메서드와 findById 메서드를 통해 데이터베이스와 상호작용합니다.

## **DTO (Data Transfer Object)**
> 계층 간 데이터 전송을 위한 객체로, 비즈니스 로직을 포함하지 않습니다.

주로 서로 다른 계층(예: 클라이언트와 서버) 간 데이터 교환에 사용됩니다.
필요한 데이터만을 담아서 전송함으로써 효율적인 데이터 교환을 지원하고, 클라이언트와의 인터페이스를 명확히 정의합니다.

```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String email;

    @Override
    public String toString() {...}
}
```

## **VO (Value Object)**
> 변경 불가능하며 읽기 전용으로 사용되는 객체로, 데이터의 일관성을 보장합니다.

보통 도메인 모델에서 중요한 값을 나타냅니다.
불변성을 가지며, 값을 캡슐화하여 의미 있는 단위로 표현합니다.


```java
@Getter
public class User {

    private final Long id; //주민등록번호
    private final String name;

    public User(Long id, String name) {...}

    @Override
    public boolean equals(Object obj) {...}

    @Override
    public int hashCode() {...}

    @Override
    public String toString() {...}
}
```

## **Record**
> Java에서 데이터를 저장하고 접근하기 위한 불변 클래스로, 간단한 데이터 구조를 표현합니다.

자동으로 생성되는 Getter, equals, hashCode, toString 등의 메서드를 제공하여 코드를 간소화합니다.
주로 데이터를 효율적으로 저장하고 접근하기 위해 사용됩니다.


```java
public record UserRecord(String username, String email) {
}
```

## **Entity**
> 데이터베이스의 테이블과 매핑되는 객체

데이터베이스의 구조를 반영하며, JPA와 같은 ORM(Object-Relational Mapping) 프레임워크를 통해 데이터베이스와 상호작용합니다.
```java

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String email;
    
    @Override
    public String toString() {...}
}

```
---

## DTO를 사용하는 이유
굳이 DTO를 사용하는 이유는 뭘까? 그냥 필요할 때마다 요청해서 값을 받아오면 되는거 아닌가?

1. **데이터 전송의 효율성** : DTO는 필요한 데이터만을 담아 전송함으로써 네트워크 트래픽을 줄이고 성능을 최적화할 수 있습니다. 클라이언트와 서버 간의 데이터 교환을 최소화하여 응답 시간을 단축시키는 데 기여합니다.

2. **명확한 데이터 정의** : DTO는 클라이언트에게 제공되는 데이터의 형태를 명확히 정의함으로써 개발자 간의 협업과 이해를 쉽게 만듭니다. 데이터 필드와 그 의미를 명확히 정의하여 혼란을 줄이고, 의도하지 않은 데이터 전달 오류를 방지할 수 있습니다.

3. **데이터 노출 제어** : DTO는 클라이언트에게 전달되는 데이터를 특정 형태로 제한함으로써 데이터 노출을 관리할 수 있습니다. 클라이언트에게 필요하지 않은 정보를 노출하지 않고, 보안적인 측면에서도 더 안전한 방식으로 데이터를 처리할 수 있습니다.


## DTO, VO, Recrod 비교
DTO, VO, Record는 데이터를 저장하고 접근하기 위한 목적으로 설계된 역할로, 유사한 점이 있지만 각각의 객체는 다음과 같은 목적과 사용 방법에서 차이가 있습니다.

- **DTO**: 데이터 전송을 단순화하고, 서로 다른 계층 간의 데이터 교환을 표현하기 위해 사용됩니다. 주로 필드들이 mutable하게 관리됩니다. <u>예를 들어, 클라이언트가 입력한 데이터를 서버로 전송하거나, 서버에서 클라이언트로 데이터를 반환할 때 사용됩니다.</u>

- **VO**: 도메인의 일관성과 값을 보장하기 위해 사용됩니다. 불변성을 가지므로 한 번 설정된 값은 변경되지 않습니다. 도메인 객체의 특정 값(<u>예: 금액, 주소, 식별자 등</u>)을 표현하며, 값의 일관성을 보장하는 데 중점을 둡니다.

- **Record**: 데이터를 간단하게 저장하고 접근하는 데 사용되며, 자동 생성되는 메서드를 통해 코드를 간소화할 수 있습니다. 

#### 결론
각각의 객체는 자신의 목적과 사용하는 컨텍스트에 맞게 설계되어 있습니다. DTO는 데이터 전송의 효율성을 높이고, VO는 값의 일관성을 유지하며, Record는 데이터를 간단하게 관리하는 데 중점을 둡니다. 이들을 목적에 맞게 구분하여 사용하면 코드의 가독성과 유지보수성을 높일 수 있습니다.






