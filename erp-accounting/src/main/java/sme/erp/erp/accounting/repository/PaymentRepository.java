package sme.erp.erp.accounting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sme.erp.erp.accounting.model.Payment;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByInvoiceId(Long invoiceId);

    // =================================================
    // KPI QUERIES (ADMIN DASHBOARD)
    // =================================================

    /**
     * KPI: Total paid amount for an invoice
     * ERP-correct: database SUM aggregation
     */
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM Payment p
        WHERE p.invoiceId = :invoiceId
    """)
    double sumPaymentsByInvoiceId(@Param("invoiceId") Long invoiceId);

    /**
     * KPI: Total paid amount across all invoices
     * Used for Outstanding Amount calculation
     */
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM Payment p
    """)
    double sumAllPayments();
}
