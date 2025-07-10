package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Grn;

public interface GrnDao extends JpaRepository<Grn, Integer> {

    // coalesce eken default value ekak add krela thyagnna puluwn
    /*
     * coalesce(concat ('string', lpad(substring(max table.column name), substring
     * eka ptn gnna thana) + increment size, itemcode length, fill other places
     * with), 'default value')
     */
    @Query(value = "SELECT coalesce(concat( 'GRN', lpad(substring(max(g.grnnumber), 4) + 1, 7, 0)), 'GRN2500000') FROM resturant_management_project.grn as g;", nativeQuery = true)
    String getNextGrnNumber();

    /* To get grn by selected supplier where grn netamount != grn paidamount */

    // @Query(value = "select g from Grn g where
    // g.supplierorder_id.supplier_id.id=?1 and g.netamount<>g.paidamount")
    @Query(value = "SELECT * FROM resturant_management_project.grn  as g WHERE g.supplierorder_id IN ( SELECT so.id FROM supplierorder as so WHERE so.supplier_id=?1) AND g.netamount != g.paidamount;", nativeQuery = true)
    public List<Grn> getGrnBySupplierDue(Integer supplierid);
}
