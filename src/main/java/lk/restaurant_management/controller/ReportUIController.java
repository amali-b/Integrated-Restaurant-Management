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

    // request mapping for load order UI
    @RequestMapping(value = "/reportGrn")
    public ModelAndView ReportGrnUI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ReportGrnView = new ModelAndView();
        ReportGrnView.setViewName("GrnReport.html");
        ReportGrnView.addObject("loggedusername", auth.getName());
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        ReportGrnView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        if (loggedUser.getEmployee_id() != null) {
            ReportGrnView.addObject("loggedempname", loggedUser.getEmployee_id().getCallingname());
        } else {
            ReportGrnView.addObject("loggedempname", "Admin");
        }
        ReportGrnView.addObject("title", "BIT Project 2024 | Manage Grn Report");
        return ReportGrnView;
    }

    // request mapping for load order UI
    @RequestMapping(value = "/inventoryStock")
    public ModelAndView ReportInventoryStockUI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ReportInventoryStockView = new ModelAndView();
        ReportInventoryStockView.setViewName("InventoryStockReport.html");
        ReportInventoryStockView.addObject("loggedusername", auth.getName());
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        ReportInventoryStockView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        if (loggedUser.getEmployee_id() != null) {
            ReportInventoryStockView.addObject("loggedempname", loggedUser.getEmployee_id().getCallingname());
        } else {
            ReportInventoryStockView.addObject("loggedempname", "Admin");
        }
        ReportInventoryStockView.addObject("title", "BIT Project 2024 | Manage Inventory Stock Report");
        return ReportInventoryStockView;
    }

    // request mapping for load order UI
    @RequestMapping(value = "/orderSummary")
    public ModelAndView ReportOrderSummaryUI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ReportOrderSummaryView = new ModelAndView();
        ReportOrderSummaryView.setViewName("OrderSummaryReport.html");
        ReportOrderSummaryView.addObject("loggedusername", auth.getName());
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        ReportOrderSummaryView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        if (loggedUser.getEmployee_id() != null) {
            ReportOrderSummaryView.addObject("loggedempname", loggedUser.getEmployee_id().getCallingname());
        } else {
            ReportOrderSummaryView.addObject("loggedempname", "Admin");
        }
        ReportOrderSummaryView.addObject("title", "BIT Project 2024 | Manage Order Summary Report");
        return ReportOrderSummaryView;
    }

    // request mapping for load order UI
    @RequestMapping(value = "/userReport")
    public ModelAndView ReportuserUI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ReportUserView = new ModelAndView();
        ReportUserView.setViewName("UserReport.html");
        ReportUserView.addObject("loggedusername", auth.getName());
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        ReportUserView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        if (loggedUser.getEmployee_id() != null) {
            ReportUserView.addObject("loggedempname", loggedUser.getEmployee_id().getCallingname());
        } else {
            ReportUserView.addObject("loggedempname", "Admin");
        }
        ReportUserView.addObject("title", "BIT Project 2024 | Manage User Report");
        return ReportUserView;
    }
}
