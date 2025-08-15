package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.IngredientDao;
import lk.restaurant_management.dao.IngredientStatusDao;
import lk.restaurant_management.dao.InventoryDao;
import lk.restaurant_management.dao.InventoryStatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Ingredient;
import lk.restaurant_management.entity.Inventory;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

//controller eke thyena implementation 
@RestController
public class IngredientController implements CommonController<Ingredient> {

    @Autowired
    private IngredientDao ingredientDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private IngredientStatusDao ingredientStatusDao;

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private InventoryStatusDao inventoryStatusDao;;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Override
    @RequestMapping(value = "/ingredient")
    public ModelAndView UI() {
        // AUTHENTICATION OBJECT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView ingredientView = new ModelAndView();
        ingredientView.setViewName("Ingredient.html");
        ingredientView.addObject("loggedusername", auth.getName());

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        ingredientView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            ingredientView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            ingredientView.addObject("loggedempname", "Admin");
        }

        ingredientView.addObject("title", "BIT Project 2024 | Ingredient Management");
        return ingredientView;
    }

    @Override
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/ingredient/alldata", produces = "application/json")
    public List<Ingredient> getAlldata() {

        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        if (userPrivilege.getPrivi_select()) {
            return ingredientDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
        // return ingredientDao.findAll();
    }

    // request mapping for load ingredient by given category id [ URL -->
    // /ingredient/bycategory?ingredientcategory_id=1 ]
    @GetMapping(value = "/ingredient/bycategory", params = { "ingredientcategory_id" }, produces = "application/json")
    public List<Ingredient> byCategory(@RequestParam("ingredientcategory_id") Integer categoryid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        if (userPrivilege.getPrivi_select()) {
            return ingredientDao.byCategory(categoryid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for get ingredient object --
    // URL[/ingredient/listwithoutsupply?supplierid= 2]
    @GetMapping(value = "/ingredient/listwithoutsupply", params = { "supplierid" }, produces = "application/json")
    public List<Ingredient> getIngredientListwithoutSupplier(@RequestParam("supplierid") Integer supplierid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        if (userPrivilege.getPrivi_select()) {
            return ingredientDao.getListwithoutSupplier(supplierid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for get ingredient object --
    // URL[/ingredient/listbysupplier?supplierid= 1]
    @GetMapping(value = "/ingredient/listbysupplier", params = { "supplierid" }, produces = "application/json")
    public List<Ingredient> getIngredientListBySupplier(@RequestParam("supplierid") Integer supplierid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        if (userPrivilege.getPrivi_select()) {
            return ingredientDao.getListBySupplier(supplierid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for get ingredient object --
    // URL[/ingredient/listbysupplierOrder?supplierorderid= 1]
    @GetMapping(value = "/ingredient/listbysupplierOrder", params = {
            "supplierorderid" }, produces = "application/json")
    public List<Ingredient> getIngredientListBySupplierOrder(@RequestParam("supplierorderid") Integer supplierorderid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        if (userPrivilege.getPrivi_select()) {
            return ingredientDao.getListBySupplierOrder(supplierorderid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/ingredient/insert")
    public String insertRecord(@RequestBody Ingredient ingredient) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        if (userPrivilege.getPrivi_insert()) {
            // check data Exist

            // dao layer eka hareha getByIngredientName method eka call krela Ingredient
            // Name eka
            // aregnnewa getIngredient_name() eken
            // e gnna name ekata Ingredient object ekak hdagnnw extIngredient kiyela
            Ingredient extIngredient = ingredientDao.getByIngredientName(ingredient.getIngredient_name());
            // extIngredient null ndda da blenewa
            if (extIngredient != null) {
                return "Entered Ingredient is Already exist.!";
            }

            try {
                // set auto generate value
                ingredient.setAddeddatetime(LocalDateTime.now());
                ingredient.setAddeduser(loggedUser.getId());
                ingredient.setCode(ingredientDao.getNextCode());

                // do save operation
                ingredientDao.save(ingredient);

                // manage dependancies

                return "OK";
            } catch (Exception e) {
                return "" + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @Override
    @PutMapping(value = "/ingredient/update")
    public String updateRecord(@RequestBody Ingredient ingredient) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        // check data Exist
        if (ingredient.getId() == null) {
            return "Update not Completed : Ingredient Not Exist.!";
        }
        // if exist
        if (userPrivilege.getPrivi_update()) {
            // check data duplicate
            Ingredient extIngredient = ingredientDao.getByIngredientName(ingredient.getIngredient_name());
            // existing ingredient name eka empty nowenm saha eke id eka aluthen dunna id
            // ekata samanath naththan
            if (extIngredient != null && extIngredient.getId() != ingredient.getId()) {
                return "Update not Completed : Entered Ingredient is Already exist.!";
            }
            try {
                // set auto generate value
                ingredient.setUpdatedatetime(LocalDateTime.now());
                ingredient.setUpdateuser(loggedUser.getId());

                // do save operation
                ingredientDao.save(ingredient);

                /* ### manage dependancies ### */
                /*
                 * Inventory exInventory = inventoryDao.getReferenceById(ingredient.getId());
                 * 
                 * if (ingredient.getIngredientstatus_id().getId() == 2) {
                 * exInventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(2));
                 * }
                 * if (ingredient.getIngredientstatus_id().getId() == 1) {
                 * exInventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(1));
                 * }
                 */

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    @Override
    @DeleteMapping(value = "/ingredient/delete")
    public String deleteRecord(@RequestBody Ingredient ingredient) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Ingredient");

        // check data Exist
        Ingredient extIng = ingredientDao.getReferenceById(ingredient.getId());
        if (extIng == null) {
            return "Delete not Completed : Ingredient Not Exist.!";
        }
        // check privilege exist
        if (userPrivilege.getPrivi_delete()) {
            try {
                // set auto generate value
                extIng.setDeletedatetime(LocalDateTime.now());
                extIng.setDeleteuser(userDao.getByUsername(auth.getName()).getId());
                extIng.setIngredientstatus_id(ingredientStatusDao.getReferenceById(3));

                // process Delete request
                ingredientDao.save(extIng);

                /* ### manage dependancies ### */
                Inventory exInventory = inventoryDao.getReferenceById(ingredient.getId());

                exInventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(3));

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }
}
