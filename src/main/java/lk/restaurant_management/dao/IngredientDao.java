package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Ingredient;

public interface IngredientDao extends JpaRepository<Ingredient, Integer> {

    // query for get submenu by category id
    @Query(value = "SELECT i FROM Ingredient i where i.ingredientcategory_id.id=?1")
    public List<Ingredient> byCategory(Integer categoryid);

    // @Query(value = "select i.ingredient_name from
    // resturant_management_project.ingredient as i;", nativeQuery = true)
    @Query(value = "select i from Ingredient i where i.ingredient_name=?1")
    Ingredient getByIngredientName(String ingredient_name);

    // Item + lpad(substring(max(i.code),5) + 1, 6, '0') --> "Item" + 000000 =
    // Item000000
    // coalesce eken default value ekak set krenewa value ekkwth naththan
    @Query(value = "SELECT coalesce(concat('Item',lpad(substring(max(i.code),5) + 1 , 6, '0' )),'Item000001') FROM resturant_management_project.ingredient as i;", nativeQuery = true)
    String getNextCode();

    // supplier has ingredient table eke nathi ingredient id tika filter kregnnawa
    @Query(value = "select i from Ingredient i where i.id not in (select shi.ingredient_id.id from SupplierHasIngredient shi where shi.supplier_id.id=?1)")
    public List<Ingredient> getListwithoutSupplier(Integer supplierid);

    // supplier has ingredient table eke thyena ingredient id tika filter kregnnawa
    @Query(value = "select new Ingredient(i.id, i.ingredient_name, i.purchase_price, i.unittype_id) from Ingredient i where i.id in (select shi.ingredient_id.id from SupplierHasIngredient shi where shi.supplier_id.id=?1)")
    public List<Ingredient> getListBySupplier(Integer supplierid);

}
