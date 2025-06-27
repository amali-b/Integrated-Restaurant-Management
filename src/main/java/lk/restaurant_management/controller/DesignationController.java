package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.DesignationDao;
import lk.restaurant_management.entity.Designation;

@RestController
public class DesignationController {

    @Autowired
    private DesignationDao designationDao; // generate instance for interface file

    // define mapping get all designation data -- URL [/designation/alldata]
    @GetMapping(value = "/designation/alldata", produces = "application/json")
    public List<Designation> getDesignationAllData() {
        return designationDao.findAll();
    }
}
