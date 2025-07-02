package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.IngredientCategory;

public interface IngredientCategoryDao extends JpaRepository<IngredientCategory, Integer> {

    @Query(value = "SELECT ic FROM IngredientCategory ic where ic.name=?1")
    IngredientCategory getByNameCategory(String name);
}
