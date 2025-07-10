package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.OrderPayment;

public interface OrderPaymentDao extends JpaRepository<OrderPayment, Integer> {

    // coalesce eken default value ekak add krela thyagnna puluwn
    /*
     * coalesce(concat ('string', lpad(substring(max table.column name), substring
     * eka ptn gnna thana) + increment size, itemcode length, fill other places
     * with), 'default value')
     */

    @Query(value = "SELECT coalesce(concat('#OP', lpad(substring(max(op.code), 4)+1, 7, 0)), '#OP2500000') FROM resturant_management_project.orderpayment as op;", nativeQuery = true)
    String getByNextCode();

}
