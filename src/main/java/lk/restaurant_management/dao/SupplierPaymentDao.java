package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.SupplierPayment;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer> {

    // coalesce eken default value ekak add krela thyagnna puluwn
    /*
     * coalesce(concat ('string', lpad(substring(max table.column name), substring
     * eka ptn gnna thana) + increment size, itemcode length, fill other places
     * with), 'default value')
     */

    @Query(value = "SELECT coalesce(concat( 'SP', lpad(substring(max(sp.paymentnumber), 3)+1, 8, 0)), 'SP25000000') FROM resturant_management_project.supplierpayment as sp;", nativeQuery = true)
    String getByNextNumber();

}
