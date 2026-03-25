package com.tracker.Config;

import com.tracker.Service.CustomUserDetailsService; // Проверь, что сервис называется так
import com.tracker.Utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService; // Твой сервис для загрузки юзеров

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Извлекаем заголовок Authorization
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // 2. Проверяем, что заголовок есть и начинается с "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtils.getEmailFromToken(token);
            } catch (Exception e) {
                // Если токен поддельный или протух — просто идем дальше, 
                // SecurityContext останется пустым, и Spring выдаст 403 сам.
                logger.error("Could not extract email from token", e);
            }
        }

        // 3. Если email есть, а пользователь в системе еще не авторизован
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // 4. Если всё ок, создаем объект "паспорт" (Authentication)
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, 
                    null, 
                    userDetails.getAuthorities()
            );

            // Привязываем детали запроса (IP, сессия) к аутентификации
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 5. КЛАДЕМ В КОНТЕКСТ. Теперь Spring "знает" пользователя до конца этого запроса.
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // 6. Передаем запрос дальше по цепочке фильтров (в контроллер)
        filterChain.doFilter(request, response);
    }
}