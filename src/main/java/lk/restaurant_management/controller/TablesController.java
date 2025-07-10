package lk.restaurant_management.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.TablesDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.Tables;
import lk.restaurant_management.entity.User;

@RestController
public class TablesController implements CommonController<Tables> {
    @Autowired
    private TablesDao tablesDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Override
    @RequestMapping(value = "/tables") // request mapping for load vehicle UI
    public ModelAndView UI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView tableView = new ModelAndView();
        tableView.setViewName("Tables.html");
        tableView.addObject("loggedusername", auth.getName());

        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        tableView.addObject("loggedusername", auth.getName());

        if (user.getEmployee_id() != null) {
            tableView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            tableView.addObject("loggedempname", "Admin");
        }

        tableView.addObject("title", "BIT Project 2024 | Manage Tables ");
        return tableView;
    }

    @Override
    @GetMapping(value = "/tables/alldata", produces = "application/json")
    public List<Tables> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Tables");

        if (userPrivilege.getPrivi_select()) {
            return tablesDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/tables/insert")
    public String insertRecord(@RequestBody Tables tables) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Tables");
        if (userPrivilege.getPrivi_insert()) {
            try {
                // do save
                tablesDao.save(tables);

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @Override
    @PutMapping(value = "/tables/update")
    public String updateRecord(@RequestBody Tables tables) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");
        if (userPrivilege.getPrivi_update()) {
            try {
                // do save
                tablesDao.save(tables);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    @Override
    @DeleteMapping(value = "/tables/delete")
    public String deleteRecord(@RequestBody Tables tables) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");
        if (userPrivilege.getPrivi_delete()) {
            Tables extTable = tablesDao.getReferenceById(tables.getId());
            if (extTable == null) {
                return "Delete not Completed : Table Not Exist.!";
            }
            try {
                // do save
                tablesDao.save(extTable);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }
}
