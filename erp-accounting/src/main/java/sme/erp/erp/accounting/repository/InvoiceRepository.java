package sme.erp.erp.accounting.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sme.erp.erp.accounting.model.Invoice;
import sme.erp.erp.accounting.model.InvoiceStatus;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    /* ===============================
       BASIC LOOKUPS
       =============================== */

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    boolean existsByInvoiceNumber(String invoiceNumber);

    Optional<Invoice> findBySalesOrderId(Long salesOrderId);

    /* ===============================
       KPI – COUNTS
       =============================== */

    long countByStatus(InvoiceStatus status);

    @Query("""
        SELECT COUNT(i)
        FROM Invoice i
        WHERE i.status = 'ISSUED'
          AND i.dueDate < CURRENT_DATE
    """)
    long countOverdueInvoices();

    /* ===============================
       KPI – OUTSTANDING AMOUNT
       =============================== */

    @Query("""
        SELECT COALESCE(SUM(i.totalAmount), 0)
        FROM Invoice i
        WHERE i.status = 'ISSUED'
    """)
    Double sumOutstandingAmount();

    /* ===============================
       KPI – AGING BUCKETS
       =============================== */

    @Query("""
        SELECT COUNT(i)
        FROM Invoice i
        WHERE i.status = 'ISSUED'
          AND i.dueDate BETWEEN :from AND :to
    """)
    long countIssuedDueBetween(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );

    @Query("""
        SELECT COUNT(i)
        FROM Invoice i
        WHERE i.status = 'ISSUED'
          AND i.dueDate < :before
    """)
    long countIssuedDueBefore(
        @Param("before") LocalDate before
    );
}
