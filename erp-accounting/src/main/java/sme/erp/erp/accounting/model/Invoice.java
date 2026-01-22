package sme.erp.erp.accounting.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "invoices",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_invoice_sales_order",
            columnNames = "sales_order_id"
        ),
        @UniqueConstraint(
            name = "uk_invoice_number",
            columnNames = "invoice_number"
        )
    }
)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, length = 50)
    private String invoiceNumber;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private InvoiceStatus status;

    /**
     * 🔗 ERP LINK
     * Sales Order → Accounting Invoice
     */
    @Column(name = "sales_order_id", nullable = false, updatable = false)
    private Long salesOrderId;

    /**
     * ERP AUDIT
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * ERP BUSINESS DATE
     */
    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    /**
     * ERP PAYMENT TERMS
     */
    @Column(name = "due_date")
    private LocalDate dueDate;

    /**
     * ERP CASH EVENT
     */
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // ===============================
    // LIFECYCLE
    // ===============================

    @PrePersist
    protected void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = InvoiceStatus.DRAFT;
        }

        if (this.totalAmount == null) {
            this.totalAmount = 0.0;
        }
    }

    // ===============================
    // ERP STATE TRANSITIONS
    // ===============================

    /**
     * ERP RULE:
     * Issue invoice → calculate due date
     * Default payment terms = 30 days
     */
    public void markIssued() {

        if (this.status != InvoiceStatus.DRAFT) {
            throw new IllegalStateException(
                "Only DRAFT invoices can be issued"
            );
        }

        this.status = InvoiceStatus.ISSUED;
        this.issuedAt = LocalDateTime.now();
        this.dueDate = LocalDate.now().plusDays(30);
    }

    /**
     * ERP RULE:
     * Mark invoice as paid
     */
    public void markPaid() {

        if (this.status != InvoiceStatus.ISSUED) {
            throw new IllegalStateException(
                "Only ISSUED invoices can be paid"
            );
        }

        this.status = InvoiceStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    /**
     * ERP QUERY HELPER
     */
    public boolean isOverdue() {
        return status == InvoiceStatus.ISSUED
            && dueDate != null
            && dueDate.isBefore(LocalDate.now());
    }

    // ===============================
    // GETTERS / SETTERS
    // ===============================

    public Long getId() {
        return id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public InvoiceStatus getStatus() {
        return status;
    }

    /**
     * 🚫 ERP SAFETY
     * Status must NOT be set directly.
     * Use markIssued() or markPaid().
     */
    protected void setStatus(InvoiceStatus status) {
        this.status = status;
    }

    public Long getSalesOrderId() {
        return salesOrderId;
    }

    public void setSalesOrderId(Long salesOrderId) {
        this.salesOrderId = salesOrderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }
}
