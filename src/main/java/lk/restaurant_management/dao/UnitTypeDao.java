package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.UnitType;

public interface UnitTypeDao extends JpaRepository<UnitType, Integer> {

}
