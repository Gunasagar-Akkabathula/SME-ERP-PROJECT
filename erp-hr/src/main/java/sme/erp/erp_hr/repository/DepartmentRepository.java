package sme.erp.erp_hr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sme.erp.erp_hr.model.Department;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    // -------- Uniqueness checks --------
    boolean existsByCode(String code);
    boolean existsByName(String name);

    // -------- Lookups --------
    Optional<Department> findByCode(String code);

    // -------- Lifecycle --------
    List<Department> findByActiveTrue();
}

