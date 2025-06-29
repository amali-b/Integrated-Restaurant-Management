package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.InventoryStatus;

public interface InventoryStatusDao extends JpaRepository<InventoryStatus, Integer> {

}
