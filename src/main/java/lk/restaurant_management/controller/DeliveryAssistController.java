package lk.restaurant_management.controller;

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

import lk.restaurant_management.dao.DeliveryAssistDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.DeliveryAssist;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class DeliveryAssistController implements CommonController<DeliveryAssist> {
    @Autowired // generate instance for interface file
    private DeliveryAssistDao deliveryAssistDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Override
    // request mapping for load DeliveryAssist UI
    @RequestMapping(value = "/deliveryAssist")
    public ModelAndView UI() {
        // Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView deliveryAssistView = new ModelAndView();
        deliveryAssistView.setViewName("DeliveryAssist.html");
        deliveryAssistView.addObject("loggedusername", auth.getName());

        User loggeduser = userDao.getByUsername(auth.getName());
        deliveryAssistView.addObject("loggeduserphoto", loggeduser.getUserphoto());

        if (loggeduser.getEmployee_id() != null) {
            deliveryAssistView.addObject("loggedempname", loggeduser.getEmployee_id().getCallingname());
        } else {
            deliveryAssistView.addObject("loggedempname", "Admin");
        }
        deliveryAssistView.addObject("title", "BIT Project 2024 | Delivery Assist Management");

        return deliveryAssistView;
    }

    @Override // define mapping get all order status data -- URL [/deliveryAssist/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/deliveryAssist/alldata", produces = "application/json")
    public List<DeliveryAssist> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "DeliveryAssist");
        if (userPrivilege.getPrivi_select()) {
            return deliveryAssistDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override // request post mapping for save record [URL --> /deliveryAssist/insert]
    @PostMapping(value = "/deliveryAssist/insert", produces = "application/json")
    public String insertRecord(@RequestBody DeliveryAssist deliveryAssist) {
        throw new UnsupportedOperationException("Unimplemented method 'insertRecord'");
    }

    @Override // request post mapping for update record [URL --> /deliveryAssist/update]
    @PutMapping(value = "/deliveryAssist/update", produces = "application/json")
    public String updateRecord(@RequestBody DeliveryAssist deliveryAssist) {
        throw new UnsupportedOperationException("Unimplemented method 'updateRecord'");
    }

    @Override // request post mapping for delete record [URL --> /deliveryAssist/delete]
    @DeleteMapping(value = "/deliveryAssist/delete", produces = "application/json")
    public String deleteRecord(@RequestBody DeliveryAssist deliveryAssist) {
        throw new UnsupportedOperationException("Unimplemented method 'deleteRecord'");
    }

}
