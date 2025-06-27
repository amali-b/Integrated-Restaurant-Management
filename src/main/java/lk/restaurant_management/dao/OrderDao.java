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

}
