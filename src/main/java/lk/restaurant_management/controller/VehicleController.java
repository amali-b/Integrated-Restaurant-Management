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

import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.dao.VehicleDao;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;
import lk.restaurant_management.entity.Vehicle;

@RestController
public class VehicleController implements CommonController<Vehicle> {
    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Override
    @RequestMapping(value = "/vehicle") // request mapping for load vehicle UI
    public ModelAndView UI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView vehicleView = new ModelAndView();
        vehicleView.setViewName("Vehicle.html");

        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        vehicleView.addObject("loggedusername", auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        vehicleView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            vehicleView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            vehicleView.addObject("loggedempname", "Admin");
        }

        vehicleView.addObject("title", "BIT Project 2024 | Manage Vehicle ");
        return vehicleView;
    }

    @Override
    @GetMapping(value = "/vehicle/alldata", produces = "application/json")
    public List<Vehicle> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");

        if (userPrivilege.getPrivi_select()) {
            return vehicleDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/vehicle/insert")
    public String insertRecord(@RequestBody Vehicle vehicle) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");
        if (userPrivilege.getPrivi_insert()) {
            try {
                // do save
                vehicleDao.save(vehicle);

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }

    }

    @Override
    @PutMapping(value = "/vehicle/update")
    public String updateRecord(@RequestBody Vehicle vehicle) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");
        if (userPrivilege.getPrivi_update()) {
            try {
                // do save
                vehicleDao.save(vehicle);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }

    }

    @Override
    @DeleteMapping(value = "/vehicle/delete")
    public String deleteRecord(@RequestBody Vehicle vehicle) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");
        if (userPrivilege.getPrivi_delete()) {
            Vehicle extVehicle = vehicleDao.getReferenceById(vehicle.getId());
            if (extVehicle == null) {
                return "Delete not Completed : Vehicle Not Exist.!";
            }
            try {
                // do save
                vehicleDao.save(extVehicle);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }

    }

}
