package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.SupplierOrder;

public interface ReportDao extends JpaRepository<SupplierOrder, Integer> {

        /* ##### SUPPLIER PAYMENT REPORT ######## */

        // get total amount of purchase order of previous six month
        @Query(value = "SELECT monthname(so.addeddatetime), sum(so.totalamount) FROM resturant_management_project.supplierorder \n"
                        + //
                        "    as so where date(so.addeddatetime) between current_date()- interval 6 month and current_date() group by monthname(so.addeddatetime);", nativeQuery = true)
        String[][] getPaymentByPriviousSixMonth();

        // to get total amount of given daterange by monthly
        @Query(value = "SELECT monthname(sp.addeddatetime), sum(sp.paidamount) FROM resturant_management_project.supplierpayment as sp where date(sp.addeddatetime) between ?1 and ?2 group by monthname(sp.addeddatetime);", nativeQuery = true)
        String[][] getPaymentByMonthly(String strartdate, String enddate);

        // get supplier payment weekly
        @Query(value = "SELECT weekday(sp.addeddatetime), sum(sp.paidamount) FROM resturant_management_project.supplierpayment as sp where date(sp.addeddatetime) between ?1 and ?2 group by weekday(sp.addeddatetime);", nativeQuery = true)
        String[][] getPaymentByWeekly(String strartdate, String enddate);

        /* ##### reports for Dashboard ######## */

        // get sales summary of last week by orders
        @Query(value = "SELECT sum(o.netamount) FROM resturant_management_project.order as o where date(o.addeddatetime) between current_date()-interval 7 day and current_date();", nativeQuery = true)
        String[][] getOrderByPriviousLastweek();

        // get number of orders of last week
        @Query(value = "SELECT count(o.ordercode) FROM resturant_management_project.order as o where date(o.addeddatetime) between current_date()-interval 7 day and current_date();", nativeQuery = true)
        String[][] getNumberofOrdersWeekly();

        // get supplier payments of last week
        @Query(value = "SELECT sum(sp.paidamount) FROM resturant_management_project.supplierpayment as sp where date(sp.addeddatetime) between current_date()-interval 1 month and current_date();", nativeQuery = true)
        String[][] getSupplierPaymentsMonth();

        @Query(value = "SELECT count(c.reg_no) FROM resturant_management_project.customer as c where date(c.added_datetime)between current_date()-interval 6 month and current_date();", nativeQuery = true)
        String[][] getCustomerRegistrationMonthly();

        /* get total of order payments by previous six month for line charts */
        @Query(value = "SELECT monthname(o.addeddatetime), sum(o.netamount) FROM resturant_management_project.order as o where date(o.addeddatetime) between current_date()-interval 6 month and current_date() group by monthname(o.addeddatetime);", nativeQuery = true)
        String[][] getOrderPaymentByPriviousSixMonth();

        @Query(value = "SELECT s.name, sum(ohs.quantity) FROM resturant_management_project.order AS o JOIN resturant_management_project.order_has_submenu AS ohs ON o.id = ohs.order_id JOIN resturant_management_project.submenu AS s ON ohs.submenu_id = s.id WHERE DATE(o.addeddatetime) BETWEEN CURRENT_DATE() - INTERVAL 6 month AND CURRENT_DATE() GROUP BY s.name;", nativeQuery = true)
        String[][] getTopSellingSubmenuMonthly();

        /* ###### GRN REPORT ######## */

        // get items and netamount of received grns by monthly
        @Query(value = "SELECT monthname(g.addeddatetime), g.dateofreceived, sum(ghi.quantity), sum(g.netamount) FROM resturant_management_project.grn as g join resturant_management_project.grn_has_ingredient as ghi on g.id = ghi.grn_id where date(g.addeddatetime) between ?1 and ?2 group by g.dateofreceived;", nativeQuery = true)
        String[][] getGrnsByMonthly(String strartdate, String enddate);

        // get items and netamount of received grns by weekly
        @Query(value = "SELECT weekday(g.addeddatetime), g.dateofreceived, sum(ghi.quantity), sum(g.netamount) FROM resturant_management_project.grn as g join resturant_management_project.grn_has_ingredient as ghi on g.id = ghi.grn_id where date(g.addeddatetime) between ?1 and ?2 group by g.dateofreceived;", nativeQuery = true)
        String[][] getGrnsByWeekly(String strartdate, String enddate);

        /* ###### USER REPORT ######## */

