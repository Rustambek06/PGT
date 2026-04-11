// package com.tracker.Config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// @Configuration
// @EnableWebSecurity
// @EnableMethodSecurity
// public class SecurityConfig {

//     private final JwtFilter jwtFilter;

//     public SecurityConfig(JwtFilter jwtFilter) {
//         this.jwtFilter = jwtFilter;
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             .cors(cors -> cors.configurationSource(request -> {
//                 var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
//                 corsConfiguration.setAllowedOrigins(java.util.List.of("http://localhost:3000")); // Разрешаем React
//                 corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//                 corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
//                 return corsConfiguration;
//             }))
//             .csrf(csrf -> csrf.disable()) 
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/auth/**").permitAll() 
//                 .requestMatchers("/api/users").hasRole("ADMIN")
//                 .anyRequest().authenticated()           
//             )
//             .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {
//         CorsConfiguration configuration = new CorsConfiguration();
//         configuration.addAllowedOrigin("*");
//         configuration.addAllowedMethod("*");
//         configuration.addAllowedHeader("*");

//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", configuration);
//         return source;
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
// }

package com.tracker.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Позволяет использовать @PreAuthorize
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Включаем CORS и используем наш бин конфигурации
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Отключаем CSRF (для REST API с JWT это норма)
            .csrf(csrf -> csrf.disable()) 
            
            // 3. Настраиваем правила доступа
            .authorizeHttpRequests(auth -> auth
                // Разрешаем все OPTIONS запросы (Preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Разрешаем вход и регистрацию
                .requestMatchers("/auth/**").permitAll() 
                // Админка
                .requestMatchers("/api/users").hasRole("ADMIN")
                // Все остальное — только по токену
                .anyRequest().authenticated()           
            )
            
            // 4. Добавляем наш JWT фильтр перед стандартным
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ВАЖНО: Укажите точный адрес вашего фронтенда на Vercel
        configuration.setAllowedOrigins(List.of("https://pgtracker.vercel.app", "http://localhost:3000"));
        
        // Разрешаем стандартные методы
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Разрешаем заголовки, необходимые для JWT
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        
        // Разрешаем браузеру принимать ответ от сервера (важно для CORS через HTTPS)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}