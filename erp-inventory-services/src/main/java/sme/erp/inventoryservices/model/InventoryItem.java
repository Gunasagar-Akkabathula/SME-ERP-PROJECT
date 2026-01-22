package sme.erp.inventoryservices.model;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String sku;

    @Column(nullable = false, length = 255)
    private String name;

    /**
     * ERP RULE:
     * Quantity must NEVER be null.
     * Zero stock = 0, not null.
     */
    @Column(nullable = false)
    private Integer quantity;

    /**
     * ERP RULE:
     * Reorder level defines when stock is considered LOW
     */
    @Column(nullable = false)
    private Integer reorderLevel;

    /**
     * ERP SOFT DELETE FLAG
     * true  = active / usable
     * false = disabled (cannot be sold)
     */
    @Column(nullable = false)
    private boolean active = true;

    // ---------- CONSTRUCTORS ----------

    public InventoryItem() {}

    public InventoryItem(String sku, String name, Integer quantity, Integer reorderLevel) {
        this.sku = sku;
        this.name = name;
        this.quantity = quantity != null ? quantity : 0;
        this.reorderLevel = reorderLevel != null ? reorderLevel : 0;
        this.active = true;
    }

    // ---------- ERP SAFETY HOOKS ----------

    @PrePersist
    @PreUpdate
    private void ensureDefaults() {

        // Quantity must never be null in ERP
        if (this.quantity == null) {
            this.quantity = 0;
        }

        // Reorder level must never be null
        if (this.reorderLevel == null) {
            this.reorderLevel = 0;
        }
    }

    // ---------- GETTERS / SETTERS ----------

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity != null ? quantity : 0;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel != null ? reorderLevel : 0;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
