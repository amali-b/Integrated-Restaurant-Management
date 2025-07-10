package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.GarbageremoveDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Garbageremove;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class GarbageRemoveController {

    @Autowired
    private GarbageremoveDao garbageremoveDao; // generate instance for interface file

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load garbageremove UI
    @RequestMapping(value = "/garbageremove")
    public ModelAndView loadGarbageremoveUI() {
        // Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // create ModelAndView instance
        ModelAndView garbageremoveView = new ModelAndView();

        garbageremoveView.setViewName("GarbageRemove.html");

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        garbageremoveView.addObject("loggedusername", auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        garbageremoveView.addObject("loggeduserphoto", user.getUserphoto());

        // Html title eka wdyt pennannewa
        garbageremoveView.addObject("title", "BIT Project 2024 | Manage Garbage Remove ");

        // log una user ta employee id ekk thiyenewanm
        if (user.getEmployee_id() != null) {
            garbageremoveView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            garbageremoveView.addObject("loggedempname", "Admin");
        }
        return garbageremoveView;
    }

    // define mapping get all garbageremove data -- URL [/garbageremove/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/garbageremove/allempdata", produces = "application/json")
    public List<Garbageremove> getGarbageRemoveAllData() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Garbage Remove");

        if (userPrivilege.getPrivi_select()) {
            /*
             * last record eka udinma thyagnna one nisa sort krenewa property eka lesa
             * primary key eka use krl
             */
            // id eka auto increment nisa return garbageremoveDao.findAll();
            return garbageremoveDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request post mapping for save garbageremove record [URL -->
    // /garbageremove/insert]
    @PostMapping(value = "/garbageremove/insert")
    // ui eke idela (post) eken body(@Requestbody) eke ena, json object eka --> java
    // object ekak bawata convert krenewa
    public String insertGarbagere(@RequestBody Garbageremove garbageremove) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Garbage Remove");

        if (userPrivilege.getPrivi_insert()) {
            try {
                // set auto generate value
                garbageremove.setAddeduser(loggedUser.getId());
                garbageremove.setAddeddatetime(LocalDateTime.now());

                // do save operation
                garbageremoveDao.save(garbageremove);

                // manage dependancies

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }
}
