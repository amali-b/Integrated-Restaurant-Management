package lk.restaurant_management.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
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

import lk.restaurant_management.dao.GrnDao;
import lk.restaurant_management.dao.InventoryDao;
import lk.restaurant_management.dao.InventoryStatusDao;
import lk.restaurant_management.dao.SupplierOrderDao;
import lk.restaurant_management.dao.SupplyOrderStatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Grn;
import lk.restaurant_management.entity.GrnHasIngredient;
import lk.restaurant_management.entity.Inventory;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.SupplierOrder;
import lk.restaurant_management.entity.SupplierorderHasIngredient;
import lk.restaurant_management.entity.User;

@RestController
public class GrnController implements CommonController<Grn> {
    @Autowired
    private GrnDao grnDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private InventoryStatusDao inventoryStatusDao;

    @Autowired
    private SupplierOrderDao supplierOrderDao;

    @Autowired
    private SupplyOrderStatusDao supplyOrderStatusDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Override
    @RequestMapping(value = "/grn")
    public ModelAndView UI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView GrnView = new ModelAndView();
        GrnView.setViewName("Grn.html");
        GrnView.addObject("loggedusername", auth.getName());
        GrnView.addObject("title", "BIT Project 2024 | Grn");

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        GrnView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            GrnView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            GrnView.addObject("loggedempname", "Admin");
        }

        return GrnView;
    }

    @Override
    @GetMapping(value = "/grn/alldata", produces = "application/json")
    public List<Grn> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
        if (userPrivilege.getPrivi_select()) {
            return grnDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for get grns by supplier object path param-->
    // URL[/grn/listbysupplier/1]
    // @GetMapping(value = "/grn/listbysupplierdueamount/{supplierid}", produces =
    // "application/json")
    // public List<Grn> getGrnListBySupplierDueAmount(@PathVariable("supplierid")
    // Integer supplierid)
    @GetMapping(value = "/grn/listbysupplierdueamount", params = { "supplierid" }, produces = "application/json")
    public List<Grn> getGrnListBySupplierDueAmount(@RequestParam("supplierid") Integer supplierid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (userPrivilege.getPrivi_select()) {
            return grnDao.getGrnBySupplierDue(supplierid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/grn/insert")
    public String insertRecord(@RequestBody Grn grn) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
        if (userPrivilege.getPrivi_insert()) {
            try {
                // set auto generate value
                grn.setAddeduser(loggedUser.getId());
                grn.setAddeddatetime(LocalDateTime.now());
                grn.setGrnnumber(grnDao.getNextGrnNumber());
                grn.setPaidamount(BigDecimal.ZERO);

                // save operator -->
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // grn_id nathuwa submit kranna ba

                // GrnHasIngredientList list ekata loop ekak dala read krela
                for (GrnHasIngredient ghi : grn.getGrnHasIngredientList()) {
                    // onebyone (ghi) illegena purchase order eka set krnw
                    ghi.setGrn_id(grn);
                }
                // do save
                grnDao.save(grn);

                // manage dependancies
                // getGrnHasIngredientList list ekata loop ekak dala read krnewa
                // illegnnewa
                for (GrnHasIngredient ghi : grn.getGrnHasIngredientList()) {
                    // ( batchnumber eka fontend eken ewela thyennath puluwn & nathi wennath puluwn
                    // nisa fontend eken batchnumber ekak ewelad ndda kyl check kranna one..)
                    // expire date nathi ewata batchnumber ekak na

                    // 1 --> batch number ekak naththan
                    if (ghi.getBatchnumber() == null) {
                        // create new inventory object
                        Inventory newInventory = new Inventory();
                        newInventory.setBatchnumber(inventoryDao.getNextBatchNumber());// set batchnumber
                        // set expire date after 14 days from currentdate
                        newInventory.setExpiredate(LocalDate.now().plusDays(14));
                        newInventory.setManufacturedate(LocalDate.now()); // set manuf date as currentdate
                        newInventory.setAvailablequantity(ghi.getQuantity()); // set available quantity
                        newInventory.setTotalquantity(ghi.getQuantity());
                        newInventory.setRemovedquantity(BigDecimal.ZERO);
                        newInventory.setIngredient_id(ghi.getIngredient_id());
                        // inventory eke status eka set krenewa available kyl
                        newInventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(1));

                        // save inventory record
                        inventoryDao.save(newInventory);

                        // 2 --> batchnumber ekak thyenewanm
                    } else {
                        Inventory extInventory = inventoryDao.getByIngredientBatchNumber(ghi.getIngredient_id().getId(),
                                ghi.getBatchnumber());

                        // A ---> inventory eke exit wenawanm
                        if (extInventory != null) {
                            extInventory
                                    .setAvailablequantity(extInventory.getAvailablequantity().add(ghi.getQuantity()));
                            extInventory.setTotalquantity(extInventory.getTotalquantity().add(ghi.getQuantity()));
                            // inventory eke status eka set krenewa available kyl
                            extInventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(1));

                            inventoryDao.save(extInventory);

                            // B --> inventory eke exit wenne naththan
                        } else {
                            // create new inventory object
                            Inventory newInventory = new Inventory();
                            newInventory.setBatchnumber(ghi.getBatchnumber());// set batchnumber
                            // set expire date after 14 days from currentdate
                            newInventory.setExpiredate(LocalDate.now().plusDays(14));
                            newInventory.setManufacturedate(LocalDate.now()); // set manuf date as currentdate
                            newInventory.setAvailablequantity(ghi.getQuantity()); // set available quantity
                            newInventory.setTotalquantity(ghi.getQuantity());
                            newInventory.setRemovedquantity(BigDecimal.ZERO);
                            newInventory.setIngredient_id(ghi.getIngredient_id());
                            // inventory eke status eka set krenewa available kyl
                            newInventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(1));

                            // save inventory record
                            inventoryDao.save(newInventory);
                        }
                    }

                    // manage Dependencies
                    // supplierOrder object ekak hdagnnewa supplierOrderDao layer eka hareha
                    // reference eken supplierorder id eka illagenawa
                    SupplierOrder supplierorder = supplierOrderDao.getReferenceById(grn.getSupplierorder_id().getId());

                    if (grn.getGrnstatus_id().getId() == 1) {
                        supplierorder.setSupplyorderstatus_id(supplyOrderStatusDao.getReferenceById(2));
                    }
                    if (grn.getGrnstatus_id().getId() == 3) {
                        supplierorder.setSupplyorderstatus_id(supplyOrderStatusDao.getReferenceById(3));
                    }

                    // getSupplierorderHasIngredientList list ekata loop ekak dala read krela
                    for (SupplierorderHasIngredient sohi : supplierorder.getSupplierorderHasIngredientList()) {
                        // onebyone (sohi) illegena purchase order eka set krnw
                        sohi.setSupplierorder_id(supplierorder);
                    }
                    // supplierOrder object eka database ekata save krenewa
                    supplierOrderDao.save(supplierorder);

                }
                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    @Override
    @PutMapping(value = "/grn/update")
    public String updateRecord(@RequestBody Grn grn) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (userPrivilege.getPrivi_update()) {
            try {
                // check data duplicate

                // set auto generate value
                grn.setUpdateuser(loggedUser.getId());
                grn.setUpdatedatetime(LocalDateTime.now());

                // save operator -->
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // grn_id nathuwa submit kranna ba

                // GrnHasIngredientList list ekata loop ekak dala read krela
                for (GrnHasIngredient ghi : grn.getGrnHasIngredientList()) {
                    // onebyone (ghi) illegena purchase order eka set krnw
                    ghi.setGrn_id(grn);
                }
                // do save
                grnDao.save(grn);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    @Override
    @DeleteMapping(value = "/grn/delete")
    public String deleteRecord(@RequestBody Grn grn) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        // check data Exist
        Grn extGrn = grnDao.getReferenceById(grn.getId());
        if (extGrn == null) {
            return "GRN Not Exist.!";
        }
        // check privilege exist
        if (userPrivilege.getPrivi_delete()) {
            try {
                // set auto generate value
                extGrn.setDeleteuser(loggedUser.getId());
                extGrn.setDeletedatetime(LocalDateTime.now());

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // grn_id nathuwa submit kranna ba

                // GrnHasIngredientList list ekata loop ekak dala read krela
                for (GrnHasIngredient ghi : grn.getGrnHasIngredientList()) {
                    // onebyone (ghi) illegena purchase order eka set krnw
                    ghi.setGrn_id(grn);
                }
                // do save
                grnDao.save(extGrn);

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
            return "OK";
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }
}
