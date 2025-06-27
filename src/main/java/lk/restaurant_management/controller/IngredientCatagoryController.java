package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.IngredientCategoryDao;
import lk.restaurant_management.entity.IngredientCategory;

@RestController
// controller eke thyena implementation
public class IngredientCatagoryController {

    @Autowired
    private IngredientCategoryDao ingredientCategoryDao;

    // define mapping get all customer status data -- URL
    // [/ingredientCategory/alldata]
    @GetMapping(value = "/ingredientcategory/alldata", produces = "application/json")
    public List<IngredientCategory> getAllIngredientCategory() {
        return ingredientCategoryDao.findAll();
    }
}