package sme.erp.erp.sales.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import sme.erp.erp.sales.model.Order;
import sme.erp.erp.sales.services.OrderService;

@RestController
@RequestMapping("/sales")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // -------------------- HEALTH --------------------

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("sales service is up");
    }

    // -------------------- ORDERS --------------------

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    /**
     * Create sales order (ERP-correct)
     */
    @PostMapping("/orders")
    public ResponseEntity<?> create(@RequestBody Order order) {

        if (order.getUnitPrice() == null || order.getUnitPrice() <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("unitPrice must be greater than zero");
        }

        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(orderService.create(order));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());
        }
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<Order> update(
            @PathVariable Long id,
            @RequestBody Order order) {

        return ResponseEntity.ok(orderService.update(id, order));
    }

    /**
     * ERP action: Confirm sales order
     * DRAFT -> CONFIRMED
     */
    @PostMapping("/orders/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Long id) {

        try {
            Order confirmed = orderService.confirmOrder(id);
            return ResponseEntity.ok(confirmed);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());

        } catch (IllegalStateException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        }
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.ok("Deleted");
    }
}
