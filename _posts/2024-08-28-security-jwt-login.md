---
title: Spring Security로 JWT 기반 소셜 로그인 구현하기
author: pingppung
date: 2024-08-28 11:33:00 +0800
categories: [Programming, Spring Security]
tags: [spring, java, security, jwt]
pin: false
math: false
mermaid: false
---
## Spring Security의 보안 필터 체인
Spring Security에서 필터 체인은 웹 애플리케이션의 요청(Request)과 응답(Response)을 처리하기 위해 사용하는 여러 필터의 연속입니다. 필터는 요청이 서버에 도달하기 전에 또는 응답이 클라이언트로 가기 전에 보안 검사를 하고, 필요에 따라 작업을 합니다.

### Spring Security의 주요 보안 필터들
- **`UsernamePasswordAuthenticationFilter`**: 사용자가 로그인할 때 아이디와 비밀번호를 확인합니다.
- **`SecurityContextPersistenceFilter`**: 사용자의 인증 정보를 세션에 저장하여 로그인 상태를 유지합니다.
- **`CsrfFilter`**: CSRF 공격을 방지하기 위해 웹 폼의 보안을 강화합니다.
- **`ExceptionTranslationFilter`**: 인증 오류나 접근 거부 상황을 처리합니다.
- **`FilterSecurityInterceptor`**: 사용자가 요청한 리소스에 대한 접근 권한을 확인합니다.



## JWT 기반 소셜 로그인 구현하기

### SecurityConfig 클래스

JWT 기반 소셜 로그인을 구현하려면, Spring Security의 기본 설정을 커스터마이징할 필요가 있습니다. 이 역할을 하는 것이 바로 **`SecurityConfig`** 클래스입니다.

`SecurityConfig` 클래스는 Spring Security 설정을 정의하는 중심 클래스입니다. 이 클래스에서는 보안 필터 체인의 구성, 인증 및 인가 전략 설정, 그리고 예외 처리 등의 보안 관련 설정을 커스터마이징합니다.

#### 주요 설정들

1. **필터 체인 설정**
   - `SecurityConfig` 클래스에서 직접 필터들을 등록하고, 순서를 지정하여 필터 체인을 구성합니다. `JwtAuthenticationFilter`와 `JwtAuthorizationFilter`가 필터 체인에 추가해서 사용자가 로그인할 때 JWT 토큰을 생성하고, 이후 요청에서 토큰을 검증하는 로직이 필터 체인에 포함됩니다.

2. **인증 및 인가 설정**
   - 특정 URL 패턴에 대한 접근 권한을 설정하고, 인증이 필요한 페이지와 그렇지 않은 페이지를 구분합니다.

3. **로그인 설정**
   - 로그인 페이지, 로그인 성공 및 실패 처리, 로그아웃 설정 등을 정의합니다. 예를 들어, `/login` 경로를 로그인 페이지로 지정하고, 로그인 성공 시 JWT 토큰을 발급하는 로직을 추가할 수 있습니다.

4. **예외 처리**
   - 인증 실패 시나 접근이 거부될 때의 예외 처리를 설정합니다.

#### `SecurityConfig` 클래스

