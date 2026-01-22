package sme.erp.erp.sales.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(
    name = "sales_orders",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_sales_orders_order_number",
            columnNames = "order_number"
        )
    }
)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private OrderStatus status = OrderStatus.DRAFT;

    // --- Inventory linkage ---
    @Column(name = "inventory_item_id", nullable = false)
    private Long inventoryItemId;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    // --- Pricing (ERP REQUIRED) ---
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    /**
     * ERP REPORTING DATE
     * Used for KPIs & reports (DATE only)
     */
    @Column(name = "order_date", nullable = false, updatable = false)
    private LocalDate orderDate;

    /**
     * ERP AUDIT TIMESTAMP
     * Used for logging & traceability
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Order() {}

    public Order(String orderNumber,
                 String customerName,
                 Long inventoryItemId,
                 int quantity,
                 Double unitPrice) {

        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.inventoryItemId = inventoryItemId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = quantity * unitPrice;
        this.status = OrderStatus.DRAFT;
        this.orderDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }

    /* ---------- LIFECYCLE ---------- */

    @PrePersist
    protected void onCreate() {

        if (this.unitPrice == null || this.quantity <= 0) {
            throw new IllegalStateException(
                "Cannot create order with invalid pricing or quantity"
            );
        }

        this.totalAmount = this.unitPrice * this.quantity;

        // ERP standard
        this.orderDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        // DO NOT recalculate totalAmount here
        // Pricing must remain frozen after creation
    }

    /* ---------- GETTERS / SETTERS ---------- */

    public Long getId() {
        return id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Long getInventoryItemId() {
        return inventoryItemId;
    }

    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
    }

    public int getQuantity() {
        return quantity;
    }

    /**
     * Quantity can change ONLY in DRAFT state
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    /**
     * Unit price can change ONLY in DRAFT state
     */
    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /* ---------- ERP STATUS ---------- */

    public enum OrderStatus {
        DRAFT,
        CONFIRMED,
        INVOICED,
        CANCELLED
    }
}
