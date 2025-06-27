package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.InventoryStatusDao;
import lk.restaurant_management.entity.InventoryStatus;

@RestController
// controller eke thyena implementation
public class InventoryStatusController {

    @Autowired
    private InventoryStatusDao inventoryStatusDao;

    // define mapping get all customer status data
    @GetMapping(value = "/inventorystatus/alldata", produces = "application/json")
    public List<InventoryStatus> getAllInventoryStatuses() {
        return inventoryStatusDao.findAll();
    }
}