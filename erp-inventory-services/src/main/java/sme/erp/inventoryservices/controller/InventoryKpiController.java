package sme.erp.inventoryservices.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sme.erp.inventoryservices.services.InventoryService;

@RestController
@RequestMapping("/inventory/kpi")
public class InventoryKpiController {

    private final InventoryService inventoryService;

    public InventoryKpiController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * KPI: Low Stock Items
     * ERP rule:
     * active = true AND quantity <= reorderLevel
     */
    @GetMapping("/low-stock")
    public ResponseEntity<Long> getLowStockItemsCount() {
        return ResponseEntity.ok(inventoryService.countLowStockItems());
    }
}

