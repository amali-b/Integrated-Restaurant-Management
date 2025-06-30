package lk.restaurant_management.dao;

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
    @Query(value = "SELECT coalesce(concat( 'GRN', lpad(substring(max(g.grnnumber), 4) + 1, 7, 0)), 'GRN25000000') FROM resturant_management_project.grn as g;", nativeQuery = true)
    String getNextGrnNumber();
}
