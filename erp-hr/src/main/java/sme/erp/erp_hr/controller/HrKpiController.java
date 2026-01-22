package sme.erp.erp_hr.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sme.erp.erp_hr.model.EmployeeStatus;
import sme.erp.erp_hr.services.EmployeeService;

import java.util.Map;

@RestController
@RequestMapping("/hr/admin/kpis")
public class HrKpiController {

    private final EmployeeService employeeService;

    public HrKpiController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Long>> getHrKpis() {

        long active = employeeService.countEmployeesByStatus(EmployeeStatus.ACTIVE);
        long onLeave = employeeService.countEmployeesByStatus(EmployeeStatus.ON_LEAVE);
        long resigned = employeeService.countEmployeesByStatus(EmployeeStatus.RESIGNED);
        long terminated = employeeService.countEmployeesByStatus(EmployeeStatus.TERMINATED);

        long total = active + onLeave + resigned + terminated;

        return ResponseEntity.ok(
                Map.of(
                        "total", total,
                        "active", active,
                        "onLeave", onLeave,
                        "resigned", resigned,
                        "terminated", terminated
                )
        );
    }
}

