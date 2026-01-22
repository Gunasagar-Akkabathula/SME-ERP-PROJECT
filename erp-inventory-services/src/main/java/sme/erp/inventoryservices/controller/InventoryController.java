package sme.erp.inventoryservices.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import sme.erp.inventoryservices.model.InventoryItem;
import sme.erp.inventoryservices.services.InventoryService;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // ---------------- HEALTH ----------------
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("inventory service is working");
    }

    // ---------------- GET ALL ACTIVE ITEMS ----------------
    @GetMapping("/items")
    public ResponseEntity<List<InventoryItem>> items() {
        return ResponseEntity.ok(
            inventoryService.getAllItems()
        );
    }

    // ---------------- GET ITEM BY ID ----------------
    @GetMapping("/items/{id}")
    public ResponseEntity<InventoryItem> getItemById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            inventoryService.getItemById(id)
        );
    }

    // ---------------- CREATE ITEM ----------------
    @PostMapping("/items")
    public ResponseEntity<InventoryItem> create(
            @RequestBody InventoryItem item) {

        InventoryItem created =
            inventoryService.createItem(item);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    // ---------------- UPDATE ITEM (NAME ONLY) ----------------
    @PutMapping("/items/{id}")
    public ResponseEntity<InventoryItem> updateItem(
            @PathVariable Long id,
            @RequestBody InventoryItem updated) {

        return ResponseEntity.ok(
            inventoryService.updateItem(id, updated)
        );
    }

    // ---------------- ADJUST STOCK (+ / -) ----------------
    @PostMapping("/items/{id}/adjust")
    public ResponseEntity<?> adjustStock(
            @PathVariable Long id,
            @RequestParam int quantity) {

        if (quantity == 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Quantity must not be zero");
        }

        try {
            return ResponseEntity.ok(
                inventoryService.adjustStock(id, quantity)
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());
        }
    }

    // ---------------- DEDUCT STOCK (USED BY SALES CONFIRM) ----------------
    @PostMapping("/items/{id}/deduct")
    public ResponseEntity<?> deductStock(
            @PathVariable Long id,
            @RequestParam int quantity) {

        if (quantity <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Deduction quantity must be greater than zero");
        }

        try {
            InventoryItem updated =
                    inventoryService.deductStock(id, quantity);

            return ResponseEntity.ok(updated);

        } catch (IllegalStateException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());

        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());
        }
    }

    // ---------------- DISABLE ITEM (ERP SOFT DELETE) ----------------
    @DeleteMapping("/items/{id}")
    public ResponseEntity<String> disableItem(
            @PathVariable Long id) {

        inventoryService.disableItem(id);
        return ResponseEntity.ok("Inventory item disabled");
    }
}
