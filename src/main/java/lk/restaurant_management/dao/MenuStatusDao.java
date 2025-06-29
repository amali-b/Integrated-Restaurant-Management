package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.MenuStatus;

public interface MenuStatusDao extends JpaRepository<MenuStatus, Integer> {

}
