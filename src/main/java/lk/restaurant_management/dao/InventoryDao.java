package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Inventory;

public interface InventoryDao extends JpaRepository<Inventory, Integer> {

    // get next batchnumber
    @Query(value = "SELECT concat('BNO', lpad(substring(max(inv.batchnumber),4)+1,4,0)) FROM resturant_management_project.inventory as inv where inv.batchnumber like'BNO%';", nativeQuery = true)
    String getNextBatchNumber();

    // inventory eken thyena batchnumber ekai ingredient ekai aregnnawa
    @Query(value = "SELECT * FROM resturant_management_project.inventory as inv where inv.ingredient_id=?1 and inv.batchnumber=?2", nativeQuery = true)
    Inventory getByIngredientBatchNumber(Integer id, String batchnumber);

    // get inventory object from availvable qty
    @Query(value = "SELECT * FROM resturant_management_project.inventory as inv where inv.expiredate > current_date() and inv.availablequantity > 0  and inv.ingredient_id=?1;", nativeQuery = true)
    List<Inventory> byAvailableIng(Integer ingredientid);

}
