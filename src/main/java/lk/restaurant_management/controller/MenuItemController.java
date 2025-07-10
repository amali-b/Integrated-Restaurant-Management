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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.MenuItemDao;
import lk.restaurant_management.dao.MenuStatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.MenuHasSubmenu;
import lk.restaurant_management.entity.MenuItem;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class MenuItemController implements CommonController<MenuItem> {
    @Autowired
    private MenuItemDao menuItemDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;
    @Autowired
    private MenuStatusDao menuStatusDao;

    @Override
    // request mapping for load menuitems order UI
    @RequestMapping(value = "/menuitems")
    public ModelAndView UI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView menuitemsView = new ModelAndView();
        menuitemsView.setViewName("Menuitems.html");
        menuitemsView.addObject("loggedusername", auth.getName());

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        menuitemsView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            menuitemsView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            menuitemsView.addObject("loggedempname", "Admin");
        }
        menuitemsView.addObject("title", "BIT Project 2024 | Manage Menu Items");
        return menuitemsView;
    }

    @Override
    // define mapping get all menuitem data -- URL [/menuitems/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/menuitems/alldata", produces = "application/json")
    public List<MenuItem> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "MenuItem");

        if (userPrivilege.getPrivi_select()) {
            // last record eka udinma thyagnna one nisa sort krenewa property eka lesa
            // primary key eka use krl // id eka auto increment nisa return
            return menuItemDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/menuitem/insert")
    public String insertRecord(@RequestBody MenuItem menuitem) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "MenuItem");
        if (userPrivilege.getPrivi_insert()) {
            MenuItem extMenuItem = menuItemDao.getByMenuName(menuitem.getName());
            // extMenuItem null ndda da blenewa
            if (extMenuItem != null) {
                return "Entered Menu is Already exist.!";
            }
            try {
                // set auto generate value
                menuitem.setAddeduser(loggedUser.getId());
                menuitem.setAddeddatetime(LocalDateTime.now());
                menuitem.setCode(menuItemDao.getNextMenuCode());

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // menuitems_id nathuwa submit kranna ba

                // MenuHasSubmenusList list ekata loop ekak dala read krela
                for (MenuHasSubmenu mhs : menuitem.getMenuHasSubmenusList()) {
                    // onebyone (mhs) illegena menu items set krnw
                    mhs.setMenuitems_id(menuitem);
                }

                // do save operation
                menuItemDao.save(menuitem);

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @Override
    @PutMapping(value = "/menuitem/update")
    public String updateRecord(@RequestBody MenuItem menuitem) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "MenuItem");

        // check data Exist
        if (menuitem.getId() == null) {
            return "Menu Not Exist.!";
        }

        if (userPrivilege.getPrivi_update()) {
            try {
                // set auto generate value
                menuitem.setUpdateuser(loggedUser.getId());
                menuitem.setUpdatedatetime(LocalDateTime.now());

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // menuitems_id nathuwa submit kranna ba

                // MenuHasSubmenusList list ekata loop ekak dala read krela
                for (MenuHasSubmenu mhs : menuitem.getMenuHasSubmenusList()) {
                    // onebyone (mhs) illegena menu items set krnw
                    mhs.setMenuitems_id(menuitem);
                }

                // do save operation
                menuItemDao.save(menuitem);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    @Override
    @DeleteMapping(value = "/menuitem/delete")
    public String deleteRecord(@RequestBody MenuItem menuitem) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "MenuItem");

        if (userPrivilege.getPrivi_delete()) {
            // check data Exist
            MenuItem extMenu = menuItemDao.getReferenceById(menuitem.getId());
            if (extMenu == null) {
                return "Menu Item Not Exist.!";
            }

            try {
                // set auto generate value
                menuitem.setDeleteuser(loggedUser.getId());
                menuitem.setDeletedatetime(LocalDateTime.now());
                menuitem.setMenustatus_id(menuStatusDao.getReferenceById(3));

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // menuitems_id nathuwa submit kranna ba

                // MenuHasSubmenusList list ekata loop ekak dala read krela
                for (MenuHasSubmenu mhs : menuitem.getMenuHasSubmenusList()) {
                    // onebyone (mhs) illegena menu items set krnw
                    mhs.setMenuitems_id(menuitem);
                }

                // do save operation
                menuItemDao.save(extMenu);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }

}
