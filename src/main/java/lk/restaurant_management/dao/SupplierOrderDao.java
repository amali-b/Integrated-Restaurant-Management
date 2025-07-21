package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.SupplierOrder;

public interface SupplierOrderDao extends JpaRepository<SupplierOrder, Integer> {

    // coalesce eken default value ekak add krela thyagnna puluwn
    /*
     * coalesce(concat ('string', lpad(substring(max table.column name), substring
     * eka ptn gnna thana) + increment size, itemcode length, fill other places
     * with), 'default value')
     */
    @Query(value = "SELECT coalesce(concat('SO',lpad(substring(max(supo.ordercode),3) + 1 , 8, 0)),'SO25000000') FROM resturant_management_project.supplierorder as supo;", nativeQuery = true)
    String getNextOrderCode();

    @Query(value = "SELECT * FROM resturant_management_project.supplierorder as so where so.supplyorderstatus_id=1;", nativeQuery = true)
    public List<SupplierOrder> getSupplierorderByPendingStatus();

}
