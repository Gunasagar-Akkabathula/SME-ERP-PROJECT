package sme_erp.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthenticationFilter
        extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String INTERNAL_TOKEN = "INTERNAL_SERVICE_CALL";

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().value();
            HttpMethod method = request.getMethod();
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            // --------------------------------------------------
            // ✅ 0️⃣ ALLOW CORS PREFLIGHT
            // --------------------------------------------------
            if (method == HttpMethod.OPTIONS) {
                return chain.filter(exchange);
            }

            // --------------------------------------------------
            // ✅ 1️⃣ AUTH SERVICE → NO JWT
            // --------------------------------------------------
            if (path.startsWith("/auth/")) {
                return chain.filter(exchange);
            }

            // --------------------------------------------------
            // ✅ 2️⃣ HR ADMIN KPI (READ-ONLY)
            // --------------------------------------------------
            if (path.equals("/hr/admin/kpis")) {
                return chain.filter(exchange);
            }

            // --------------------------------------------------
            // 3️⃣ INTERNAL ERP SERVICE CALL
            // --------------------------------------------------
            if (authHeader != null
                    && authHeader.equals(BEARER_PREFIX + INTERNAL_TOKEN)) {
                return chain.filter(exchange);
            }

            // --------------------------------------------------
            // 4️⃣ NORMAL USER JWT VALIDATION
            // --------------------------------------------------
            if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
                return unauthorized(exchange, "Missing or invalid Authorization header");
            }

            String token = authHeader.substring(BEARER_PREFIX.length());

            Claims claims;
            try {
                claims = jwtUtil.validateAndGetClaims(token);
            } catch (JwtException ex) {
                return unauthorized(exchange, "Invalid or expired token");
            }

            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Name", claims.getSubject())
                    .build();

            return chain.filter(
                    exchange.mutate().request(mutatedRequest).build()
            );
        };
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body =
                "{\"error\":\"unauthorized\",\"message\":\""
                        + message.replace("\"", "'") + "\"}";

        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);

        return exchange.getResponse()
                .writeWith(Mono.just(
                        exchange.getResponse().bufferFactory().wrap(bytes)
                ));
    }

    public static class Config {}
}
