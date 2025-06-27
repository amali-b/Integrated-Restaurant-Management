package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.IngredientCategory;

public interface IngredientCategoryDao extends JpaRepository<IngredientCategory, Integer> {

}
