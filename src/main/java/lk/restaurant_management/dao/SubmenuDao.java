package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Submenu;

public interface SubmenuDao extends JpaRepository<Submenu, Integer> {

    // query for get submenu by category id
    @Query(value = "SELECT sc FROM Submenu sc where sc.category_id.id=?1")
    public List<Submenu> byCategory(Integer categoryid);

    // coalesce eken default value ekak add krela thyagnna puluwn
    /*
     * coalesce(concat ('string', lpad(substring(max table.column name), substring
     * eka ptn gnna thana) + increment size, itemcode length, fill other places
     * with), 'default value')
     */
    @Query(value = "SELECT coalesce(concat('#',lpad(substring(max(sm.submenu_code),2) + 1 , 7, 0)),'#2500000') FROM resturant_management_project.submenu as sm;", nativeQuery = true)
    public String getNextCode();

    @Query(value = "select sm from Submenu sm where sm.name=?1")
    Submenu getBySubmenuName(String name);
}
