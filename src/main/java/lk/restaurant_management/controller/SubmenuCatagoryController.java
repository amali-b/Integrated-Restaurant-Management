package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.SubmenuCategoryDao;
import lk.restaurant_management.entity.SubmenuCategory;

@RestController
// controller eke thyena implementation
public class SubmenuCatagoryController {

    @Autowired
    private SubmenuCategoryDao submenuCategoryDao;

    // define mapping get all customer status data -- URL
    // [/submenucategory/alldata]
    @GetMapping(value = "/submenucategory/alldata", produces = "application/json")
    public List<SubmenuCategory> getAllSubmenuCategory() {
        return submenuCategoryDao.findAll();
    }
}