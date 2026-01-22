package sme.erp.erp.accounting.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sme.erp.erp.accounting.services.AccountingService;

@RestController
@RequestMapping("/accounting/kpi")
public class AccountingKpiController {

    private final AccountingService accountingService;

    public AccountingKpiController(AccountingService accountingService) {
        this.accountingService = accountingService;
    }

    @GetMapping("/issued-invoices")
    public ResponseEntity<Long> issuedInvoices() {
        return ResponseEntity.ok(accountingService.countIssuedInvoices());
    }

    @GetMapping("/paid-invoices")
    public ResponseEntity<Long> paidInvoices() {
        return ResponseEntity.ok(accountingService.countPaidInvoices());
    }

    @GetMapping("/overdue-invoices")
    public ResponseEntity<Long> overdueInvoices() {
        return ResponseEntity.ok(accountingService.countOverdueInvoices());
    }

    @GetMapping("/outstanding-amount")
    public ResponseEntity<Double> outstandingAmount() {
        return ResponseEntity.ok(accountingService.totalOutstandingAmount());
    }

    @GetMapping("/aging-buckets")
    public ResponseEntity<Map<String, Long>> agingBuckets() {
        return ResponseEntity.ok(accountingService.getAgingBuckets());
    }
}
