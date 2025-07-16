package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.KitchenStatus;

public interface KitchenStatusDao extends JpaRepository<KitchenStatus, Integer> {

}
