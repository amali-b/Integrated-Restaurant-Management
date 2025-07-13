package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.ModuleDao;
import lk.restaurant_management.dao.RoleDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.LoggedUser;
import lk.restaurant_management.entity.Module;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.Role;
import lk.restaurant_management.entity.User;

@RestController
public class LoginController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private ModuleDao moduleDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

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

        User loggeduser = userDao.getByUsername(auth.getName());
        dashboardView.addObject("loggeduserphoto", loggeduser.getUserphoto());

        if (loggeduser.getEmployee_id() != null) {
            dashboardView.addObject("loggedempname", loggeduser.getEmployee_id().getCallingname());
        } else {
            dashboardView.addObject("loggedempname", "Admin");
        }
        return dashboardView;
    }

    @RequestMapping(value = "/editUser")
    public ModelAndView loadEditUserUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView editUserView = new ModelAndView();
        editUserView.setViewName("EditUser.html");
        // object eka set krenewa
        editUserView.addObject("loggedusername", auth.getName());

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        editUserView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            editUserView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            editUserView.addObject("loggedempname", "Admin");
        }
        return editUserView;
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

    @RequestMapping(value = "/loggeduserdetails")
    public LoggedUser getLoggeduserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // create logged user/ change user object
        LoggedUser loggedUser = new LoggedUser();
        loggedUser.setOldusername(user.getUsername());
        loggedUser.setUsername(user.getUsername());
        loggedUser.setEmail(user.getEmail());
        loggedUser.setUserphoto(user.getUserphoto());

        return loggedUser;
    }

    @PutMapping(value = "/editUser/submit")
    public String insertLoggeduserDetails(@RequestBody LoggedUser loggedUser) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create user object
        User user = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        // check user exist
        User extUser = userDao.getByUsername(loggedUser.getOldusername());
        if (extUser == null) {
            return "Save not Completed : User Not Exist";
        }

        // check data duplicate
        User extUserByuserName = userDao.getByUsername(loggedUser.getUsername());
        if (extUserByuserName != null && extUserByuserName.getId() != extUser.getId()) {
            return "Change not Completed : Entered UserName Already exist.!";
        }
        User extUserEmail = userDao.getByUsername(loggedUser.getEmail());
        if (extUserEmail != null && extUserEmail.getId() != extUser.getId()) {
            return "Update not Completed : Entered Email Already exist.!";
        }

        try {
            // password eka ewela thyenewanm
            if (loggedUser.getOldpassword() != null) {

                /*
                 * existing user ge password eka & dn log wela change eka krepu password eka
                 * samanada blnewa.
                 */

                // denna match wenewamnm true return krnw
                if (bCryptPasswordEncoder.matches(loggedUser.getOldpassword(), extUser.getPassword())) {
                    /*
                     * existing password eka & logged user enter kela new password eka samanada blnw
                     */
                    // denna matchnm true return krnw.. ethakota save kranna denna ba
                    // e nisa api password deka not equal da kyla blnewa..
                    if (!bCryptPasswordEncoder.matches(loggedUser.getNewpassword(), extUser.getPassword())) {
                        // true nm password eka save wenw
                        extUser.setPassword(bCryptPasswordEncoder.encode(loggedUser.getNewpassword()));
                    } else {
                        return " Change not Completed : Entered Password is Same.! ";
                    }

                    // denna match wenne naththan false return krnw
                } else {
                    // match wenne naththan
                    return " Change not Completed : Entered Password is not matched with Old Password.! ";
                }
            }

            // process PUT request for set updated values
            extUser.setUsername(loggedUser.getUsername());
            extUser.setEmail(loggedUser.getEmail());
            extUser.setUserphoto(loggedUser.getUserphoto());
            extUser.setPassword(bCryptPasswordEncoder.encode(loggedUser.getNewpassword()));

            // do save operation
            userDao.save(user);

            return "OK";
        } catch (Exception e) {
            // handle exception
            return "Save not Completed : " + e.getMessage();
        }

    }

    @RequestMapping(value = "/modulewithoutuserprivi")
    public List<Module> getModuleListByuser() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create user object
        User user = userDao.getByUsername(auth.getName());
        // log una user Admin nm sarema module penna one
        if (auth.getName().equalsIgnoreCase("Admin")) {
            return new ArrayList<>();
        } else {
            return moduleDao.getModuleByusername(user.getUsername());
        }
    }
}
