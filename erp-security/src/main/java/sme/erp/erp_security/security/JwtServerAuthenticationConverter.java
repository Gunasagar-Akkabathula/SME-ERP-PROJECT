package sme.erp.erp_security.security;

/**
 * This class was previously used for WebFlux (ServerAuthenticationConverter).
 * 
 * Since the ERP Security service is now Spring MVC based,
 * JWT processing is handled by JwtAuthenticationManager (OncePerRequestFilter).
 *
 * This class is intentionally left as a NO-OP placeholder
 * to preserve project structure and avoid breaking references.
 */
@Deprecated
public final class JwtServerAuthenticationConverter {
    // NO-OP (not used in Spring MVC security)
}
