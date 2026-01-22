package sme.erp.erp_hr.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sme.erp.erp_hr.model.Department;
import sme.erp.erp_hr.repository.DepartmentRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // ---------- READ ----------

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Department> getActiveDepartments() {
        return departmentRepository.findByActiveTrue();
    }

    public Optional<Department> getByCode(String code) {
        return departmentRepository.findByCode(code);
    }

    // ---------- CREATE ----------

    public Department createDepartment(String code, String name) {

        if (departmentRepository.existsByCode(code)) {
            throw new IllegalArgumentException("Department code already exists");
        }

        if (departmentRepository.existsByName(name)) {
            throw new IllegalArgumentException("Department name already exists");
        }

        Department department = new Department(code, name);
        return departmentRepository.save(department);
    }

    // ---------- UPDATE (NAME ONLY) ----------

    public Optional<Department> updateDepartmentName(Long id, String name) {
        return departmentRepository.findById(id).map(existing -> {

            if (!existing.getName().equalsIgnoreCase(name)
                    && departmentRepository.existsByName(name)) {
                throw new IllegalArgumentException("Department name already exists");
            }

            existing.setName(name);
            return existing; // JPA dirty checking
        });
    }

    // ---------- LIFECYCLE ----------

    public Optional<Department> activateDepartment(Long id) {
        return departmentRepository.findById(id).map(dept -> {
            dept.setActive(true);
            return dept;
        });
    }

    public Optional<Department> deactivateDepartment(Long id) {
        return departmentRepository.findById(id).map(dept -> {
            dept.setActive(false);
            return dept;
        });
    }

    // ---------- NO DELETE ----------

    /**
     * Departments are NEVER deleted in ERP.
     * Historical consistency must be preserved.
     */
}
