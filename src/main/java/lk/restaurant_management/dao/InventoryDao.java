package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.Inventory;

public interface InventoryDao extends JpaRepository<Inventory, Integer> {

}
