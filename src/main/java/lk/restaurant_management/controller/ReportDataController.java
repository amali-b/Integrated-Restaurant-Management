package lk.restaurant_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.ReportDao;
import lk.restaurant_management.entity.Privilege;

@RestController
public class ReportDataController {

    @Autowired
    private ReportDao reportDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load order by given status id [ URL
    // -->/reportPayment/bystedtype?startdate=&enddate=&type=]
    @GetMapping(value = "/reportPayment/bystedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getPaymentReportDate(@RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate, @RequestParam("type") String type) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            if (type.equals("Monthly")) {
                return reportDao.getPaymentByMonthly(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getPaymentByWeekly(startdate, enddate);
            }
            return null;
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load order by given status id [ URL
    // -->/reportPayment/bysixmonth]
    @GetMapping(value = "/reportPayment/bysixmonth", produces = "application/json")
    public String[][] getPaymentReportDateSixMonth() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getPaymentByPriviousSixMonth();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    @GetMapping(value = "/reportOrderPayments/bylastweek", produces = "application/json")
    public String[][] getPaymentReportDateLastWeek() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getOrderByPriviousLastweek();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

}
