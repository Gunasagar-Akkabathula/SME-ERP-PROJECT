package sme.erp.inventoryservices.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
@EnableMethodSecurity
public class InventoryConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // ---------- STATELESS ----------
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // ---------- PREFLIGHT ----------
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ---------- PUBLIC ----------
                .requestMatchers("/", "/inventory/health").permitAll()

                // ---------- READ INVENTORY ----------
                // Sales must be able to VIEW inventory
                .requestMatchers(HttpMethod.GET, "/inventory/items/**")
                    .hasAnyRole("SALES", "INVENTORY", "ADMIN")

                // ---------- WRITE INVENTORY ----------
                // Only Inventory + Admin can modify stock
                .requestMatchers(HttpMethod.POST, "/inventory/**")
                    .hasAnyRole("INVENTORY", "ADMIN")

                .requestMatchers(HttpMethod.PUT, "/inventory/**")
                    .hasAnyRole("INVENTORY", "ADMIN")

                .requestMatchers(HttpMethod.DELETE, "/inventory/**")
                    .hasAnyRole("INVENTORY", "ADMIN")

                // ---------- FALLBACK ----------
                .anyRequest().authenticated()
            )

            // ---------- JWT ----------
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt ->
                    jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );

        return http.build();
    }

    /**
     * Converts JWT claim:
     * "roles": ["SALES","INVENTORY","ADMIN"]
     * to:
     * ROLE_SALES, ROLE_INVENTORY, ROLE_ADMIN
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(
                grantedAuthoritiesConverter
        );

        return converter;
    }

    /**
     * JWT Decoder
     * MUST match Security Service + Gateway
     */
    @Bean
    public JwtDecoder jwtDecoder(org.springframework.core.env.Environment env) {

        String secretBase64 = env.getProperty("jwt.secret");

        if (secretBase64 == null || secretBase64.isBlank()) {
            secretBase64 = env.getProperty("JWT_SECRET");
        }

        byte[] keyBytes = Base64.getDecoder().decode(secretBase64);
        SecretKey key = new SecretKeySpec(keyBytes, "HmacSHA256");

        return NimbusJwtDecoder.withSecretKey(key).build();
    }
}
