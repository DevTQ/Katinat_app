package com.project.Kat.configurations.websocket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker

public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Value("${api.prefix}")
    private String apiPrefix;
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // endpoint có prefix
        registry.addEndpoint("/api/v1/ws-order-status")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        registry.addEndpoint("/ws-order-status")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // prefix cho server gửi message
        registry.enableSimpleBroker("/topic", "/queue");
        // prefix client gửi đến server
        registry.setApplicationDestinationPrefixes("/app");
        // prefix cho destination riêng từng user
        registry.setUserDestinationPrefix("/user");
    }
}
