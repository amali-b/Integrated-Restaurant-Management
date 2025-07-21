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

    // request mapping for load order payment [ URL-->(/reportPayment/bysixmonth) ]
    @GetMapping(value = "/dashboard/paymentsbylastweek", produces = "application/json")
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

    // request mapping for load number of orders [URL-->(/dashboard/bysixmonth)]
    @GetMapping(value = "/dashboard/ordersbylastweek", produces = "application/json")
    public String[][] getNumberofOrdersWeekly() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getNumberofOrdersWeekly();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load supplier
    // payment[URL-->(/dashboard/supplyPaymentsbyonemonth)]
    @GetMapping(value = "/dashboard/supplyPaymentsbyonemonth", produces = "application/json")
    public String[][] getSupplierPaymentsMonth() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getSupplierPaymentsMonth();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load customer
    // registrations [URL-->(/dashboard/customerregistration)]
    @GetMapping(value = "/dashboard/customerregistration", produces = "application/json")
    public String[][] getCustomerRegistrationMonthly() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getCustomerRegistrationMonthly();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load order payments by previous six
    // months[URL-->(/dashboard/orderPaymentbysixmonth)]
    @GetMapping(value = "/dashboard/orderPaymentbysixmonth", produces = "application/json")
    public String[][] getOrderPaymentByPriviousSixMonth() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getOrderPaymentByPriviousSixMonth();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load order payments by previous six
    // months[URL-->(/dashboard/topsellingSubmenus)]
    @GetMapping(value = "/dashboard/topsellingSubmenus", produces = "application/json")
    public String[][] getTopSellingSubmenuMonthly() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getTopSellingSubmenuMonthly();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    /* ####### GRN ####### */

    // request mapping for load grns by given daterange [ URL
    // -->/reportGrn/bystedtype?startdate=&enddate=&type=]
    @GetMapping(value = "/reportGrn/bystedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getGrnReportDate(@RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate, @RequestParam("type") String type) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            if (type.equals("Monthly")) {
                return reportDao.getGrnsByMonthly(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getGrnsByWeekly(startdate, enddate);
            }
            return null;
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    /* ##### USER REPORTS ##### */

    // request mapping for load user by both designation and status [ URL
    // -->/reportUser/bydesignationstatus?designation_id=&employeestatus_id=]
    @GetMapping(value = "/reportUser/bydesignationstatus", params = { "designation_id",
            "employeestatus_id" }, produces = "application/json")
    public String[][] getUserReport(@RequestParam("designation_id") Integer designationid,
            @RequestParam("employeestatus_id") Integer statusid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getUserByDesignationStatus(designationid, statusid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load grns by given daterange [ URL
    // -->/reportGrn/bydesignationstatus?designation_id=]
    @GetMapping(value = "/reportUser/bydesignation", params = { "designation_id" }, produces = "application/json")
    public String[][] getUserReportByDesignation(@RequestParam("designation_id") Integer designationid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getUserByDesignation(designationid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load grns by given daterange [ URL
    // -->/reportGrn/bydesignationstatus?designation=&status]
    @GetMapping(value = "/reportUser/allusers", produces = "application/json")
    public String[][] getUserReportByStatus() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getUserReport();
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load grns by given daterange [ URL
    // -->/reportGrn/bystedtype?startdate=&enddate=&type=]
    @GetMapping(value = "/reportInventoryStock/bystedtype", params = { "startdate",
            "enddate" }, produces = "application/json")
    public String[][] getInventoryStockReport(@RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");

        if (userPrivilege.getPrivi_select()) {
            return reportDao.getInventoryStockDate(startdate, enddate);
        } else {
            // privilege naththan empty array ekak return krnw
            return new String[0][0];
        }
    }

    // request mapping for load grns by given daterange [ URL
    // -->/reportSales/bystedtype?startdate=&enddate=&type=]
    /*
     * @GetMapping(value = "/reportSales/bystedtype", params = { "startdate",
     * "enddate",
     * "type" }, produces = "application/json")
     * public String[][] getSalesSummaryReport(@RequestParam("startdate") String
     * startdate,
     * 
     * @RequestParam("enddate") String enddate, @RequestParam("type") String type) {
     * // check user authorization
     * Authentication auth = SecurityContextHolder.getContext().getAuthentication();
     * // get privilege object
     * Privilege userPrivilege =
     * userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
     * 
     * if (userPrivilege.getPrivi_select()) {
     * if (type.equals("Monthly")) {
     * return reportDao.getSalesSummaryByMonthly(startdate, enddate);
     * }
     * if (type.equals("Weekly")) {
     * return reportDao.getSalesSummaryByWeekly(startdate, enddate);
     * }
     * if (type.equals("Daily")) {
     * return reportDao.getSalesSummaryByDaily(startdate, enddate);
     * }
     * return null;
     * } else {
     * // privilege naththan empty array ekak return krnw
     * return new String[0][0];
     * }
     * }
     */

}
