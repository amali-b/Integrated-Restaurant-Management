package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.SeasonalDiscount;

public interface SeasonalDiscountDao extends JpaRepository<SeasonalDiscount, Integer> {

}
