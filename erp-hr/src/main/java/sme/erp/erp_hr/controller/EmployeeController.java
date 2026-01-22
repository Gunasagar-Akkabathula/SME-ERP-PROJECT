package sme.erp.erp_hr.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sme.erp.erp_hr.model.Employee;
import sme.erp.erp_hr.model.EmployeeStatus;
import sme.erp.erp_hr.services.EmployeeService;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hr")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // ---------- Health ----------

    @GetMapping("/health")
    public String hrHealth() {
        return "HR service is working";
    }

    // ---------- READ ----------

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------- CREATE ----------

    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(
            @RequestBody CreateEmployeeRequest request
    ) {
        Employee created = employeeService.createEmployee(
                request.name(),
                request.email(),
                request.department(),
                request.designation(),
                request.joiningDate()
        );

        return ResponseEntity
                .created(URI.create("/hr/employees/" + created.getId()))
                .body(created);
    }

    // ---------- UPDATE (NON-LIFECYCLE) ----------

    @PutMapping("/employees/{id}")
    public ResponseEntity<Employee> updateEmployeeDetails(
            @PathVariable Long id,
            @RequestBody UpdateEmployeeRequest request
    ) {
        return employeeService.updateEmployeeDetails(
                        id,
                        request.name(),
                        request.department(),
                        request.designation()
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------- LIFECYCLE MANAGEMENT (UPDATED) ----------

    @PatchMapping("/employees/{id}/status")
    public ResponseEntity<Employee> changeEmployeeStatus(
            @PathVariable Long id,
            @RequestBody ChangeEmployeeStatusRequest request
    ) {
        return employeeService.changeStatus(id, request.status())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

/* ---------- REQUEST RECORDS (DTOs) ---------- */

record CreateEmployeeRequest(
        String name,
        String email,
        String department,
        String designation,
        LocalDate joiningDate
) {}

record UpdateEmployeeRequest(
        String name,
        String department,
        String designation
) {}

record ChangeEmployeeStatusRequest(
        EmployeeStatus status
) {}
