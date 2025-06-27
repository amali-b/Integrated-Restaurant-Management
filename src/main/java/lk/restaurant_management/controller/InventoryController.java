package lk.restaurant_management.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.InventoryDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Inventory;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class InventoryController {

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @RequestMapping(value = "/inventory")
    public ModelAndView UI() {
        // AUTHENTICATION OBJECT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView inventoryView = new ModelAndView();
        inventoryView.setViewName("Inventory.html");
        inventoryView.addObject("loggedusername", auth.getName());
        inventoryView.addObject("title", "BIT Project 2024 | Inventory Management");

        User user = userDao.getByUsername(auth.getName());
        if (user.getEmployee_id() != null) {
            inventoryView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            inventoryView.addObject("loggedempname", "Admin");
        }

        return inventoryView;
    }

    // define mapping get all customer status data
    @GetMapping(value = "/inventory/alldata", produces = "application/json")
    public List<Inventory> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");
        if (userPrivilege.getPrivi_select()) {
            return inventoryDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

}
