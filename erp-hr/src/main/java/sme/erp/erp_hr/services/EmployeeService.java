package sme.erp.erp_hr.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sme.erp.erp_hr.model.Department;
import sme.erp.erp_hr.model.Employee;
import sme.erp.erp_hr.model.EmployeeStatus;
import sme.erp.erp_hr.repository.EmployeeRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentService departmentService;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            DepartmentService departmentService
    ) {
        this.employeeRepository = employeeRepository;
        this.departmentService = departmentService;
    }

    // ---------- READ ----------

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Optional<Employee> getByEmployeeCode(String employeeCode) {
        return employeeRepository.findByEmployeeCode(employeeCode);
    }

    // ---------- CREATE ----------

    public Employee createEmployee(
            String name,
            String email,
            String department,
            String designation,
            LocalDate joiningDate
    ) {
        if (employeeRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Employee with this email already exists");
        }

        Department dept = departmentService.getByCode(department)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid department code")
                );

        if (!dept.isActive()) {
            throw new IllegalStateException(
                    "Cannot create employee under inactive department"
            );
        }

        String employeeCode = generateEmployeeCode();

        Employee employee = new Employee(
                employeeCode,
                name,
                email,
                department,
                designation,
                joiningDate
        );

        return employeeRepository.save(employee);
    }

    // ---------- UPDATE (Non-lifecycle) ----------

    public Optional<Employee> updateEmployeeDetails(
            Long id,
            String name,
            String department,
            String designation
    ) {
        return employeeRepository.findById(id).map(existing -> {
            existing.setName(name);
            existing.setDepartment(department);
            existing.setDesignation(designation);
            return existing;
        });
    }

    // ---------- LIFECYCLE MANAGEMENT ----------

    public Optional<Employee> changeStatus(Long id, EmployeeStatus newStatus) {
        return employeeRepository.findById(id).map(employee -> {

            if (!isValidTransition(employee.getStatus(), newStatus)) {
                throw new IllegalStateException(
                        "Invalid status transition from " +
                                employee.getStatus() + " to " + newStatus
                );
            }

            employee.setStatus(newStatus);
            return employee;
        });
    }

    // ---------- KPI SUPPORT ----------

    public long countActiveEmployees() {
        return employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
    }

    public long countEmployeesByStatus(EmployeeStatus status) {
        return employeeRepository.countByStatus(status);
    }

    // ---------- HELPERS ----------

    private String generateEmployeeCode() {
        long count = employeeRepository.count();
        return "EMP-" + String.format("%04d", count + 1);
    }

    private boolean isValidTransition(EmployeeStatus from, EmployeeStatus to) {

        if (from == EmployeeStatus.TERMINATED || from == EmployeeStatus.RESIGNED) {
            return false;
        }

        if (from == EmployeeStatus.ACTIVE && to == EmployeeStatus.ON_LEAVE) {
            return true;
        }

        if (from == EmployeeStatus.ON_LEAVE && to == EmployeeStatus.ACTIVE) {
            return true;
        }

        return to == EmployeeStatus.RESIGNED || to == EmployeeStatus.TERMINATED;
    }
}
