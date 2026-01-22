package sme.erp.erp.sales.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sme.erp.erp.sales.model.Order;
import sme.erp.erp.sales.model.Order.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    // =================================================
    // KPI QUERIES (ADMIN DASHBOARD)
    // =================================================

    /**
     * KPI: Pending Sales Orders
     */
    long countByStatus(OrderStatus status);

    /**
     * KPI: Today's Sales Value
     * ERP-correct: uses orderDate (DATE column)
     */
    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = :status
          AND o.orderDate = :date
    """)
    BigDecimal sumTotalAmountByStatusAndDate(
        @Param("status") OrderStatus status,
        @Param("date") LocalDate date
    );
}