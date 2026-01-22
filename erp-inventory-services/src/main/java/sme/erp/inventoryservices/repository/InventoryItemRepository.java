package sme.erp.inventoryservices.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import sme.erp.inventoryservices.model.InventoryItem;

public interface InventoryItemRepository
        extends JpaRepository<InventoryItem, Long> {

    // ---------- SKU LOOKUPS ----------
    Optional<InventoryItem> findBySku(String sku);

    boolean existsBySku(String sku);

    // ---------- ERP ACTIVE ITEMS ----------
    List<InventoryItem> findByActiveTrue();

    Optional<InventoryItem> findByIdAndActiveTrue(Long id);

    // =================================================
    // KPI QUERIES (ADMIN DASHBOARD)
    // =================================================

    /**
     * KPI: Low Stock Items
     * ERP rule:
     * active = true AND quantity <= reorderLevel
     */
    @Query("""
        SELECT COUNT(i)
        FROM InventoryItem i
        WHERE i.active = true
          AND i.quantity <= i.reorderLevel
    """)
    long countLowStockItems();
}
