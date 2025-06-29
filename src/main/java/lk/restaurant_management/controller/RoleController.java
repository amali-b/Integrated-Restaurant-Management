package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.RoleDao;
import lk.restaurant_management.entity.Role;

@RestController
public class RoleController {

    @Autowired
    private RoleDao roleDao;// generate instance for interface file

    // define mapping get all role data -- URL [/role/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/role/alldata", produces = "application/json")
    public List<Role> getUserData() {
        return roleDao.findAll();
    }

    @GetMapping(value = "/role/withoutadmin", produces = "application/json")
    public List<Role> getUsersWithouthAdmin() {
        return roleDao.findAll();
    }
}
