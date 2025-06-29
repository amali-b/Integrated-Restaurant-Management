package lk.restaurant_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.User;

@RestController
public class ReportUIController {
    @Autowired
    private UserDao userDao;

    // request mapping for load order UI
    @RequestMapping(value = "/reportCustomer")
    public ModelAndView ReportCustomerUI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ReportCustomerView = new ModelAndView();
        ReportCustomerView.setViewName("CustomerReport.html");
        ReportCustomerView.addObject("loggedusername", auth.getName());
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        ReportCustomerView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        if (loggedUser.getEmployee_id() != null) {
            ReportCustomerView.addObject("loggedempname", loggedUser.getEmployee_id().getCallingname());
        } else {
            ReportCustomerView.addObject("loggedempname", "Admin");
        }
        ReportCustomerView.addObject("title", "BIT Project 2024 | Manage Customer Report");
        return ReportCustomerView;
    }

    // request mapping for load order UI
    @RequestMapping(value = "/reportPayment")
    public ModelAndView ReportPaymentUI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ReportPaymentView = new ModelAndView();
        ReportPaymentView.setViewName("PaymentReport.html");
        ReportPaymentView.addObject("loggedusername", auth.getName());
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        ReportPaymentView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        if (loggedUser.getEmployee_id() != null) {
            ReportPaymentView.addObject("loggedempname", loggedUser.getEmployee_id().getCallingname());
        } else {
            ReportPaymentView.addObject("loggedempname", "Admin");
        }
        ReportPaymentView.addObject("title", "BIT Project 2024 | Manage Payment Report");
        return ReportPaymentView;
    }
}
