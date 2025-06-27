package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.CustomerDao;
import lk.restaurant_management.dao.CustomerstatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Customer;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class CustomerController {

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private CustomerstatusDao customerstatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load customer UI
    @RequestMapping(value = "/customer")
    public ModelAndView loadCustomerUI() {
        // AUTHENTICATION OBJECT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView customerView = new ModelAndView();
        customerView.setViewName("Customer.html");
        customerView.addObject("loggedusername", auth.getName());

        User user = userDao.getByUsername(auth.getName());
        if (user.getEmployee_id() != null) {
            customerView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            customerView.addObject("loggedempname", "Admin");
        }

        customerView.addObject("title", "BIT Project 2024 | Customer Management");
        return customerView;
    }

    // define mapping get all customer data -- URL [/customer/alldata]
    @GetMapping(value = "/customer/alldata", produces = "application/json")
    public List<Customer> getAllCustomers() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");
        if (userPrivilege.getPrivi_select()) {
            return customerDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/customer/insert")
    public String registerCustomer(@RequestBody Customer customer) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (userPrivilege.getPrivi_insert()) {
            // check data Exist or duplicate
            Customer extCustEmail = customerDao.getByEmail(customer.getEmail());
            if (extCustEmail != null) {
                return "Entered Email Already exist.!";
            }
            try {
                // set auto generate value
                customer.setAdded_datetime(LocalDateTime.now());
                customer.setAdded_user(loggedUser.getId());
                customer.setReg_no(customerDao.getNextCustomerUid());

                // do save operation
                customerDao.save(customer);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @PutMapping(value = "/customer/update")
    public String updateCustomer(@RequestBody Customer customer) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        // check customer exist
        if (customer.getId() == null) {
            return "Customer Not Exist.!";
        }

        // if exist
        if (userPrivilege.getPrivi_update()) {
            // check data duplicate
            Customer extCustEmail = customerDao.getByEmail(customer.getEmail());
            if (extCustEmail != null && extCustEmail.getId() != customer.getId()) {
                return "Entered Email Already exist.!";
            }
            try {
                // set auto generate value
                customer.setUpdate_datetime(LocalDateTime.now());
                customer.setUpdate_user(userDao.getByUsername(auth.getName()).getId());

                // process PUT request
                customerDao.save(customer);
                // manage dependancies

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }

    }

    @DeleteMapping(value = "/customer/delete")
    public String deleteCustomer(@RequestBody Customer customer) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        // check customer exist
        if (customer.getId() == null) {
            return "Customer Not Exist.!";
        }

        // check privilege exist
        if (userPrivilege.getPrivi_delete()) {
            try {
                // set auto generate value
                customer.setDelete_datetime(LocalDateTime.now());
                customer.setDelete_user(userDao.getByUsername(auth.getName()).getId());
                customer.setCustomerstatus_id(customerstatusDao.getReferenceById(2));

                // process PUT request
                customerDao.save(customer);

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
