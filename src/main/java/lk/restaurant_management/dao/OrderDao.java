package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Order;

public interface OrderDao extends JpaRepository<Order, Integer> {

    // query for get order by status id
    @Query(value = "SELECT os FROM Order os where os.orderstatus_id.id=?1")
    public List<Order> byStatus(Integer statusid);

    // coalesce eken default value ekak add krela thyagnna puluwn
    /*
     * coalesce(concat ('string', lpad(substring(max table.column name), substring
     * eka ptn gnna thana) + increment size, itemcode length, fill other places
     * with), 'default value')
     */
    @Query(value = "SELECT coalesce(concat('#' , lpad(substring(max(co.ordercode), 2) + 1, 9, 0)) , '#250000000')   FROM resturant_management_project.order as co;", nativeQuery = true)
    String getNextOrderCode();

    @Query(value = "SELECT * FROM resturant_management_project.order as o where  o.orderstatus_id=3 and o.customer_id=?1;", nativeQuery = true)
    public List<Order> byCustomer(Integer customerid);

    @Query(value = "SELECT os FROM Order os where os.orderstatus_id.id=1 or os.orderstatus_id.id=2 ")
    public List<Order> bystatusnewinprogres();

    // get orders by type takeaway
    @Query(value = "SELECT * FROM resturant_management_project.order as o where  o.orderstatus_id=3 and o.ordertype_id=2", nativeQuery = true)
    public List<Order> byTypeTakeaway();

    /*
     * // get order count by customers
     * 
     * @Query(value =
     * "SELECT count(o.ordercode) FROM resturant_management_project.order as o where o.customer_id=?1;"
     * , nativeQuery = true)
     * public List<Order> orderbyCount(Integer customerid);
     */

    // get order count by customers
    @Query(value = "SELECT count(o.ordercode) FROM resturant_management_project.order as o where o.customer_id=?1;", nativeQuery = true)
    public Integer orderbyCount(Integer customerid);
}