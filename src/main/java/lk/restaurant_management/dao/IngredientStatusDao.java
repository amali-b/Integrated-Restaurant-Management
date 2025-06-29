package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.IngredientStatus;

public interface IngredientStatusDao extends JpaRepository<IngredientStatus, Integer> {

}
