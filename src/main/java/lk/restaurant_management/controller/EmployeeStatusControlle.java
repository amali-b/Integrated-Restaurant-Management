package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.EmployeestatusDao;
import lk.restaurant_management.entity.EmployeeStatus;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class EmployeeStatusControlle {

    @Autowired
    private EmployeestatusDao employeestatusDao; // create instance for interface file

    @GetMapping(value = "employeestatus/alldata", produces = "application/json")
    public List<EmployeeStatus> getEmployeeStatusAllData() {
        return employeestatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }
}
