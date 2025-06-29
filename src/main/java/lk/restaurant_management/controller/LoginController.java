package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.RoleDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Role;
import lk.restaurant_management.entity.User;

@RestController
public class LoginController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @RequestMapping(value = "/login")
    public ModelAndView loadLoginUI() {
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("Login.html");
        return loginView;
    }

    @RequestMapping(value = "/dashboard")
    public ModelAndView loadDashboardUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView dashboardView = new ModelAndView();
        dashboardView.setViewName("Dashboard.html");
        // object eka set krenewa
        dashboardView.addObject("loggedusername", auth.getName());

        User user = userDao.getByUsername(auth.getName());
        if (user.getEmployee_id() != null) {
            dashboardView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            dashboardView.addObject("loggedempname", "Admin");
        }
        return dashboardView;
    }

    @RequestMapping(value = "/errorpage")
    public ModelAndView loadErrorUI() {
        ModelAndView errorpageView = new ModelAndView();
        errorpageView.setViewName("errorpage.html");
        return errorpageView;
    }

    @RequestMapping(value = "/createadmin")
    public ModelAndView generateAdminUI() {

        // check if there is user Admin
        User extAdminUser = userDao.getByUsername("Admin");

        // if not
        if (extAdminUser == null) {
            // create new user
            User adminUser = new User();

            // set data for attributes
            adminUser.setUsername("Admin");
            adminUser.setEmail("adminuser@gmail.com");
            adminUser.setStatus(true);
            adminUser.setAddeddatetime(LocalDateTime.now());
            adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));

            // set user roles by hashset
            Set<Role> roles = new HashSet<>();
            // add admin user roles id
            Role adminRole = roleDao.getReferenceById(1);
            roles.add(adminRole);

            // set admin user role for admin user object
            adminUser.setRoles(roles);

            // save user
            userDao.save(adminUser);
        }

        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("Login.html");
        return loginView;
    }

}
