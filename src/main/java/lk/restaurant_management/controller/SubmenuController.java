package lk.restaurant_management.controller;

import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.SubmenuDao;
import lk.restaurant_management.dao.SubmenuStatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.Submenu;
import lk.restaurant_management.entity.SubmenuHasIngredient;
import lk.restaurant_management.entity.User;

@RestController
public class SubmenuController implements CommonController<Submenu> {
    @Autowired
    private SubmenuStatusDao submenuStatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;
    @Autowired
    private SubmenuDao submenuDao;

    @Override
    @RequestMapping(value = "/submenu")
    public ModelAndView UI() {
        // AUTHENTICATION OBJECT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView SubmenuView = new ModelAndView();
        SubmenuView.setViewName("Submenu.html");
        SubmenuView.addObject("loggedusername", auth.getName());
        SubmenuView.addObject("title", "BIT Project 2024 | Submenu Management");

        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        SubmenuView.addObject("loggedusername", auth.getName());

        if (user.getEmployee_id() != null) {
            SubmenuView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            SubmenuView.addObject("loggedempname", "Admin");
        }
        return SubmenuView;
    }

    @Override
    @GetMapping(value = "/submenu/alldata", produces = "application/json")
    public List<Submenu> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Submenu");

        if (userPrivilege.getPrivi_select()) {
            return submenuDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for load submenu by given category id [ URL -->
    // /submenu/bycategory?category_id=1 ]
    @GetMapping(value = "/submenu/bycategory", params = { "category_id" }, produces = "application/json")
    public List<Submenu> byCategory(@RequestParam("category_id") Integer categoryid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Submenu");

        if (userPrivilege.getPrivi_select()) {
            return submenuDao.byCategory(categoryid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/submenu/insert")
    public String insertRecord(@RequestBody Submenu submenu) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Submenu");

        if (userPrivilege.getPrivi_insert()) {
            // check data Exist or duplicate
            Submenu extSubmenu = submenuDao.getBySubmenuName(submenu.getName());
            if (extSubmenu != null && extSubmenu.getId() != submenu.getId()) {
                return "Entered Submenu is Already exist.!";
            }
            try {
                // set auto generate value
                submenu.setAddeddatetime(LocalDateTime.now());
                submenu.setAddeduser(loggedUser.getId());
                submenu.setSubmenu_code(submenuDao.getNextCode());

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore)
                // main submenu_id nathuwa submit kranna ba
                for (SubmenuHasIngredient shi : submenu.getSubmenuHasIngredientList()) {
                    shi.setSubmenu_id(submenu);
                }

                // do save operation
                submenuDao.save(submenu);

                return "OK";
            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @Override
    @PutMapping(value = "/submenu/update")
    public String updateRecord(@RequestBody Submenu submenu) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Submenu");

        // check data Exist
        if (submenu.getId() == null) {
            return "Submenu Not Exist.!";
        }

        if (userPrivilege.getPrivi_update()) {
            // check data duplicate
            Submenu extSubmenu = submenuDao.getBySubmenuName(submenu.getName());
            if (extSubmenu != null && extSubmenu.getId() != submenu.getId()) {
                return "Entered Submenu is Already exist.!";
            }
            try {
                // set auto generate value
                submenu.setUpdatedatetime(LocalDateTime.now());
                submenu.setUpdateuser(loggedUser.getId());

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore)
                // main submenu_id nathuwa submit kranna ba
                for (SubmenuHasIngredient shi : submenu.getSubmenuHasIngredientList()) {
                    shi.setSubmenu_id(submenu);
                }
                // do save operation
                submenuDao.save(submenu);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    @Override
    @DeleteMapping(value = "/submenu/delete")
    public String deleteRecord(@RequestBody Submenu submenu) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Submenu");

        if (userPrivilege.getPrivi_delete()) {
            // check data Exist or duplicate
            Submenu extSubmenu = submenuDao.getBySubmenuName(submenu.getName());
            if (extSubmenu != null && extSubmenu.getId() != submenu.getId()) {
                return "Update not Completed : Entered Submenu is Already exist.!";
            }
            try {
                // set auto generate value
                extSubmenu.setDeletedatetime(LocalDateTime.now());
                extSubmenu.setDeleteuser(loggedUser.getId());
                extSubmenu.setSubmenustatus_id(submenuStatusDao.getReferenceById(4));

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore)
                // main submenu_id nathuwa submit kranna ba
                for (SubmenuHasIngredient shi : submenu.getSubmenuHasIngredientList()) {
                    shi.setSubmenu_id(submenu);
                }
                // do save operation
                submenuDao.save(extSubmenu);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }

}
