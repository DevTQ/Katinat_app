package com.project.Kat.configurations;

import com.project.Kat.filters.JwtTokenFilter;
import com.project.Kat.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;

    @Value("${api.prefix}")
    private String apiPrefix;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests -> {
                    requests
                            .requestMatchers(
                                    String.format("%s/users/register", apiPrefix),
                                    String.format("%s/users/login", apiPrefix),
                                    String.format("%s/users/check-phone", apiPrefix),
                                    String.format("%s/uploads/image", apiPrefix),
                                    String.format("%s/payments/payment-callback", apiPrefix),
                                    String.format("%s/payments/payment-success", apiPrefix),
                                    String.format("%s/payments/payment-failed", apiPrefix),
                                    String.format("%s/auth/admin/login", apiPrefix),
                                    String.format("%s/auth/store/login", apiPrefix)
                            ).permitAll()
                            // Websocket
                            .requestMatchers(GET, String.format("%s/myWebSocket", apiPrefix))
                            .permitAll()
                            .requestMatchers("/ws-order-status/**").permitAll()
                            .requestMatchers(apiPrefix + "/ws-order-status/**").permitAll()

                            // Forgot password
                            .requestMatchers(POST, String.format("%s/forgot/**", apiPrefix)).permitAll()

                            .requestMatchers(GET, String.format("%s/notification/**", apiPrefix)).permitAll()

                            // Categories
                            .requestMatchers(GET, String.format("%s/categories/**", apiPrefix)).permitAll()
                            .requestMatchers(POST, String.format("%s/categories/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)
                            .requestMatchers(PUT, String.format("%s/categories/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)
                            .requestMatchers(DELETE, String.format("%s/categories/**", apiPrefix))
                            .hasRole(Role.ADMIN)

                            // Products
                            .requestMatchers(GET, String.format("%s/products/**", apiPrefix))
                            .permitAll()
                            .requestMatchers(POST, String.format("%s/products/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)
                            .requestMatchers(PUT, String.format("%s/products/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER, Role.STAFF)
                            .requestMatchers(DELETE, String.format("%s/products/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)

                            // Orders
                            .requestMatchers(POST, String.format("%s/orders/**", apiPrefix))
                            .hasAnyRole(Role.USER, Role.ADMIN, Role.MANAGER, Role.STAFF)
                            .requestMatchers(GET, String.format("%s/orders/**", apiPrefix)).permitAll()
                            .requestMatchers(PUT, String.format("%s/orders/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.USER)
                            .requestMatchers(DELETE, String.format("%s/orders/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)

                            // Order Details
                            .requestMatchers(POST, String.format("%s/order_details/**", apiPrefix))
                            .hasAnyRole(Role.USER, Role.STAFF)
                            .requestMatchers(GET, String.format("%s/order_details/**", apiPrefix))
                            .hasAnyRole(Role.USER, Role.ADMIN, Role.MANAGER, Role.STAFF)
                            .requestMatchers(PUT, String.format("%s/order_details/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER, Role.STAFF)
                            .requestMatchers(DELETE, String.format("%s/order_details/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)

                            // Stores
                            .requestMatchers(POST, String.format("%s/stores/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)
                            .requestMatchers(GET, String.format("%s/stores/**", apiPrefix)).permitAll()

                            // Vouchers
                            .requestMatchers(POST, String.format("%s/vouchers/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)
                            .requestMatchers(GET, String.format("%s/vouchers/**", apiPrefix)).permitAll()
                            
                            // Admin APIs
                            .requestMatchers(GET, String.format("%s/admin/staff/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)
                            .requestMatchers(POST, String.format("%s/admin/staff/**", apiPrefix))
                            .hasRole(Role.ADMIN) // chỉ ADMIN được tạo
                            .requestMatchers(PUT, String.format("%s/admin/staff/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER)
                            .requestMatchers(DELETE, String.format("%s/admin/staff/**", apiPrefix))
                            .hasRole(Role.ADMIN) // chỉ ADMIN được xóa
                            
                            // Staff APIs
                            .requestMatchers(String.format("%s/staff/**", apiPrefix))
                            .hasAnyRole(Role.ADMIN, Role.MANAGER, Role.STAFF)
                            
                            // VNPay
                            .requestMatchers(GET, String.format("%s/payments/payment-callback", apiPrefix)).permitAll()
                            // Bắt buộc xác thực cho các request khác
                            .anyRequest().authenticated();
                })
                .csrf(AbstractHttpConfigurer::disable);

        // Cấu hình CORS
        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList(
                        "authorization", "content-type", "x-auth-token", "Accept", "Origin", "Access-Control-Allow-Origin"
                ));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                httpSecurityCorsConfigurer.configurationSource(source);
            }
        });

        return http.build();
    }
}