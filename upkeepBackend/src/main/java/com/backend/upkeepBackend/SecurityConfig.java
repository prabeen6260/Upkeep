package com.backend.upkeepBackend; // Use your own package name


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * This bean defines your main security filter chain.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS using the "corsConfigurationSource" bean defined below
            .cors(Customizer.withDefaults())
            
            // 2. Define authorization rules
            .authorizeHttpRequests(authorize -> authorize
                // All requests to /api/** must be authenticated
                .requestMatchers("/api/**").authenticated() 
                // Any other request (like / or /public) can be permitted
                .anyRequest().permitAll() 
            )
            
            // 3. Configure OAuth2 Resource Server to validate JWTs
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            ); 
        
        return http.build();
    }

    /**
     * This bean defines the global CORS configuration.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // --- IMPORTANT ---
        // Set this to your React app's URL. 
        // 3000 is common for create-react-app, 5173 for Vite.
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        
        // Define which HTTP methods are allowed
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Define which headers are allowed
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        
        // Allow credentials (like cookies and auth tokens)
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", configuration); 
        
        return source;
    }
}