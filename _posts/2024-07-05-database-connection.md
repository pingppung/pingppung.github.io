---
title: 데이터베이스 연결 방식 JPA vs Mybatis
author: pingppung
date: 2024-07-05 13:33:00 +0800
categories: [Development, Spring]
tags: [spring, java, database]
pin: false
math: true
mermaid: true
---
## JPA
JPA는 자바 애플리케이션에서 객체와 관계형 데이터베이스 간의 매핑을 자동으로 처리하는 ORM(Object-Relational Mapping) 프레임워크입니다.

### 특징
- **객체-관계 매핑**<br>
JPA는 자바 객체와 데이터베이스 테이블 간의 매핑을 정의할 수 있게 해줍니다.

- **데이터베이스 독립성**<br>
JPA를 사용하면 특정 데이터베이스에 종속되지 않고 다양한 데이터베이스를 쉽게 교체할 수 있습니다.

- **생산성**<br> 
JPA는 데이터베이스 연동과 관련된 많은 반복적인 코드를 줄여주어 개발 생산성을 높여줍니다.


### 연동 과정
**1. Entity 클래스 설계 및 작성**

먼저, 데이터베이스 테이블과 매핑될 Entity 클래스를 설계하고 작성합니다. 각 필드는 데이터베이스의 컬럼에 매핑됩니다.
```java
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;

    // Getters and setters, constructors, toString 등
}
```

**2. Repository 인터페이스 정의**

JPA Repository 인터페이스를 정의하여 데이터베이스 조작에 필요한 메서드를 선언합니다.
Spring Data JPA를 사용하면 구현체는 자동으로 생성됩니다.
```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    // 추가적으로 필요한 메서드 선언 가능
}

```
**3. application.properties 또는 application.yml 설정**

데이터베이스 연결 정보를 설정합니다. 데이터베이스 종류, URL, 사용자 이름, 암호 등을 설정합니다.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydatabase
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**4. Entity 클래스와 데이터베이스 테이블 매핑**

Entity 클래스의 각 필드를 데이터베이스 테이블의 컬럼과 매핑하고, 관계를 설정합니다.


```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    // Getters and setters
}
```


**5. 서비스 계층에서 Repository 사용**

필요한 비즈니스 로직을 구현하는 서비스 계층에서 Repository 인터페이스를 주입받아 사용합니다.
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    // 추가적인 비즈니스 로직 구현
}
```


## MyBatis
MyBatis는 SQL을 직접 작성하면서 객체와 관계형 데이터베이스를 매핑할 수 있는 프레임워크입니다. MyBatis는 SQL 매핑을 XML이나 어노테이션을 통해 정의하며, 개발자가 직접 SQL을 제어할 수 있는 유연한 방식을 지원합니다.

#### 특징
- **직접 SQL 작성**<br>
개발자가 직접 SQL을 작성하여 데이터베이스와 상호 작용할 수 있게 해줍니다. 이를 통해 SQL의 세부 사항을 완벽하게 제어할 수 있습니다.

- **유연성**<br>
복잡한 쿼리를 쉽게 작성하고 최적화할 수 있습니다.

- **XML 또는 어노테이션**<br>
 XML 파일 또는 어노테이션을 사용하여 매핑을 정의할 수 있습니다.

#### 연동 과정
**1. DB 테이블 생성 및 설정**

먼저, 데이터베이스에서 필요한 테이블을 생성합니다. 예를 들어, 사용자 정보를 저장할 users 테이블을 생성합니다.

```sql
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50),
    phone_number VARCHAR(20)
);
```

**2. 도메인 객체 설계**

```java
public class User {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;

    // Getters and setters, constructors, toString 등
}
```
**3. Mapper 인터페이스 정의**

MyBatis에서 사용할 DAO 인터페이스를 정의합니다.

```java
public interface UserMapper {
    List<User> selectAllUsers();
    User selectUserById(Long userId);
    void insertUser(User user);
    void updateUser(User user);
    void deleteUserById(Long userId);
}
```

**4. XML Mapper 생성**

DAO 인터페이스의 메서드와 매핑되는 SQL문을 XML 파일로 작성합니다. 
ex) select, insert, update, delete..

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">

    <select id="selectAllUsers" resultType="com.example.domain.User">
        SELECT * FROM users
    </select>

    <select id="selectUserById" parameterType="Long" resultType="com.example.domain.User">
        SELECT * FROM users WHERE user_id = #{userId}
    </select>

    <insert id="insertUser" parameterType="com.example.domain.User">
        INSERT INTO users (username, email, phone_number)
        VALUES (#{username}, #{email}, #{phoneNumber})
    </insert>

    <update id="updateUser" parameterType="com.example.domain.User">
        UPDATE users SET
            username = #{username},
            email = #{email},
            phone_number = #{phoneNumber}
        WHERE user_id = #{id}
    </update>

    <delete id="deleteUserById" parameterType="Long">
        DELETE FROM users WHERE user_id = #{userId}
    </delete>
</mapper>

```

**5. MyBatis 설정 파일 작성**

MyBatis 설정 파일을 작성하여 SQL 맵퍼 파일의 위치와 데이터베이스 연결 정보를 설정합니다.
Spring Boot Starter MyBatis 라이브러리를 사용하면 MyBatis 설정 파일(mybatis-config.xml)을 생략할 수 있습니다. Spring Boot가 자동으로 MyBatis와 데이터베이스를 설정해주기 때문입니다. 

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mydatabase"/>
                <property name="username" value="root"/>
                <property name="password" value="password"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="com/example/mapper/UserMapper.xml"/>
    </mappers>
</configuration>

```

**6. Spring과 MyBatis 연동 설정**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydatabase
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
mybatis.mapper-locations=classpath:/com/example/mapper/*.xml
```
**7. 서비스 계층에서 DAO 사용**

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public List<User> getAllUsers() {
        return userMapper.selectAllUsers();
    }

    public User getUserById(Long userId) {
        return userMapper.selectUserById(userId);
    }

    public void createUser(User user) {
        userMapper.insertUser(user);
    }

    public void updateUser(User user) {
        userMapper.updateUser(user);
    }

    public void deleteUserById(Long userId) {
        userMapper.deleteUserById(userId);
    }
}
```

## 