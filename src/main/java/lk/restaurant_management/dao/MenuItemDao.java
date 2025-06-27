package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.MenuItem;

public interface MenuItemDao extends JpaRepository<MenuItem, Integer> {

    // coalesce eken default value ekak add krela thyagnna puluwn
    /*
     * coalesce(concat ('string', lpad(substring(max table.column name), substring
     * eka ptn gnna thana) + increment size, itemcode length, fill other places
     * with), 'default value')
     */
    @Query(value = "SELECT coalesce(concat('#MI',lpad(substring(max(mi.code),4) + 1 , 7, 0)),'#MI0000000') FROM resturant_management_project.menuitems as mi;", nativeQuery = true)
    String getNextMenuCode();

    @Query(value = "Select mi from MenuItem mi where mi.name=?1")
    MenuItem getByMenuName(String name);
}
