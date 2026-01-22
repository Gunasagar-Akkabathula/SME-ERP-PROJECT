package sme.erp.erp.sales.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import sme.erp.erp.sales.model.Order;
import sme.erp.erp.sales.model.Order.OrderStatus;
import sme.erp.erp.sales.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final WebClient webClient;
    private final HttpServletRequest request;

    public OrderService(OrderRepository orderRepository,
                        HttpServletRequest request) {

        this.orderRepository = orderRepository;
        this.request = request;

        // API Gateway base URL
        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:8080")
                .build();
    }

    // ===================== READ =====================

    @Transactional(readOnly = true)
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Order getById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException("Order not found: " + id)
            );
    }

    // ===================== CREATE =====================

    @Transactional
    public Order create(Order order) {

        if (order.getOrderNumber() == null || order.getOrderNumber().isBlank())
            throw new IllegalArgumentException("orderNumber is required");

        if (order.getCustomerName() == null || order.getCustomerName().isBlank())
            throw new IllegalArgumentException("customerName is required");

        if (order.getInventoryItemId() == null)
            throw new IllegalArgumentException("inventoryItemId is required");

        if (order.getQuantity() <= 0)
            throw new IllegalArgumentException("quantity must be greater than zero");

        if (order.getUnitPrice() == null || order.getUnitPrice() <= 0)
            throw new IllegalArgumentException("unitPrice must be greater than zero");

        order.setStatus(OrderStatus.DRAFT);
        return orderRepository.save(order);
    }

    // ===================== UPDATE =====================

    @Transactional
    public Order update(Long id, Order updated) {

        Order existing = getById(id);

        if (existing.getStatus() != OrderStatus.DRAFT)
            throw new IllegalStateException("Only DRAFT orders can be updated");

        if (updated.getOrderNumber() != null && !updated.getOrderNumber().isBlank())
            existing.setOrderNumber(updated.getOrderNumber());

        if (updated.getCustomerName() != null && !updated.getCustomerName().isBlank())
            existing.setCustomerName(updated.getCustomerName());

        return orderRepository.save(existing);
    }

    // ===================== CONFIRM (ERP FLOW) =====================

    /**
     * ERP Rule:
     * Order CONFIRM is allowed ONLY if:
     * 1. Inventory deduction succeeds
     * 2. Accounting invoice is successfully created
     */
    @Transactional
    public Order confirmOrder(Long id) {

        Order order = getById(id);

        if (order.getStatus() != OrderStatus.DRAFT)
            throw new IllegalStateException("Only DRAFT orders can be confirmed");

        if (order.getTotalAmount() == null || order.getTotalAmount() <= 0)
            throw new IllegalStateException("Order totalAmount is invalid");

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || authHeader.isBlank())
            throw new IllegalStateException("Missing Authorization header");

        // -------- INVENTORY DEDUCTION --------
        try {
            webClient.post()
                .uri(uriBuilder -> uriBuilder
                    .path("/inventory/items/{id}/deduct")
                    .queryParam("quantity", order.getQuantity())
                    .build(order.getInventoryItemId())
                )
                .header("Authorization", authHeader)
                .retrieve()
                .toBodilessEntity()
                .block();

        } catch (WebClientResponseException.Conflict ex) {
            throw new IllegalStateException("Inventory conflict: " + ex.getResponseBodyAsString());
        } catch (WebClientResponseException.NotFound ex) {
            throw new IllegalArgumentException("Inventory item not found");
        } catch (Exception ex) {
            throw new IllegalStateException("Inventory deduction failed", ex);
        }

        // -------- ACCOUNTING INVOICE (MANDATORY) --------
        try {
            webClient.post()
                .uri(uriBuilder -> uriBuilder
                    .path("/accounting/internal/invoice-from-sales")
                    .queryParam("salesOrderId", order.getId())
                    .queryParam("customerName", order.getCustomerName())
                    .queryParam("totalAmount", order.getTotalAmount())
                    .build()
                )
                .header("Authorization", authHeader)
                .retrieve()
                .toBodilessEntity()
                .block();

        } catch (WebClientResponseException ex) {
            throw new IllegalStateException(
                "Accounting invoice creation failed: " +
                ex.getStatusCode() + " - " + ex.getResponseBodyAsString()
            );
        } catch (Exception ex) {
            throw new IllegalStateException(
                "Accounting invoice creation failed", ex
            );
        }

        // -------- CONFIRM ORDER (ONLY AFTER ALL SUCCESS) --------
        order.setStatus(OrderStatus.CONFIRMED);
        return orderRepository.save(order);
    }

    // ===================== DELETE =====================

    @Transactional
    public void delete(Long id) {
        if (!orderRepository.existsById(id))
            throw new IllegalArgumentException("Order not found: " + id);

        orderRepository.deleteById(id);
    }

    // =================================================
    // KPI METHODS (ADMIN DASHBOARD)
    // =================================================

    /**
     * KPI: Pending Sales Orders (DRAFT)
     */
    @Transactional(readOnly = true)
    public long countPendingOrders() {
        return orderRepository.countByStatus(OrderStatus.DRAFT);
    }

    /**
     * KPI: Today's Sales Value (CONFIRMED)
     */
    @Transactional(readOnly = true)
    public BigDecimal getTodaySalesTotal() {
        return orderRepository.sumTotalAmountByStatusAndDate(
            OrderStatus.CONFIRMED,
            LocalDate.now()
        );
    }
}
