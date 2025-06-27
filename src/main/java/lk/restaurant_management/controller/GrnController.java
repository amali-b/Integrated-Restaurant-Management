package lk.restaurant_management.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.GrnDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Grn;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class GrnController implements CommonController<Grn> {
    @Autowired
    private GrnDao grnDao;

    @Autowired
    private UserDao userDao;

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
    public String insertRecord(@RequestBody Grn grn) {

        throw new UnsupportedOperationException("Unimplemented method 'insertRecord'");

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
    }

    @Override
    public String updateRecord(@RequestBody Grn grn) {

        throw new UnsupportedOperationException("Unimplemented method 'updateRecord'");
    }

    @Override
    public String deleteRecord(@RequestBody Grn grn) {

        throw new UnsupportedOperationException("Unimplemented method 'deleteRecord'");
    }
}
