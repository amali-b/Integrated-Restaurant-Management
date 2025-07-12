package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.SupplierOrder;

public interface ReportDao extends JpaRepository<SupplierOrder, Integer> {

        // get total amount of purchase order of previous six month
        @Query(value = "SELECT year(so.addeddatetime), monthname(so.addeddatetime), sum(so.totalamount) FROM resturant_management_project.supplierorder \n"
                        + //
                        "    as so where date(so.addeddatetime) between current_date()- interval 6 month and current_date() group by monthname(so.addeddatetime);", nativeQuery = true)
        String[][] getPaymentByPriviousSixMonth();

        // to get total amount of given daterange by monthly
        @Query(value = "SELECT year(so.addeddatetime), monthname(so.addeddatetime), sum(so.totalamount) FROM resturant_management_project.supplierorder as \n"
                        + //
                        "    so where date(so.addeddatetime) between ?1 and ?2 group by monthname(so.addeddatetime);", nativeQuery = true)
        String[][] getPaymentByMonthly(String strartdate, String enddate);

        @Query(value = "SELECT year(so.addeddatetime), week(so.addeddatetime), sum(so.totalamount) FROM resturant_management_project.supplierorder as \n"
                        + //
                        "so where date(so.addeddatetime) between current_date()- interval 6 month and current_date() group by week(so.addeddatetime);", nativeQuery = true)
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

}
