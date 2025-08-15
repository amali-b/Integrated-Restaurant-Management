package lk.restaurant_management.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import lk.restaurant_management.dao.PrivilegeDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class PrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao; // generate instance for interface file

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @RequestMapping(value = "/privilege")
    public ModelAndView loadPrivilegeUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView privilegeView = new ModelAndView();
        privilegeView.setViewName("Privilege.html");
        privilegeView.addObject("loggedusername", auth.getName());
        privilegeView.addObject("title", "BIT Project 2024 | Privilege ");

        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        privilegeView.addObject("loggeduserphoto", user.getUserphoto());

        // log wela inna user ge username eka set krenewa
        privilegeView.addObject("loggedusername", auth.getName());

        if (user.getEmployee_id() != null) {
            privilegeView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            privilegeView.addObject("loggedempname", "Admin");
        }

        return privilegeView;
    }

    // define mapping get all privilege data -- URL [/privilege/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/privilege/alldata", produces = "application/json")
    public List<Privilege> getPrivilegellData() {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");
        if (userPrivilege.getPrivi_select()) {
            return privilegeDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request post mapping for save privilege record [URL --> /privilege/insert]
    @PostMapping(value = "/privilege/insert")
    public String insertPrivilege(@RequestBody Privilege privilege) {

        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");
        if (userPrivilege.getPrivi_insert()) {

            // check data duplicate
            Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null) {
                return "Save Not Complete : Privilege has already exist.!";
            }
            // process POST request
            try {
                // do save operation
                privilegeDao.save(privilege);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }

        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    // request put mapping for update privilege record [URL --> /privilege/update]
    @PutMapping(value = "/privilege/update")
    public String updatePrivilege(@RequestBody Privilege privilege) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        // check privilege exist
        if (userPrivilege.getPrivi_update()) {

            // check data duplicate
            Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null && extPrivilege.getId() != privilege.getId()) {
                return "Update Not Complete : Privilege has already exist.!";
            }

            // process Put request
            try {
                // do save operation
                privilegeDao.save(privilege);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }

        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    // request delete mapping for update privilege record [URL--> /privilege/delete]
    @DeleteMapping(value = "/privilege/delete")
    public String deletePrivilege(@RequestBody Privilege privilege) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        // check data exist

        if (userPrivilege.getPrivi_delete()) {
            // Delete Process
            try {
                // do update operation
                privilege.setPrivi_select(false);
                privilege.setPrivi_insert(false);
                privilege.setPrivi_update(false);
                privilege.setPrivi_delete(false);
                privilegeDao.save(privilege);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }

        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }
}
