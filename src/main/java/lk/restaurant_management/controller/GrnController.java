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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.GrnDao;
import lk.restaurant_management.dao.GrnstatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Grn;
import lk.restaurant_management.entity.GrnHasIngredient;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class GrnController implements CommonController<Grn> {
    @Autowired
    private GrnDao grnDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GrnstatusDao grnstatusDao;

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

        User user = userDao.getByUsername(auth.getName());
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

                // inventory eka uodate wenna one
                /*
                 * 1 --> grn has ingredient eke thyena batchnumber ekak thiyenm
                 * if (batchnumber != ""){
                 * //ekata samana batch number ekak inventory eketh thiyenewanm
                 * if(batchnumber){
                 * // e adala batch number eka thyena ingredient eke quantity eka update wenna
                 * one thyena quantity ekata add wela
                 * }else{
                 * // batch number ekata samana ekak invetory eke naththam aluthen record ekak
                 * add wela intory eka update wenna one
                 * }
                 * 
                 * 2--> grn has ingredient eke batch number ekak naththan
                 * else{
                 * // ekko system eka visin number ekak automatically iniciate wenw
                 * if(){
                 * }
                 * // naththan user ta puluwn manually batchnumber ekak add kranna
                 * else{
                 * }
                 * }
                 */
            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
            return "OK";
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

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
            return "OK";
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
        Grn ExtGrn = grnDao.getReferenceById(grn.getId());
        if (ExtGrn == null) {
            return "GRN Not Exist.!";
        }
        // check privilege exist
        if (userPrivilege.getPrivi_delete()) {
            try {
                // set auto generate value
                ExtGrn.setDeleteuser(loggedUser.getId());
                ExtGrn.setDeletedatetime(LocalDateTime.now());
                ExtGrn.setGrnstatus_id(grnstatusDao.getReferenceById(2));

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // grn_id nathuwa submit kranna ba

                // GrnHasIngredientList list ekata loop ekak dala read krela
                for (GrnHasIngredient ghi : grn.getGrnHasIngredientList()) {
                    // onebyone (ghi) illegena purchase order eka set krnw
                    ghi.setGrn_id(grn);
                }
                // do save
                grnDao.save(ExtGrn);

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
            return "OK";
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }
}
