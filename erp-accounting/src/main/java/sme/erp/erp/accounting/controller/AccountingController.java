package sme.erp.erp.accounting.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import sme.erp.erp.accounting.model.Invoice;
import sme.erp.erp.accounting.model.Payment;
import sme.erp.erp.accounting.services.AccountingService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounting")
public class AccountingController {

    private final AccountingService accountingService;

    public AccountingController(AccountingService accountingService) {
        this.accountingService = accountingService;
    }

    /* ---------- HEALTH ---------- */

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("accounting service is up");
    }

    /* =================================================
       INTERNAL ERP (SALES → ACCOUNTING)
       ================================================= */

    @PostMapping("/internal/invoice-from-sales")
    public ResponseEntity<Void> createInvoiceFromSales(
            @RequestParam Long salesOrderId,
            @RequestParam String customerName,
            @RequestParam Double totalAmount) {

        if (salesOrderId == null || salesOrderId <= 0)
            return ResponseEntity.badRequest().build();

        if (customerName == null || customerName.isBlank())
            return ResponseEntity.badRequest().build();

        if (totalAmount == null || totalAmount <= 0)
            return ResponseEntity.badRequest().build();

        try {
            accountingService.createInvoiceFromSales(
                salesOrderId,
                customerName,
                totalAmount
            );
        } catch (IllegalStateException ex) {
            // ✅ ERP SAFE:
            // Invoice already exists or already issued → IGNORE
            System.out.println(
                "Invoice already processed for salesOrderId=" + salesOrderId
            );
        } catch (Exception ex) {
            // ❌ Only real system failures reach here
            System.err.println(
                "Accounting invoice creation failed: " + ex.getMessage()
            );
        }

        // ✅ ALWAYS return OK to Sales
        return ResponseEntity.ok().build();
    }

    /* =================================================
       INVOICES (UI / ACCOUNTANT)
       ================================================= */

    @PostMapping("/invoices")
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return ResponseEntity.ok(accountingService.createInvoice(invoice));
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> getInvoices() {
        return ResponseEntity.ok(accountingService.getInvoices());
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(accountingService.getInvoice(id));
    }

    @PutMapping("/invoices/{id}")
    public ResponseEntity<Invoice> updateInvoice(
            @PathVariable Long id,
            @RequestBody Invoice invoice) {
        return ResponseEntity.ok(accountingService.updateInvoice(id, invoice));
    }

    /**
     * DRAFT → ISSUED
     */
    @PostMapping("/invoices/{id}/issue")
    public ResponseEntity<Invoice> issueInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(accountingService.issueInvoice(id));
    }

    /* =================================================
       PAYMENTS
       ================================================= */

    @PostMapping("/invoices/{id}/payments")
    public ResponseEntity<?> addPayment(
            @PathVariable Long id,
            @RequestBody Map<String, Double> body) {

        Double amount = body.get("amount");
        if (amount == null || amount <= 0)
            return ResponseEntity.badRequest().body("Payment amount must be > 0");

        Payment payment = new Payment();
        payment.setAmount(amount);

        return ResponseEntity.ok(
            accountingService.addPayment(id, payment)
        );
    }

    @GetMapping("/invoices/{id}/payments")
    public ResponseEntity<List<Payment>> getPayments(@PathVariable Long id) {
        return ResponseEntity.ok(accountingService.getPayments(id));
    }
}