이제 `SecurityConfig` 클래스를 통해 JWT 인증 및 인가를 포함한 Spring Security 설정을 완성할 수 있습니다. 이 설정은 전체 보안 체계를 정의하는 중요한 역할을 하며, 애플리케이션의 보안을 탄탄하게 만듭니다.
```java
@EnableWebSecurity // Spring Security filter가 spring filterchain에 등록
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    private final CorsFilter corsFilter;
    private final PrincipalDetailsService principalDetailsService;
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    // 사용자가 제공한 비밀번호를 암호화하여 저장하고, 인증 시 저장된 비밀번호와 사용자가 제공한 비밀번호를 비교하여 일치 여부를 확인
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder sharedObject = http.getSharedObject(AuthenticationManagerBuilder.class);

        sharedObject.userDetailsService(this.principalDetailsService);
        AuthenticationManager authenticationManager = sharedObject.build();

        http.authenticationManager(authenticationManager);
        http.csrf(CsrfConfigurer::disable)
                .httpBasic(httpBasic -> httpBasic.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .addFilter(corsFilter) // 1. 컨트롤러에 @CrossOrigin 하는 방법 - 인증 X, 2. 시큐리티 필터에 등록 - 인증O
                .addFilter(new JwtAuthenticationFilter(authenticationManager, tokenProvider))
                .addFilter(
                        new JwtAuthorizationFilter(authenticationManager, userRepository, tokenProvider, SECRET_KEY));
        http.sessionManagement( // JWT 방식은 세션저장을 사용하지 않기 때문에 꺼주기.
                sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/manager/**").hasAnyRole("ADMIN", "MANAGER") // 인증뿐만 아니라 권한이 있는 사람만 들어올 수 있다.
                .requestMatchers("/user/**").authenticated() // 해당 주소로 들어오면 인증이 필요하다.
                .anyRequest().permitAll());
        http.formLogin(formLogin -> formLogin
                .loginPage("/login")
                .usernameParameter("username")
                .passwordParameter("password")
                .loginProcessingUrl("/auth/login") // 주소가 호출되면 시큐리티가 낚아채서 대신 로그인 진행
                .permitAll());
        http.logout(logout -> logout
                .permitAll());
        //
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);
        // exposed-headers 설정
        config.setExposedHeaders(Arrays.asList("Access-Control-Allow-Headers",
                "Authorization, x-xsrf-token, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, " +
                        "Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

#### JwtAuthenticationFilter 클래스

이 필터는 사용자의 로그인 요청을 처리합니다. 사용자가 로그인 시도를 하면, 이 필터가 사용자의 자격 증명을 확인하고, 인증이 성공하면 JWT 토큰을 생성하여 응답에 포함시킵니다. JWT 토큰은 이후 요청에서 사용자의 **인증 상태를 확인**하는 데 사용됩니다.

```java
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    // 로그인 시도 시 실행되는 함수
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        log.info("JwtAuthenticationFilter : 로그인 시도 중");
        try {
            ObjectMapper om = new ObjectMapper();
            User user = om.readValue(request.getInputStream(), User.class);

            // 사용자 이름과 비밀번호로 인증 토큰 생성
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    user.getUsername(), user.getPassword());

            // 인증 시도 및 결과 반환
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            log.info("토큰 생성 완료!");
            return authentication;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    // 인증 성공 시 JWT 토큰 생성 및 응답 헤더에 추가
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authResult) throws IOException, ServletException {
        log.info("JWT 토큰 생성");
        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();
        String jwtToken = tokenProvider.generateToken(principalDetails);

        response.addHeader("Authorization", "Bearer " + jwtToken);
    }
}
```
#### JwtAuthorizationFilter 클래스

이 필터는 사용자가 **요청한 리소스에 접근할 권한이 있는지를 확인**합니다. 사용자가 요청을 보낼 때, 요청 헤더에 포함된 JWT 토큰을 검증해 사용자가 유효한지 확인합니다. 만약 토큰이 유효하다면, 사용자의 권한을 체크하고 요청을 처리하도록 허용합니다.
```java
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private final UserRepository userRepository;
    private final String key;
    private final TokenProvider tokenProvider;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository,
            TokenProvider tokenProvider, String key) {
        super(authenticationManager);
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
        this.key = key;
    }

    // 인증이나 권한이 필요한 주소 요청이 있을 때 해당 필터를 타게 됨
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        log.info("인증이나 권한이 필요한 주소 요청이 됨");

        String jwtHeader = request.getHeader("Authorization");
        log.info("jwtHeader : " + jwtHeader);

        // header가 있는지 확인
        if (jwtHeader == null || !jwtHeader.startsWith("Bearer")) {
            chain.doFilter(request, response);
            return;
        }
        // JWT 토큰을 검증을 해서 정상적인 사용자인지 확인
        String jwtToken = request.getHeader("Authorization").replace("Bearer ", "");
        if (jwtToken.equals("null")) {
            throw UserException.invalidUserException();
        }
        log.info("JwtAuthorizationFilter 키 확인 :  " + key);
        String username = tokenProvider.getUsernameFromToken(jwtToken);
        // 서명이 정상적으로 됨
        if (username != null) {
            User userEntity = userRepository.findByUsername(username);
            PrincipalDetails principalDetails = new PrincipalDetails(userEntity);
            log.info("User roles: " + userEntity.getRole()); // 권한 출력

            // 이미 username으로 사용자가 인증됐기 때문에 강제로 authentication 만드는 중
            // 비밀번호를 안넣고 null을 넣어도 상관없다.
            Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null,
                    principalDetails.getAuthorities());

            // 강제로 시큐리티의 세션에 접근하여 Authentication 객체를 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(request, response);
    }
}
```
