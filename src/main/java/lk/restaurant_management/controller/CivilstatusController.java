package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.CiviltausDao;
import lk.restaurant_management.entity.CivilStatus;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class CivilstatusController {

    @Autowired
    private CiviltausDao civiltausDao;// generate instance for interface

    @GetMapping(value = "civilstatus/alldata", produces = "application/json")
    public List<CivilStatus> getCivilStatusalldata() {
        return civiltausDao.findAll();
    }

}
