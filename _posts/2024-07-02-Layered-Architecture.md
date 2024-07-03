---
title: 웹 애플리케이션 계층
author: pingppung
date: 2024-07-02 13:33:00 +0800
categories: [Development, Spring]
tags: [spring, java]
pin: false
math: true
mermaid: true
---
## 웹 애플리케이션 계층

![Layer_Pattern](https://pingppung.github.io/assets/img/posts/2024-07-02/Layer%20Pattern.PNG)

## **Domain**
도메인은 소프트웨어 시스템이 다루는 특정 비즈니스 영역을 의미합니다. 도메인은 비즈니스 로직과 규칙을 포함하며, 시스템의 핵심적인 부분을 정의합니다. 주로 <u>엔티티, 값 객체, 도메인 서비스 등</u>이 포함됩니다.

주문 시스템을 설계할 때 도메인 계층에서 사용할 수 있는 주요 엔티티 및 서비스 클래스를 예시로 들어보겠습니다. 
1. **`값 객체`**

    값 객체는 다음과 같은 특성을 가집니다:

    - 불변성(Immutable): 내부 상태가 변경되지 않습니다.
    - 주로 엔티티의 속성을 나타냅니다.
    - 해당 객체의 의미를 명확하게 정의합니다.

    예시로 주소(Address) 클래스와 주문 번호(OrderNumber) record가 있습니다.
    ```java
    public class Address {
        private String street;
        private String city;
        private String zipCode;
        // 생성자, getter, equals 등의 메서드 구현
    }

    public record OrderItem(Long productId, int quantity, BigDecimal price) {
        // 유효성 검증 로직 등은 생성자에 추가할 수 있음
        ...
    }
    ```
    <br><br>  

2. **`Entity`** : 메인 엔티티는 **식별 가능하고 변화하는 객체**입니다. 엔티티 내부에는 해당 엔티티의 상태를 관리하고 조작하는 비즈니스 로직이 포함될 수 있습니다.

    예시로 주문(Order) 엔티티 클래스가 있습니다.
    ```java
    @Entity
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "order")
    public class Order {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String orderNumber; 

        @OneToMany(mappedBy = "order")
        private List<OrderItem> orderItems;//OrderItem 값 객체
        private Address shippingAddress; //Address 값 객체
        ...

        public BigDecimal calculateTotalAmount() {...}
        public void changeStatus(OrderStatus newStatus) {...}
        ...
    }
    ```
    이외에도 `OrderItem`, `Customer`, `Product`, `Payment`, `Shipment` 등의 엔티티가 존재할 수 있습니다.
    <br><br>


3. **`Domain Service`**: 도메인 서비스는 여러 엔티티 간의 복잡한 비즈니스 로직을 처리합니다. 도메인 서비스는 주로 한 엔티티의 책임으로 정의하기 어렵거나, 여러 엔티티를 조작해야 하는 비즈니스 로직을 캡슐화합니다.
    ```java
    @Service
    @RequiredArgsConstructor
    public class OrderService {
        private final OrderRepository orderRepository;
        private final ProductService productService;
        private final PaymentService paymentService;

        @Transactional
        public Order createOrder(OrderData orderData) {...}

        @Transactional
        public void cancelOrder(Long orderId) {...}

        public Order getOrderDetails(Long orderId) {...}

        public List<Order> listOrdersByCustomer(Long customerId) {...}
    }
    ```
    주문 상태 변경, 결제 처리, 재고 감소 등 비즈니스 로직이 있습니다. 

    <br>


#### 도메인 엔티티 vs 도메인 서비스
    
- 도메인 엔티티:
개별 엔티티의 상태를 관리하고 조작하는 비즈니스 로직을 포함합니다.
주로 엔티티의 속성 값을 검증하고, 상태 전이를 관리합니다.<br>
_예: Order 엔티티의 calculateTotalAmount 메서드나 changeStatus 메서드_

- 도메인 서비스:
여러 엔티티와 상호작용하여 수행해야 하는 비즈니스 로직을 처리합니다.
단일 엔티티의 책임으로 정의하기 어려운 로직을 포함합니다.<br>
 _예: OrderService의 createOrder 메서드, cancelOrder 메서드_


<br><br>
  
## **Application Service**
애플리케이션 서비스는 사용자 인터페이스(UI)와 도메인 사이의 **중개자 역할**을 수행합니다. 클라이언트의 요청을 받아 처리하고, 도메인 서비스를 호출하여 비즈니스 로직을 실행하며, 트랜잭션 관리 및 예외 처리 등의 업무를 담당합니다.

**주문 애플리케이션 서비스 예시**
```java
@Service
@RequiredArgsConstructor
public class OrderApplicationService {
    private final OrderService orderService;
    private final CustomerService customerService;
    private final ProductService productService;
    private final PaymentService paymentService;

    public OrderDTO placeOrder(OrderData orderData) {...}
    public void cancelOrder(Long orderId) {...}
    public OrderDTO getOrder(Long orderId) {...}
    public List<OrderDTO> listCustomerOrders(Long customerId) {...}
    private OrderDTO convertToDTO(Order order) {...}
}


```
<br><br>

## **Repository**
Repository는 데이터베이스의 데이터를 관리하고 접근하는 객체입니다. <br>
주로 CRUD(Create, Read, Update, Delete) 연산을 수행하여 데이터의 영속성을 관리하며, 데이터베이스의 특정 테이블이나 엔티티에 대한 접근을 추상화합니다.

예를 들어, Spring Framework에서는 JpaRepository 인터페이스를 통해 간편하게 Repository를 정의할 수 있습니다:
```java
public interface UserRepository extends JpaRepository<Item, Long>{
    User findById(String id);
    User findByUsername(String username);
    User save(User user);
    void delete(User user);
    List<User> findAll();
    ...
}
```

### **Repository와 DAO의 차이점**
#### <a href="https://pingppung.github.io/posts/data-objects/">DAO (Data Access Object)</a>
DAO는 데이터베이스와의 직접적인 상호작용을 담당하는 객체입니다. 주로 순수한 SQL 쿼리나 JDBC 코드를 이용하여 데이터베이스와의 연동을 처리합니다. DAO는 데이터베이스의 특정 테이블이나 객체에 집중하여 CRUD(Create, Read, Update, Delete) 연산을 수행하며, 데이터베이스 연결과 트랜잭션 관리를 프로그래머가 직접 처리해야 합니다.

#### Repository
Repository는 데이터 액세스 코드를 추상화하여 개발자가 보다 간편하게 데이터베이스와 상호작용할 수 있도록 도와주는 객체입니다. 주로 ORM 프레임워크를 사용하여 데이터베이스와의 상호작용을 추상화하며, 프레임워크가 제공하는 기능을 통해 CRUD 연산을 자동으로 처리할 수 있습니다. Repository는 개발자가 데이터베이스 연결과 트랜잭션 관리를 프레임워크에 위임하여 코드의 간결성을 유지할 수 있습니다.
