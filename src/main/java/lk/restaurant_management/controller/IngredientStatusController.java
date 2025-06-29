package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.IngredientStatusDao;
import lk.restaurant_management.entity.IngredientStatus;

@RestController
// controller eke thyena implementation
public class IngredientStatusController {

    @Autowired
    private IngredientStatusDao ingredientStatusDao;

    // define mapping get all ingredient status data
    @GetMapping(value = "/ingredientstatus/alldata", produces = "application/json")
    public List<IngredientStatus> getAllIngredientStatus() {
        return ingredientStatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }
}