package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.SupplierOrderDao;
import lk.restaurant_management.dao.SupplyOrderStatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.SupplierOrder;
import lk.restaurant_management.entity.SupplierorderHasIngredient;
import lk.restaurant_management.entity.User;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class SupplierOrderController implements CommonController<SupplierOrder> {

    @Autowired // create instance for SupplierOrderDao //interface walin instance gnna bri nisa
    private SupplierOrderDao supplierOrderDao;
    @Autowired
    private SupplyOrderStatusDao supplyOrderStatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Override
    // request mapping for load purchase order UI
    @RequestMapping(value = "/supplierorder")
    public ModelAndView UI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView supplierOrderView = new ModelAndView();
        supplierOrderView.setViewName("SupplierOrder.html");
        supplierOrderView.addObject("loggedusername", auth.getName());

        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        supplierOrderView.addObject("loggeduserphoto", user.getUserphoto());

        // log wela inna user ge username eka set krenewa
        supplierOrderView.addObject("loggedusername", auth.getName());

        if (user.getEmployee_id() != null) {
            supplierOrderView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            supplierOrderView.addObject("loggedempname", "Admin");
        }

        supplierOrderView.addObject("title", "BIT Project 2024 | Manage Purchase Orders ");
        return supplierOrderView;
    }

    @Override
    // define mapping get all supplierOrder data -- URL [/supplierorder/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/supplierorder/alldata", produces = "application/json")
    public List<SupplierOrder> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Order");

        if (userPrivilege.getPrivi_select()) {
            // last record eka udinma thyagnna one nisa sort krenewa property eka lesa
            // primary key eka use krl // id eka auto increment nisa return
            return supplierOrderDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/supplierorder/insert")
    public String insertRecord(@RequestBody SupplierOrder supplierOrder) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Order");

        if (userPrivilege.getPrivi_insert()) {
            try {
                // set auto generate value
                supplierOrder.setAddeduser(loggedUser.getId());
                supplierOrder.setAddeddatetime(LocalDateTime.now());
                supplierOrder.setOrdercode(supplierOrderDao.getNextOrderCode());

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // supplierorder_id nathuwa submit kranna ba

                // SupplierorderHasIngredientList list ekata loop ekak dala read krela
                for (SupplierorderHasIngredient sohi : supplierOrder.getSupplierorderHasIngredientList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    sohi.setSupplierorder_id(supplierOrder);
                }
                // do save
                supplierOrderDao.save(supplierOrder);

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @Override
    @PutMapping(value = "/supplierorder/update")
    public String updateRecord(@RequestBody SupplierOrder supplierOrder) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Order");

        if (userPrivilege.getPrivi_update()) {
            try {
                // check data duplicate

                // set auto generate value
                supplierOrder.setUpdateuser(loggedUser.getId());
                supplierOrder.setUpdatedatetime(LocalDateTime.now());

                // SupplierorderHasIngredientList list ekata loop ekak dala read krela
                for (SupplierorderHasIngredient sohi : supplierOrder.getSupplierorderHasIngredientList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    sohi.setSupplierorder_id(supplierOrder);
                }

                // do save operation
                supplierOrderDao.save(supplierOrder);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    @Override
    @DeleteMapping(value = "/supplierorder/delete")
    public String deleteRecord(@RequestBody SupplierOrder supplierOrder) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Order");

        if (userPrivilege.getPrivi_delete()) {
            // check data Exist
            SupplierOrder extSupOrder = supplierOrderDao.getReferenceById(supplierOrder.getId());
            if (extSupOrder == null) {
                return "Purchase Order Not Exist.!";
            }
            try {
                // set auto generate value
                extSupOrder.setDeleteuser(loggedUser.getId());
                extSupOrder.setDeletedatetim(LocalDateTime.now());
                extSupOrder.setSupplyorderstatus_id(supplyOrderStatusDao.getReferenceById(3));

                // SupplierorderHasIngredientList list ekata loop ekak dala read krela
                for (SupplierorderHasIngredient sohi : supplierOrder.getSupplierorderHasIngredientList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    sohi.setSupplierorder_id(supplierOrder);
                }
                // do save operation
                supplierOrderDao.save(extSupOrder);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }

}
