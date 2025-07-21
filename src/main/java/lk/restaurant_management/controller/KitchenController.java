package lk.restaurant_management.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.restaurant_management.dao.InventoryDao;
import lk.restaurant_management.dao.KitchenStatusDao;
import lk.restaurant_management.dao.OrderDao;
import lk.restaurant_management.dao.OrderstatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Inventory;
import lk.restaurant_management.entity.Order;
import lk.restaurant_management.entity.OrderHasIngredient;
import lk.restaurant_management.entity.OrderHasMenuitem;
import lk.restaurant_management.entity.OrderHasSubmenu;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class KitchenController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private KitchenStatusDao kitchenStatusDao;

    @Autowired
    private OrderstatusDao orderstatusDao;

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load kitchen UI
    @RequestMapping(value = "/kitchen")
    public ModelAndView KitchenUI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView KitchenView = new ModelAndView();
        KitchenView.setViewName("Kitchen.html");
        KitchenView.addObject("loggedusername", auth.getName());

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        KitchenView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            KitchenView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            KitchenView.addObject("loggedempname", "Admin");
        }
        KitchenView.addObject("title", "BIT Project 2024 | Manage Kitchen");
        return KitchenView;
    }

    @PutMapping(value = "/kitchen/inprogressStatus")
    public String updateRecord(@RequestBody Order order) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (userPrivilege.getPrivi_update()) {
            try {
                // order object ekak gennagnnewa orderdao layer eka hareha
                Order extOrder = orderDao.getReferenceById(order.getId());
                if (extOrder == null) {
                    return "sss";
                }

                order.setKitchenconfirmdatetime(LocalDateTime.now());
                order.setKitchenconfirmuser(loggedUser.getId());

                if (order.getKitchenstatus_id().getId().equals(1)) {
                    order.setKitchenstatus_id(kitchenStatusDao.getReferenceById(2));
                    order.setOrderstatus_id(orderstatusDao.getReferenceById(2));
                }

                // save operator
                // orderHasSubmenuList list ekata loop ekak dala read krela
                for (OrderHasSubmenu ohs : order.getOrderHasSubmenuList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    ohs.setOrder_id(order);
                }

                // OrderHasMenuitemList list ekata loop ekak dala read krela
                for (OrderHasMenuitem ohm : order.getOrderHasMenuitemList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    ohm.setOrder_id(order);
                }

                // getOrderHasIngredientList list ekata loop ekak dala read krela
                for (OrderHasIngredient ohi : order.getOrderHasIngredientList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    ohi.setOrder_id(order);
                }

                // do save
                orderDao.save(order);

                if (order.getKitchenstatus_id().getId().equals(2)) {
                    // ### manage dependancies ###
                    for (OrderHasIngredient ohi : order.getOrderHasIngredientList()) {
                        // get Existing inventory object from inventory dao layer
                        List<Inventory> extInventory = inventoryDao.byAvailableIng(ohi.getIngredient_id().getId());

                        // set available quantity to existing inventory object by substracting removed
                        // quantity of garbage remove
                        for (Inventory inty : extInventory) {
                            // 10-5
                            if (inty.getAvailablequantity().compareTo(ohi.getRequired_qty()) > -1) {
                                inty.setAvailablequantity(inty.getAvailablequantity().subtract(ohi.getRequired_qty()));
                                // save updated inventory object
                                inventoryDao.save(inty);
                                break;
                            }
                            if (inty.getAvailablequantity().compareTo(ohi.getRequired_qty()) == -1) {
                                ohi.setRequired_qty(ohi.getRequired_qty().subtract(inty.getAvailablequantity()));
                                inty.setAvailablequantity(BigDecimal.ZERO);
                                // save updated inventory object
                                inventoryDao.save(inty);

                            }

                        }

                    }
                }
                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    @PutMapping(value = "/kitchen/completedStatus")
    public String updateCompltedRecord(@RequestBody Order order) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (userPrivilege.getPrivi_update()) {
            try {
                // order object ekak gennagnnewa orderdao layer eka hareha
                Order extOrder = orderDao.getReferenceById(order.getId());
                if (extOrder == null) {
                    return "sss";
                }

                order.setKitchenconfirmdatetime(LocalDateTime.now());
                order.setKitchenconfirmuser(loggedUser.getId());

                if (order.getKitchenstatus_id().getId().equals(2)) {
                    order.setKitchenstatus_id(kitchenStatusDao.getReferenceById(3));
                    order.setOrderstatus_id(orderstatusDao.getReferenceById(3));
                }

                // save operator
                // orderHasSubmenuList list ekata loop ekak dala read krela
                for (OrderHasSubmenu ohs : order.getOrderHasSubmenuList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    ohs.setOrder_id(order);
                }

                // OrderHasMenuitemList list ekata loop ekak dala read krela
                for (OrderHasMenuitem ohm : order.getOrderHasMenuitemList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    ohm.setOrder_id(order);
                }

                // getOrderHasIngredientList list ekata loop ekak dala read krela
                for (OrderHasIngredient ohi : order.getOrderHasIngredientList()) {
                    // onebyone (sohi) illegena purchase order eka set krnw
                    ohi.setOrder_id(order);
                }

                // do save
                orderDao.save(order);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

}
