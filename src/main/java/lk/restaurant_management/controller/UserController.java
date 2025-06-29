package lk.restaurant_management.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Sort;
// import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserDao userDao;// generate instance for interface file

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // request mapping for load user ui
    @RequestMapping()
    public ModelAndView loadUserUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView userView = new ModelAndView();
        userView.setViewName("User.html");
        userView.addObject("loggedusername", auth.getName());
        userView.addObject("title", "BIT Project 2024 | Manage User ");

        User user = userDao.getByUsername(auth.getName());
        if (user.getEmployee_id() != null) {
            userView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            userView.addObject("loggedempname", "Admin");
        }

        return userView;
    }

    // define mapping get all user data -- URL [/user/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<User> getUserData() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivi_select()) {
            // last record eka udinma thyagnna one nisa sort krenewa property eka lesa
            // primary key eka use krl // id eka auto increment nisa
            return userDao.findAll(auth.getName());
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request post mapping for save user record [URL --> /user/insert]
    @PostMapping(value = "/insert")
    public String insertUser(@RequestBody User user) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivi_insert()) {
            // check data duplicate
            User extUserEmail = userDao.getByUsername(user.getEmail());
            if (extUserEmail != null) {
                return "Save not Completed : Entered Email is Already exist.!";
            }
            User extUser = userDao.getByUsername(user.getUsername());
            if (extUser != null) {
                return "Save not Completed : Entered Username is Already exist.!";
            }

            // process POST request
            try {
                // set auto generate value
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
                user.setAddeddatetime(LocalDateTime.now());

                // do save operation
                userDao.save(user);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                // handle exception
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }

    }

    // request put mapping for update user record [URL --> /user/update]
    @PutMapping(value = "/update")
    public String updateUser(@RequestBody User user) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        // check privilege exist
        if (user.getId() == null) {
            return "Update not Completed : User Not Exist.!";
        }
        // check user exist
        User extUser = userDao.getReferenceById(user.getId());
        if (extUser == null) {
            return "Update not Completed : User Not Exist";
        }

        if (userPrivilege.getPrivi_update()) {
            // check data duplicate
            User extUserEmail = userDao.getByUsername(user.getEmail());
            if (extUserEmail != null && extUserEmail.getId() != user.getId()) {
                return "Update not Completed : Entered Email Already exist.!";
            }
            User extUsername = userDao.getByUsername(user.getUsername());
            if (extUsername != null && extUsername.getId() != user.getId()) {
                return "Save not Completed : Entered Username is Already exist.!";
            }
            try {
                // process PUT request
                user.setUpdateddatetime(LocalDateTime.now());
                // do save operation
                userDao.save(user);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                // handle exception
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    // request put mapping for delete user record [URL --> /user/delete]
    @DeleteMapping(value = "/delete")
    public String deleteUser(@RequestBody User user) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        // check data exist
        User extUser = userDao.getReferenceById(user.getId());// get exsisting user object
        if (extUser == null) {
            return "Delete not Completed : User Not Exist.!";
        }
        // check privilege exist
        if (userPrivilege.getPrivi_delete()) {
            try {
                extUser.setStatus(false);
                extUser.setDeletedatetime(LocalDateTime.now());

                // do save operation
                userDao.save(extUser);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                // handle exception
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }

}
