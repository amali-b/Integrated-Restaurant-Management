package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.IngredientDao;
import lk.restaurant_management.dao.SupplierDao;
import lk.restaurant_management.dao.SupplierstatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Ingredient;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.Supplier;
import lk.restaurant_management.entity.User;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class SupplierController implements CommonController<Supplier> {
    @Autowired
    private SupplierDao supplierDao;
    @Autowired
    private IngredientDao ingredientDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;
    @Autowired
    private SupplierstatusDao supplierstatusDao;

    @Override
    // request mapping for load supplier UI
    @RequestMapping(value = "/supplier")
    public ModelAndView UI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView supplierView = new ModelAndView();
        supplierView.setViewName("Supplier.html");
        supplierView.addObject("title", "BIT Project 2024 | Supplier");

        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        supplierView.addObject("loggedusername", auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        supplierView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            supplierView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            supplierView.addObject("loggedempname", "Admin");
        }

        return supplierView;
    }

    @Override
    // define mapping get all supplier data -- URL [/supplier/alldata]
    @GetMapping(value = "/supplier/alldata", produces = "application/json")
    public List<Supplier> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");
        if (userPrivilege.getPrivi_select()) {
            return supplierDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for get supplier object -- URL[/supplier/getbyId?= id]
    @GetMapping(value = "/supplier/getbyId", params = { "id" }, produces = "application/json")
    public Supplier getSupplierbyId(@RequestParam("id") Integer id) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (userPrivilege.getPrivi_select()) {
            return supplierDao.getReferenceById(id);
        } else {
            // privilege naththan empty array ekak return krnw
            return new Supplier();
        }
    }

    @Override
    // ui(post) eken body(@Requestbody) eke ena json object eka java object ekak
    // bawata convert krenewa
    @PostMapping(value = "/supplier/insert")
    public String insertRecord(@RequestBody Supplier supplier) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (userPrivilege.getPrivi_insert()) {
            // check data Dupplicate
            Supplier extSupplier = supplierDao.getBySupplierName(supplier.getSupplier_name());
            if (extSupplier != null) {
                return "Save not Completed : Entered Supplier Already exist.!";
            }
            // dao layer eka hareha getByEmail method eka call krela Supplierge Email eka
            // aregnnewa getEmail() eken
            // e gnna email ekata Supplier object ekak hdagnnw extSupplierEmail kiyela
            Supplier extSupplierEmail = supplierDao.getByEmail(supplier.getEmail());
            // extSupplierEmail null ndda da blenewa
            if (extSupplierEmail != null) {
                // null naththan e dapu email ekt samana email ekk already thyenewa
                return "Save not Completed : Entered Email Already exist.!";
            }

            try {
                // set auto generate values
                supplier.setAddeddatetime(LocalDateTime.now());
                supplier.setAddeduser(loggedUser.getId());

                // Convert incoming ingredient list into managed entities
                Set<Ingredient> addedIngredients = supplier.getSupplyIngredients().stream()// Get Set<Ingredient> sent
                                                                                           // from the frontend
                        // For each ingredient i, it fetches a JPA-managed proxy of that Ingredient from
                        // the database using its ID.
                        .map(i -> ingredientDao.getReferenceById(i.getId()))// Map each one to a managed proxy by its ID
                        .collect(Collectors.toSet()); // Collects all the mapped Ingredient proxies into a Set
                supplier.setSupplyIngredients(addedIngredients);

                // do save operation
                supplierDao.save(supplier);

                return "OK";
            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @Override
    @PutMapping(value = "/supplier/update")
    public String updateRecord(@RequestBody Supplier supplier) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        // check data Exist
        if (supplier.getId() == null) {
            return "Update not Completed : Supplier Not Exist.!";
        }

        if (userPrivilege.getPrivi_update()) {
            // check data Dupplicate
            Supplier extSupplier = supplierDao.getBySupplierName(supplier.getSupplier_name());
            if (extSupplier != null && extSupplier.getId() != supplier.getId()) {
                return "Update not Completed : Entered Supplier Already exist.!";
            }
            Supplier extSupplierEmail = supplierDao.getByEmail(supplier.getEmail());
            // extSupplierEmail null ndda da blenewa
            if (extSupplierEmail != null && extSupplierEmail.getId() != supplier.getId()) {
                // null naththan e dapu email ekt samana email ekk already thyenewa
                return "Update not Completed : Entered Email Already exist.!";
            }
            try {
                // set auto generate values
                supplier.setUpdatedatetime(LocalDateTime.now());
                supplier.setUpdateuser(loggedUser.getId());

                // do save operation
                supplierDao.save(supplier);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }

    }

    @Override
    @DeleteMapping(value = "/supplier/delete")
    public String deleteRecord(@RequestBody Supplier supplier) {
        // check loged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        // check data Exist
        Supplier extsupplier = supplierDao.getReferenceById(supplier.getId());
        if (extsupplier == null) {
            return "Delete not Completed : Supplier Not Exist.!";
        }
        // check privilege exist
        if (userPrivilege.getPrivi_delete()) {

            try {
                // remove links to ingredients
                extsupplier.getSupplyIngredients().clear();

                // set auto generate value
                extsupplier.setDeletedatetime(LocalDateTime.now());
                extsupplier.setDeleteuser(loggedUser.getId());
                extsupplier.setSupplierstatus_id(supplierstatusDao.getReferenceById(3));

                // process Delete request
                supplierDao.save(extsupplier);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }
}
