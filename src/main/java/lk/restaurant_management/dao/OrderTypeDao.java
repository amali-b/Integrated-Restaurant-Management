package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.OrderType;

public interface OrderTypeDao extends JpaRepository<OrderType, Integer> {

}