        // get users by designation
        @Query(value = "SELECT e.fullname, u.username, u.email, d.name, es.status FROM resturant_management_project.user as u \n"
                        + //
                        "join resturant_management_project.employee as e on u.employee_id = e.id \n" + //
                        "join resturant_management_project.designation as d on d.id = e.designation_id\n" + //
                        "join resturant_management_project.employeestatus as es on es.id = e.employeestatus_id and designation_id=?1;", nativeQuery = true)
        String[][] getUserByDesignation(Integer designationid);

        // get users by employee status
        @Query(value = "SELECT e.fullname, u.username, u.email, d.name, es.status FROM resturant_management_project.user as u \n"
                        + //
                        "join resturant_management_project.employee as e on u.employee_id = e.id \n" + //
                        "join resturant_management_project.designation as d on d.id = e.designation_id\n" + //
                        "join resturant_management_project.employeestatus as es on es.id = e.employeestatus_id and employeestatus_id=?1;\n"
                        + //
                        "", nativeQuery = true)
        String[][] getUserByStatus(Integer statusid);

        /* ###### INVENTORY STOCK REPORT ######## */

        @Query(value = "SELECT inv.batchnumber, i.ingredient_name, ut.name, sum(inv.availablequantity), i.reoder_point, invs.status FROM resturant_management_project.inventory as inv\n"
                        + //
                        "join resturant_management_project.ingredient as i on inv.ingredient_id = i.id\n" + //
                        "join resturant_management_project.unittype as ut on i.unittype_id = ut.id\n" + //
                        "join resturant_management_project.inventorystatus as invs on invs.id = inv.inventorystatus_id where date(i.addeddatetime)\n"
                        + //
                        "between ?1 and ?2  group by batchnumber;\n", nativeQuery = true)
        String[][] getInventoryStockDate(String startdate, String enddate);

        /* ###### Sales REPORT ######## */
        /*
         * // get sales summary by monthly
         * 
         * @Query(value =
         * "SELECT monthname(o.addeddatetime), s.submenu_code, s.name, c.name, sum(ohs.quantity), s.price, sum(s.price)  FROM resturant_management_project.order AS o \n"
         * + //
         * "JOIN resturant_management_project.order_has_submenu AS ohs ON o.id = ohs.order_id \n"
         * + //
         * "JOIN resturant_management_project.submenu AS s ON ohs.submenu_id = s.id \n"
         * + //
         * "join resturant_management_project.category as c on c.id = s.category_id\n" +
         * //
         * "WHERE DATE(o.addeddatetime) BETWEEN ?1 AND ?2 GROUP BY s.name;", nativeQuery
         * = true)
         * String[][] getSalesSummaryByMonthly(String startdate, String enddate);
         * 
         * // get sales summary by Weekly
         * 
         * @Query(value =
         * "SELECT weekday(o.addeddatetime), s.submenu_code, s.name, c.name, sum(ohs.quantity), s.price, sum(s.price)  FROM resturant_management_project.order AS o \n"
         * + //
         * "JOIN resturant_management_project.order_has_submenu AS ohs ON o.id = ohs.order_id \n"
         * + //
         * "JOIN resturant_management_project.submenu AS s ON ohs.submenu_id = s.id \n"
         * + //
         * "join resturant_management_project.category as c on c.id = s.category_id\n" +
         * //
         * "WHERE DATE(o.addeddatetime) BETWEEN ?1 AND ?2 GROUP BY s.name;", nativeQuery
         * = true)
         * String[][] getSalesSummaryByWeekly(String startdate, String enddate);
         * 
         * // get sales summary by Daily
         * 
         * @Query(value =
         * "SELECT  dayname(o.addeddatetime), s.submenu_code, s.name, c.name, sum(ohs.quantity), s.price, sum(s.price)  FROM resturant_management_project.order AS o \n"
         * + //
         * "JOIN resturant_management_project.order_has_submenu AS ohs ON o.id = ohs.order_id \n"
         * + //
         * "JOIN resturant_management_project.submenu AS s ON ohs.submenu_id = s.id \n"
         * + //
         * "join resturant_management_project.category as c on c.id = s.category_id\n" +
         * //
         * "WHERE DATE(o.addeddatetime) BETWEEN ?1 AND ?2 GROUP BY s.name;", nativeQuery
         * = true)
         * String[][] getSalesSummaryByDaily(String startdate, String enddate);
         */

}
