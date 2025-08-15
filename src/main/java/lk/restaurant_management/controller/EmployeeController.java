package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import lk.restaurant_management.dao.EmployeeDao;
import lk.restaurant_management.dao.EmployeestatusDao;
import lk.restaurant_management.dao.RoleDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Employee;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.Role;
import lk.restaurant_management.entity.User;

@RestController
public class EmployeeController {

    @Autowired
    private EmployeeDao employeeDao; // generate instance for interface file
    @Autowired
    private EmployeestatusDao employeestatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private RoleDao roleDao;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load employee UI
    @RequestMapping(value = "/employee")
    public ModelAndView loadEmployeeUI() {
        // Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView employeeView = new ModelAndView();
        employeeView.setViewName("Employee.html");
        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        employeeView.addObject("loggedusername", auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        employeeView.addObject("loggeduserphoto", user.getUserphoto());

        // Html title eka wdyt pennannewa
        employeeView.addObject("title", "BIT Project 2024 | Manage Employee ");

        // log una user ta employee id ekk thiyenewanm
        if (user.getEmployee_id() != null) {
            employeeView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            employeeView.addObject("loggedempname", "Admin");
        }
        return employeeView;
    }

    // define mapping get all employee data -- URL [/employee/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/employee/allempdata", produces = "application/json")
    public List<Employee> getEmployeeAllData() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (userPrivilege.getPrivi_select()) {
            /*
             * last record eka udinma thyagnna one nisa sort krenewa property eka lesa
             * primary key eka use krl
             */
            // id eka auto increment nisa return employeeDao.findAll();
            return employeeDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for get employees without user account
    @GetMapping(value = "/employee/withoutuseraccnt", produces = "application/json")
    public List<Employee> listWithoutUserAccount() {
        return employeeDao.listWithoutUserAccount();
    }

    // request post mapping for save employee record [URL --> /employee/insert]
    @PostMapping(value = "/employee/insert")
    // ui eke idela (post) eken body(@Requestbody) eke ena, json object eka --> java
    // object ekak bawata convert krenewa
    public String insertEmployee(@RequestBody Employee employee) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (userPrivilege.getPrivi_insert()) {
            // check data Exist
            Employee extEmployeeNic = employeeDao.getByNIC(employee.getNic());
            if (extEmployeeNic != null) {
                return "Entered NIC (" + employee.getNic() + ") is Already exist.!";
            }

            // dao layer eka hareha getByEmail method eka call krela employeege Email eka
            // aregnnewa getEmail() eken
            // e gnna email ekata Employee object ekak hdagnnw extEmployeeEmail kiyela
            Employee extEmployeeEmail = employeeDao.getByEmail(employee.getEmail());
            // extEmployeeEmail null ndda da blenewa
            if (extEmployeeEmail != null) {
                // null naththan e kynne e dapu email ekt samana email ekk already thyenewa
                return "Entered Email Already exist.!";
            }

            try {
                // set auto generate value
                employee.setAdded_datetime(LocalDateTime.now());
                employee.setAdded_user(loggedUser.getId());
                employee.setEmp_uid(employeeDao.getNextEmpUid());

                // do save operation
                employeeDao.save(employee);

                // manage dependancies
                if (employee.getDesignation_id().getUseraccount()) {
                    // create new user
                    User objectUser = new User();
                    // set data for attributes
                    objectUser.setUsername(employee.getEmp_uid());
                    objectUser.setEmail(employee.getEmail());
                    objectUser.setStatus(true);
                    objectUser.setAddeddatetime(LocalDateTime.now());
                    objectUser.setPassword(bCryptPasswordEncoder.encode(employee.getNic()));
                    objectUser.setEmployee_id(employeeDao.getByNIC(employee.getNic()));
                    if (employee.getEmployeeimage() != null) {
                        objectUser.setUserphoto(employee.getEmployeeimage());
                    }

                    // set user roles by hashset
                    Set<Role> roles = new HashSet<>();
                    // role object ekak hadenewa role entity eke id eken aran
                    Role role = roleDao.getReferenceById(employee.getDesignation_id().getRoleid());
                    // role object eka roles list ekata genath danewa
                    roles.add(role);

                    // set admin user role for admin user object
                    objectUser.setRoles(roles);

                    // save user
                    userDao.save(objectUser);
                }

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    // request put mapping for update employee record [URL --> /employee/update]
    @PutMapping(value = "/employee/update")
    public String updateEmployeeData(@RequestBody Employee employee) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        // check employee exist
        if (employee.getId() == null) {
            return "Employee Not Exist.!";
        }

        // dekama dannath puluwn noda hitiyath aulk na
        Employee extById = employeeDao.getReferenceById(employee.getId());
        if (extById == null) {
            return "Employee Not Exist";
        }

        if (userPrivilege.getPrivi_update()) {
            // check data duplicate
            Employee extEmployeeNic = employeeDao.getByNIC(employee.getNic());
            if (extEmployeeNic != null && extEmployeeNic.getId() != employee.getId()) {
                return "Entered NIC (" + employee.getNic() + ") is Already exist.!";
            }
            Employee extEmployeeEmail = employeeDao.getByEmail(employee.getEmail());
            if (extEmployeeEmail != null && extEmployeeEmail.getId() != employee.getId()) {
                return "Entered Email Already exist.!";
            }

            // update process
            try {
                // set auto generate value
                employee.setUpdate_datetime(LocalDateTime.now());
                employee.setUpdate_user(userDao.getByUsername(auth.getName()).getId());

                // process PUT request
                employeeDao.save(employee);

                // manage dependancies
                // employeeta adala user acc ekk thiyenwd blanna one
                if (employee.getDesignation_id().getUseraccount()) {
                    User extUser = userDao.getByUsername(employee.getEmp_uid());
                    // user account ekk thiyenewanm
                    if (extUser != null) {
                        // employee status eka maru welada blanna one
                        if (employee.getEmployeestatus_id().getId() == 3
                                || employee.getEmployeestatus_id().getId() == 4) {
                            // user acc eka inactvie wela update wenna one
                            extUser.setStatus(false);
                        }
                        // employee photo eka change welada blanna one
                        if (employee.getEmployeeimage() != null) {
                            // Directly replace the old image with the new one
                            extUser.setUserphoto(employee.getEmployeeimage());
                        }
                        // set user roles by hashset
                        Set<Role> roles = new HashSet<>();
                        // role object ekak hadenewa role entity eke id eken aran
                        Role role = roleDao.getReferenceById(employee.getDesignation_id().getRoleid());
                        // role object eka roles list ekata genath danewa
                        roles.add(role);
                        // set admin user role for admin user object
                        extUser.setRoles(roles);

                        // save user
                        userDao.save(extUser);
                    }
                }

                return "OK";
            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    // request put mapping for delete employee record [URL --> /employee/delete]
    @DeleteMapping(value = "/employee/delete")
    public String deleteEmployee(@RequestBody Employee employee) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        // check user exist
        if (employee.getId() == null) {
            return "Employee Not Exist.!";
        }
        Employee extEmployeeById = employeeDao.getReferenceById(employee.getId());
        if (extEmployeeById == null) {
            return "Employee Not Exist";
        }

        // check privilege exist
        if (userPrivilege.getPrivi_delete()) {
            try {
                // set auto generate delete data
                extEmployeeById.setDelete_datetime(LocalDateTime.now());
                extEmployeeById.setDelete_user(userDao.getByUsername(auth.getName()).getId());
                // getReferenceById eken object eka return removed ekata adalawa
                extEmployeeById.setEmployeestatus_id(employeestatusDao.getReferenceById(4));

                // update operator
                employeeDao.save(extEmployeeById);

                /*
                 * direct delete from database
                 * employeeDao.delete(employee);
                 */

                // manage dependancies
                // employeeta adala user acc ekk thiyenwd blanna one
                if (extEmployeeById.getDesignation_id().getUseraccount()) {
                    User extUser = userDao.getByUsername(extEmployeeById.getEmp_uid());
                    // user account ekk thiyenewanm
                    if (extUser != null) {
                        // employee status eka maru welada blanna one
                        if (extEmployeeById.getEmployeestatus_id().getId() == 4) {
                            // user acc eka inactvie wela update wenna one
                            extUser.setStatus(false);
                        }
                        // save user
                        userDao.save(extUser);
                    }
                }

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }

        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }
}
