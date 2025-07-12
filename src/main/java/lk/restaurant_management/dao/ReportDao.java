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

        // get sales summary of past 6 months by orders

        @Query(value = "SELECT sum(o.netamount) FROM resturant_management_project.order as o where date(o.addeddatetime) between current_date()-interval 7 day and current_date();", nativeQuery = true)
        String[][] getOrderByPriviousLastweek();

        // get top selling items of past week
        /* 
         * 
         */

}
