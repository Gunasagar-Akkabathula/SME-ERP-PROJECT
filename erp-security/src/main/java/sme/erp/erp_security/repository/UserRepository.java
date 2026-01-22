package sme.erp.erp_security.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import sme.erp.erp_security.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
