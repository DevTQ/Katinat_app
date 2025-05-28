package com.project.Kat.filters;

import com.project.Kat.components.JwtTokenUtils;
import com.project.Kat.models.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    @Value("${api.prefix}")
    private String apiPrefix;
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        // Log để kiểm tra request
        System.out.println("Request URL: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod());

        try {
            if (isBypassToken(request)) {
                System.out.println("Bypassing token check for: " + request.getRequestURI());
                filterChain.doFilter(request, response); // Enable bypass
                return;
            }

            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            final String token = authHeader.substring(7);
            final String username = jwtTokenUtils.extractUsername(token);


            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User userDetails = (User) userDetailsService.loadUserByUsername(username);
                if (jwtTokenUtils.isTokenValid(token, userDetails)) {
                    System.out.println("Token: " + token);
                    System.out.println("Principal: " + (userDetails != null ? userDetails.getUsername() : "null"));
                    System.out.println("Token valid, setting authentication for user: " + userDetails.getFullName());
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.out.println("Error in JwtTokenFilter: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }

    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (path.startsWith("/ws-order-status") ||
                path.startsWith("/" + apiPrefix + "/ws-order-status")) {
            return true;
        }

        // Danh sách path cần bypass
        List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of("/api/v1/products", "GET"),
                Pair.of("/api/v1/categories", "GET"),
                Pair.of("/api/v1/users/login", "POST"),
                Pair.of("/api/v1/users/check-phone", "GET"),
                Pair.of("/api/v1/uploads/image", "POST"),
                Pair.of("/api/v1/stores", "GET"),
                Pair.of("/api/v1/stores", "POST"),
                Pair.of("/api/v1/payments/payment-callback", "GET"),
                Pair.of("/api/v1/payments/payment-success", "GET"),
                Pair.of("/api/v1/payments/payment-failed", "GET"),
                Pair.of("/api/v1/auth/admin/login", "POST"),
                Pair.of("/api/v1/auth/store/login", "POST"),
                Pair.of("/api/v1/forgot/forgot-password", "POST"),
                Pair.of("/api/v1/forgot/verify-otp", "POST"),
                Pair.of("/api/v1/forgot/reset-password", "POST")
        );

        for (Pair<String, String> bypass : bypassTokens) {
            if (path.equals(bypass.getFirst()) && method.equalsIgnoreCase(bypass.getSecond())) {
                return true;
            }
        }

        return false;
    }
}