package sme.erp.erp.sales.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sme.erp.erp.sales.services.OrderService;

@RestController
@RequestMapping("/sales/kpi")
public class SalesKpiController {

    private final OrderService orderService;

    public SalesKpiController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * KPI: Pending Sales Orders
     * Status = DRAFT
     */
    @GetMapping("/pending-orders")
    public ResponseEntity<Long> getPendingOrdersCount() {
        return ResponseEntity.ok(orderService.countPendingOrders());
    }

    /**
     * KPI: Today's Sales Value
     * Status = CONFIRMED
     * Date = Today (orderDate)
     */
    @GetMapping("/today-sales")
    public ResponseEntity<BigDecimal> getTodaySalesValue() {
        return ResponseEntity.ok(orderService.getTodaySalesTotal());
    }
}
