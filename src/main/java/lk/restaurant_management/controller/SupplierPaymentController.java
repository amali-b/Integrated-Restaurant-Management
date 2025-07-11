package lk.restaurant_management.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.GrnDao;
import lk.restaurant_management.dao.GrnstatusDao;
import lk.restaurant_management.dao.SupplierPaymentDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Grn;
import lk.restaurant_management.entity.GrnHasIngredient;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.SupplierPayment;
import lk.restaurant_management.entity.User;

@RestController
public class SupplierPaymentController {
    @Autowired // generate instance for interface file
    private SupplierPaymentDao supplierPaymentDao;
    @Autowired
    private GrnDao grnDao;
    @Autowired
    private GrnstatusDao grnstatusDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load supplierPayment UI
    @RequestMapping(value = "/supplierpayment")
    public ModelAndView UI() {
        // Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView object
        ModelAndView supplierPaymentView = new ModelAndView();
        supplierPaymentView.setViewName("SupplierPayment.html");
        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        supplierPaymentView.addObject("loggedusername", auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        supplierPaymentView.addObject("loggeduserphoto", user.getUserphoto());

        // Html title eka wdyt pennannewa
        supplierPaymentView.addObject("title", "BIT Project 2024 | Supplier Payment Management");

        // log una user ta employee id ekk thiyenewanm
        if (user.getEmployee_id() != null) {
            supplierPaymentView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            supplierPaymentView.addObject("loggedempname", "Admin");
        }

        return supplierPaymentView;
    }

    // define mapping get all supplierpayment data -- URL [/supplierPayment/alldata]
    @GetMapping(value = "/supplierpayment/alldata", produces = "application/json")
    public List<SupplierPayment> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Payment");
        if (userPrivilege.getPrivi_select()) {
            return supplierPaymentDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request post mapping for save record [URL --> /supplierpayment/insert]
    @PostMapping(value = "/supplierpayment/insert", produces = "application/json")
    public String insertRecord(@RequestBody SupplierPayment supplierpayment) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Payment");
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());

        // check privilege
        if (userPrivilege.getPrivi_insert()) {
            try {
                // set auto generate value
                supplierpayment.setAddeduser(loggedUser.getId());
                supplierpayment.setAddeddatetime(LocalDateTime.now());
                supplierpayment.setPaymentnumber(supplierPaymentDao.getByNextNumber());

                // do save
                supplierPaymentDao.save(supplierpayment);

                // manage Dependencies
                // grn object ekak hdagnnewa grndao layer eka hareha reference eken grn id eka
                // illagena
                Grn grn = grnDao.getReferenceById(supplierpayment.getGrn_id().getId());

                // grn eke paidamount eka update krenewa payment amount eka add krela
                grn.setPaidamount(grn.getPaidamount().add(supplierpayment.getPaidamount()));

                if (grn.getNetamount() != grn.getPaidamount()) {
                    grn.setGrnstatus_id(grnstatusDao.getReferenceById(2));
                }
                if (grn.getNetamount() == grn.getPaidamount()) {
                    grn.setGrnstatus_id(grnstatusDao.getReferenceById(3));
                }

                // GrnHasIngredientList list ekata loop ekak dala read krela
                for (GrnHasIngredient ghi : grn.getGrnHasIngredientList()) {
                    // onebyone (ghi) illegena purchase order eka set krnw
                    ghi.setGrn_id(grn);
                }

                // grn object eka database ekata save krenewa ingredient list ekth ekkama
                grnDao.save(grn);

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

    // request post mapping for update record [URL --> /supplierpayment/update]
    /*
     * @PutMapping(value = "/supplierpayment/update", produces = "application/json")
     * public String updateRecord(@RequestBody SupplierPayment supplierpayment) {
     * // check user authorization
     * Authentication auth = SecurityContextHolder.getContext().getAuthentication();
     * // get privilege object
     * Privilege userPrivilege =
     * userPrivilegeController.getPrivilegeByUserModule(auth.getName(),
     * "Supplier Payment");
     * 
     * if (userPrivilege.getPrivi_update()) {
     * try {
     * 
     * // Update the supplier payment record
     * supplierPaymentDao.save(supplierpayment);
     * 
     * return "OK";
     * 
     * } catch (Exception e) {
     * return "Update not Completed : " + e.getMessage();
     * }
     * } else {
     * return "Couldn't Complete Update : You don't have permission..!";
     * }
     * }
     */

}
