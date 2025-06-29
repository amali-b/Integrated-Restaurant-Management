package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.SupplyOrderStatus;

public interface SupplyOrderStatusDao extends JpaRepository<SupplyOrderStatus, Integer> {

}
