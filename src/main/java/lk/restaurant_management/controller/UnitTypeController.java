package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.UnitTypeDao;
import lk.restaurant_management.entity.UnitType;

@RestController
public class UnitTypeController {

    @Autowired
    private UnitTypeDao unitTypeDao; // generate instance for interface file

    // define mapping get all designation data -- URL [/designation/alldata]
    @GetMapping(value = "/unitType/alldata", produces = "application/json")
    public List<UnitType> getUnitTypeAllData() {
        return unitTypeDao.findAll();
    }
}
