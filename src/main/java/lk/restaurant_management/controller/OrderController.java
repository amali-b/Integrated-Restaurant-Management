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

import lk.restaurant_management.dao.OrderDao;
import lk.restaurant_management.dao.OrderstatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Order;
import lk.restaurant_management.entity.OrderHasMenuitem;
import lk.restaurant_management.entity.OrderHasSubmenu;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class OrderController implements CommonController<Order> {
    @Autowired
    private OrderstatusDao orderstatusDao;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Override
    // request mapping for load order UI
    @RequestMapping(value = "/order")
    public ModelAndView UI() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView OrderView = new ModelAndView();
        OrderView.setViewName("Order.html");
        OrderView.addObject("loggedusername", auth.getName());

        // create user object
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        OrderView.addObject("loggeduserphoto", user.getUserphoto());

        if (user.getEmployee_id() != null) {
            OrderView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            OrderView.addObject("loggedempname", "Admin");
        }
        OrderView.addObject("title", "BIT Project 2024 | Manage Orders");
        return OrderView;
    }

    // request mapping for load order UI
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

    // request mapping for load order UI Dine In
    @RequestMapping(value = "/orderDinein")
    public ModelAndView UIDineIn() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView OrderView = new ModelAndView();
        OrderView.setViewName("OrderDinein.html");
        OrderView.addObject("loggedusername", auth.getName());

        User user = userDao.getByUsername(auth.getName());
        if (user.getEmployee_id() != null) {
            OrderView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            OrderView.addObject("loggedempname", "Admin");
        }
        OrderView.addObject("title", "BIT Project 2024 | Orders Dine-In");
        return OrderView;
    }

    // request mapping for load order UI Takeaway
    @RequestMapping(value = "/orderTakeaway")
    public ModelAndView UITakeaway() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView OrderView = new ModelAndView();
        OrderView.setViewName("OrderTakeaway.html");
        OrderView.addObject("loggedusername", auth.getName());

        User user = userDao.getByUsername(auth.getName());
        if (user.getEmployee_id() != null) {
            OrderView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            OrderView.addObject("loggedempname", "Admin");
        }
        OrderView.addObject("title", "BIT Project 2024 | Orders Take-Away");
        return OrderView;
    }

    // request mapping for load order UI Delivery In
    @RequestMapping(value = "/orderDelivery")
    public ModelAndView UIDelivery() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView OrderView = new ModelAndView();
        OrderView.setViewName("OrderDelivery.html");
        OrderView.addObject("loggedusername", auth.getName());

        User user = userDao.getByUsername(auth.getName());
        if (user.getEmployee_id() != null) {
            OrderView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            OrderView.addObject("loggedempname", "Admin");
        }
        OrderView.addObject("title", "BIT Project 2024 | Orders Delivery");
        return OrderView;
    }

    @Override
    // define mapping get all Order data -- URL [/order/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/order/alldata", produces = "application/json")
    public List<Order> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (userPrivilege.getPrivi_select()) {
            // last record eka udinma thyagnna one nisa sort krenewa property eka lesa
            // primary key eka use krl // id eka auto increment nisa return
            return orderDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request mapping for load order by given status id [ URL -->
    // /order/bystatus?orderstatus_id=1 ]
    @GetMapping(value = "/order/bystatus", params = { "orderstatus_id" }, produces = "application/json")
    public List<Order> byStatus(@RequestParam("orderstatus_id") Integer statusid) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Order");

        if (userPrivilege.getPrivi_select()) {
            return orderDao.byStatus(statusid);
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    @Override
    @PostMapping(value = "/order/insert")
    public String insertRecord(@RequestBody Order order) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
        if (userPrivilege.getPrivi_insert()) {
            try {
                // set auto generate value
                order.setAddeduser(loggedUser.getId());
                order.setAddeddatetime(LocalDateTime.now());
                order.setOrdercode(orderDao.getNextOrderCode());

                // save operator
                // association eke main side eka block krenawa (using @JsonIgnore) main
                // order_id nathuwa submit kranna ba

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

                // do save
                orderDao.save(order);

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }

    }

    @Override
    @PutMapping(value = "/order/update")
    public String updateRecord(@RequestBody Order order) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
        if (userPrivilege.getPrivi_update()) {

            try {
                // set auto generate value
                order.setUpdateuser(loggedUser.getId());
                order.setUpdatedatetime(LocalDateTime.now());

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

    @Override
    @DeleteMapping(value = "/order/delete")
    public String deleteRecord(@RequestBody Order order) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Order");
        if (userPrivilege.getPrivi_delete()) {
            // check data Exist
            Order extOrder = orderDao.getReferenceById(order.getId());
            if (extOrder == null) {
                return "Customer Order Not Exist.!";
            }
            try {
                // set auto generate value
                extOrder.setDeleteuser(loggedUser.getId());
                extOrder.setDeletedatetime(LocalDateTime.now());
                extOrder.setOrderstatus_id(orderstatusDao.getReferenceById(5));

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

                // do save
                orderDao.save(extOrder);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Delete : You don't have permission..!";
        }
    }

}
