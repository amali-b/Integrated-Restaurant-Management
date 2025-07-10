package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.IngredientCategoryDao;
import lk.restaurant_management.entity.IngredientCategory;
import lk.restaurant_management.entity.Privilege;

@RestController
// controller eke thyena implementation
public class IngredientCatagoryController {

    @Autowired
    private IngredientCategoryDao ingredientCategoryDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // define mapping get all customer status data -- URL
    // [/ingredientCategory/alldata]
    @GetMapping(value = "/ingredientcategory/alldata", produces = "application/json")
    public List<IngredientCategory> getAllIngredientCategory() {
        return ingredientCategoryDao.findAll(Sort.by(Direction.DESC, "id"));

    }

    @PostMapping(value = "/ingredientcategory/insert")
    public String insertRecord(@RequestBody IngredientCategory ingredientcategory) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");
        if (userPrivilege.getPrivi_insert()) {
            // check data Exist
            IngredientCategory extIngCategory = ingredientCategoryDao.getByNameCategory(ingredientcategory.getName());
            if (extIngCategory != null) {
                return "Entered Category is Already exist.!";
            }
            try {
                // save operator
                ingredientCategoryDao.save(ingredientcategory);
            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
            return "OK";
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }
}