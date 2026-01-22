package sme.erp.erp_hr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sme.erp.erp_hr.model.Employee;
import sme.erp.erp_hr.model.EmployeeStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // -------- Uniqueness checks --------
    boolean existsByEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);

    // -------- Basic lookups --------
    Optional<Employee> findByEmployeeCode(String employeeCode);

    // -------- Lifecycle queries --------
    List<Employee> findByStatus(EmployeeStatus status);
    long countByStatus(EmployeeStatus status);

    // -------- Department based --------
    List<Employee> findByDepartmentAndStatus(String department, EmployeeStatus status);
}
