package sme.erp.erp.accounting.services;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sme.erp.erp.accounting.model.Invoice;
import sme.erp.erp.accounting.model.InvoiceStatus;
import sme.erp.erp.accounting.model.Payment;
import sme.erp.erp.accounting.repository.InvoiceRepository;
import sme.erp.erp.accounting.repository.PaymentRepository;

@Service
@Transactional
public class AccountingService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    public AccountingService(
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
    }

    /* =================================================
       SALES → ACCOUNTING (AUTO INVOICE)
       ================================================= */

    public Invoice createInvoiceFromSales(
            Long salesOrderId,
            String customerName,
            Double totalAmount) {

        if (salesOrderId == null)
            throw new IllegalArgumentException("salesOrderId is required");

        if (customerName == null || customerName.isBlank())
            throw new IllegalArgumentException("customerName is required");

        if (totalAmount == null || totalAmount <= 0)
            throw new IllegalArgumentException("totalAmount must be > 0");

        // ✅ Idempotent: one invoice per sales order
        return invoiceRepository.findBySalesOrderId(salesOrderId)
            .orElseGet(() -> {

                Invoice invoice = new Invoice();
                invoice.setSalesOrderId(salesOrderId);
                invoice.setCustomerName(customerName);
                invoice.setTotalAmount(totalAmount);
                invoice.setInvoiceNumber(
                    "INV-" + UUID.randomUUID().toString().substring(0, 8)
                );

                // 1️⃣ Save as DRAFT (entity default)
                invoiceRepository.save(invoice);

                // 2️⃣ ERP-correct transition
                invoice.markIssued();

                return invoiceRepository.save(invoice);
            });
    }

    /* =================================================
       MANUAL / UI CRUD
       ================================================= */

    public Invoice createInvoice(Invoice invoice) {
        // UI-created invoices remain DRAFT
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoice(Long id) {
        return invoiceRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException("Invoice not found: " + id)
            );
    }

    public Invoice updateInvoice(Long id, Invoice updated) {

        Invoice invoice = getInvoice(id);

        if (invoice.getStatus() != InvoiceStatus.DRAFT)
            throw new IllegalStateException("Only DRAFT invoices can be updated");

        if (updated.getCustomerName() != null)
            invoice.setCustomerName(updated.getCustomerName());

        if (updated.getTotalAmount() != null)
            invoice.setTotalAmount(updated.getTotalAmount());

        return invoiceRepository.save(invoice);
    }

    public Invoice issueInvoice(Long id) {

        Invoice invoice = getInvoice(id);
        invoice.markIssued();
        return invoiceRepository.save(invoice);
    }

    /* =================================================
       PAYMENTS
       ================================================= */

    public Payment addPayment(Long invoiceId, Payment payment) {

        Invoice invoice = getInvoice(invoiceId);

        if (invoice.getStatus() == InvoiceStatus.PAID)
            throw new IllegalStateException("Invoice already paid");

        payment.setInvoiceId(invoiceId);
        Payment saved = paymentRepository.save(payment);

        double paidSoFar = paymentRepository
            .findByInvoiceId(invoiceId)
            .stream()
            .mapToDouble(Payment::getAmount)
            .sum();

        if (paidSoFar >= invoice.getTotalAmount()) {
            invoice.markPaid();
            invoiceRepository.save(invoice);
        }

        return saved;
    }

    public List<Payment> getPayments(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId);
    }

    /* =================================================
       KPI – ADMIN DASHBOARD
       ================================================= */

    @Transactional(readOnly = true)
    public long countIssuedInvoices() {
        return invoiceRepository.countByStatus(InvoiceStatus.ISSUED);
    }

    @Transactional(readOnly = true)
    public long countPaidInvoices() {
        return invoiceRepository.countByStatus(InvoiceStatus.PAID);
    }

    @Transactional(readOnly = true)
    public long countOverdueInvoices() {
        return invoiceRepository.countOverdueInvoices();
    }

    @Transactional(readOnly = true)
    public double totalOutstandingAmount() {
        Double sum = invoiceRepository.sumOutstandingAmount();
        return sum == null ? 0.0 : sum;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getAgingBuckets() {

        Map<String, Long> buckets = new HashMap<>();
        LocalDate today = LocalDate.now();

        buckets.put(
            "0-30",
            invoiceRepository.countIssuedDueBetween(
                today.minusDays(30),
                today.minusDays(1)
            )
        );

        buckets.put(
            "31-60",
            invoiceRepository.countIssuedDueBetween(
                today.minusDays(60),
                today.minusDays(31)
            )
        );

        buckets.put(
            "60+",
            invoiceRepository.countIssuedDueBefore(
                today.minusDays(60)
            )
        );

        return buckets;
    }
}
