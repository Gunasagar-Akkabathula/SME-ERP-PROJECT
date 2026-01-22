package sme.erp.erp_hr.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sme.erp.erp_hr.model.Department;
import sme.erp.erp_hr.services.DepartmentService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/hr/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // ---------- READ (HR + ADMIN) ----------

    /**
     * List all departments (active + inactive)
     * Used by HR management screens
     */
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    /**
     * List only active departments
     * Used by dropdowns & assignments
     */
    @GetMapping("/active")
    public ResponseEntity<List<Department>> getActiveDepartments() {
        return ResponseEntity.ok(departmentService.getActiveDepartments());
    }

    /**
     * Get department by code
     */
    @GetMapping("/{code}")
    public ResponseEntity<Department> getByCode(@PathVariable String code) {
        return departmentService.getByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------- CREATE (HR ONLY) ----------

    @PostMapping
    public ResponseEntity<Department> createDepartment(
            @RequestBody CreateDepartmentRequest request
    ) {
        Department created = departmentService.createDepartment(
                request.code(),
                request.name()
        );

        return ResponseEntity
                .created(URI.create("/hr/departments/" + created.getCode()))
                .body(created);
    }

    // ---------- UPDATE (HR ONLY) ----------

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartmentName(
            @PathVariable Long id,
            @RequestBody UpdateDepartmentRequest request
    ) {
        return departmentService.updateDepartmentName(id, request.name())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------- LIFECYCLE (HR ONLY) ----------

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Department> activateDepartment(@PathVariable Long id) {
        return departmentService.activateDepartment(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Department> deactivateDepartment(@PathVariable Long id) {
        return departmentService.deactivateDepartment(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

/* ---------- REQUEST DTOs ---------- */

record CreateDepartmentRequest(
        String code,
        String name
) {}

record UpdateDepartmentRequest(
        String name
) {}

