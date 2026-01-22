package sme.erp.inventoryservices.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sme.erp.inventoryservices.model.InventoryItem;
import sme.erp.inventoryservices.repository.InventoryItemRepository;

@Service
public class InventoryService {

    private final InventoryItemRepository repo;

    public InventoryService(InventoryItemRepository repo) {
        this.repo = repo;
    }

    // ---------------- READ ALL (ONLY ACTIVE) ----------------
    public List<InventoryItem> getAllItems() {
        return repo.findByActiveTrue();
    }

    // ---------------- READ BY ID ----------------
    public InventoryItem getItemById(Long itemId) {
        return repo.findById(itemId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Inventory item not found: " + itemId
                )
            );
    }

    // ---------------- CREATE ----------------
    @Transactional
    public InventoryItem createItem(InventoryItem item) {

        if (item.getSku() == null || item.getSku().isBlank()) {
            throw new IllegalArgumentException("SKU is required");
        }

        if (item.getName() == null || item.getName().isBlank()) {
            throw new IllegalArgumentException("Item name is required");
        }

        if (item.getQuantity() == null || item.getQuantity() < 0) {
            throw new IllegalArgumentException(
                "Quantity cannot be negative"
            );
        }

        item.setActive(true); // ERP default
        return repo.save(item);
    }

    // ---------------- UPDATE (NAME ONLY) ----------------
    @Transactional
    public InventoryItem updateItem(Long id, InventoryItem updated) {

        InventoryItem existing = getItemById(id);

        if (!existing.isActive()) {
            throw new IllegalStateException(
                "Cannot update a disabled item"
            );
        }

        // SKU must never change in ERP
        if (updated.getName() != null && !updated.getName().isBlank()) {
            existing.setName(updated.getName());
        }

        return repo.save(existing);
    }

    // ---------------- ADJUST STOCK (+ / -) ----------------
    @Transactional
    public InventoryItem adjustStock(Long id, int quantityDelta) {

        InventoryItem item = getItemById(id);

        if (!item.isActive()) {
            throw new IllegalStateException(
                "Cannot adjust stock for disabled item"
            );
        }

        int newQty = item.getQuantity() + quantityDelta;

        if (newQty < 0) {
            throw new IllegalStateException(
                "Stock adjustment would make quantity negative"
            );
        }

        item.setQuantity(newQty);
        return repo.save(item);
    }

    // ---------------- DEDUCT STOCK (USED BY SALES CONFIRM) ----------------
    @Transactional
    public InventoryItem deductStock(Long itemId, int quantity) {

        InventoryItem item = getItemById(itemId);

        if (!item.isActive()) {
            throw new IllegalStateException(
                "Inventory item is disabled"
            );
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                "Quantity must be greater than zero"
            );
        }

        if (item.getQuantity() < quantity) {
            throw new IllegalStateException(
                "Insufficient stock. Available: " +
                item.getQuantity() +
                ", Requested: " + quantity
            );
        }

        item.setQuantity(item.getQuantity() - quantity);
        return repo.save(item);
    }

    // ---------------- DISABLE ITEM (SOFT DELETE) ----------------
    @Transactional
    public void disableItem(Long id) {

        InventoryItem item = getItemById(id);

        if (item.getQuantity() > 0) {
            throw new IllegalStateException(
                "Cannot disable item with remaining stock"
            );
        }

        item.setActive(false);
        repo.save(item);
    }

    // =================================================
    // KPI METHODS (ADMIN DASHBOARD)
    // =================================================

    /**
     * KPI: Low Stock Items
     */
    @Transactional(readOnly = true)
    public long countLowStockItems() {
        return repo.countLowStockItems();
    }
}
