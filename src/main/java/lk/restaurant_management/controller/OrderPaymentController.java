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

import lk.restaurant_management.dao.OrderDao;
import lk.restaurant_management.dao.OrderPaymentDao;
import lk.restaurant_management.dao.OrderstatusDao;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Order;
import lk.restaurant_management.entity.OrderHasIngredient;
import lk.restaurant_management.entity.OrderHasMenuitem;
import lk.restaurant_management.entity.OrderHasSubmenu;
import lk.restaurant_management.entity.OrderPayment;
import lk.restaurant_management.entity.Privilege;
import lk.restaurant_management.entity.User;

@RestController
public class OrderPaymentController {
    @Autowired // generate instance for interface file
    private OrderPaymentDao orderPaymentDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private OrderstatusDao orderstatusDao;
    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load orderPayment UI
    @RequestMapping(value = "/orderpaymentDinein")
    public ModelAndView paymentUI() {
        // Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView orderPaymentView = new ModelAndView();
        orderPaymentView.setViewName("OrderPaymentDinein.html");
        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        orderPaymentView.addObject("loggedusername", auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        orderPaymentView.addObject("loggeduserphoto", user.getUserphoto());

        // log una user ta employee id ekk thiyenewanm
        if (user.getEmployee_id() != null) {
            orderPaymentView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            orderPaymentView.addObject("loggedempname", "Admin");
        }
        orderPaymentView.addObject("title", "BIT Project 2024 | Order Payment Management");

        return orderPaymentView;
    }

    // request mapping for load orderPayment UI
    @RequestMapping(value = "/orderpaymentTakeaway")
    public ModelAndView TakeawayUI() {
        // Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // create ModelAndView instance
        ModelAndView TakeawayPaymentView = new ModelAndView();
        TakeawayPaymentView.setViewName("OrderPaymentTakeaway.html");
        // user object ekak gennagnnewa
        User user = userDao.getByUsername(auth.getName());

        // log wela inna user ge username eka set krenewa
        TakeawayPaymentView.addObject("loggedusername", auth.getName());

        // log wela inna user ge photo ekak thyewanm eka display krenw
        TakeawayPaymentView.addObject("loggeduserphoto", user.getUserphoto());

        // log una user ta employee id ekk thiyenewanm
        if (user.getEmployee_id() != null) {
            TakeawayPaymentView.addObject("loggedempname", user.getEmployee_id().getCallingname());
        } else {
            TakeawayPaymentView.addObject("loggedempname", "Admin");
        }
        TakeawayPaymentView.addObject("title", "BIT Project 2024 | Order Takeaway Payment Management");

        return TakeawayPaymentView;
    }

    // define mapping get all order status data -- URL [/orderpayment/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/orderpayment/alldata", produces = "application/json")
    public List<OrderPayment> getAlldata() {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "OrderPayment");
        if (userPrivilege.getPrivi_select()) {
            return orderPaymentDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // privilege naththan empty array ekak return krnw
            return new ArrayList<>();
        }
    }

    // request post mapping for save record [URL --> /orderpayment/insert]
    @PostMapping(value = "/orderpayment/insert")
    public String insertPaymentRecord(@RequestBody OrderPayment orderPayment) {
        // check user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get privilege object
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "OrderPayment");
        // user object ekak gennagnnewa
        User loggedUser = userDao.getByUsername(auth.getName());

        // check privilege
        if (userPrivilege.getPrivi_insert()) {
            try {
                // set auto generate value
                orderPayment.setAddeduser(loggedUser.getId());
                orderPayment.setAddeddatetime(LocalDateTime.now());
                orderPayment.setCode(orderPaymentDao.getByNextCode());

                // do save
                orderPaymentDao.save(orderPayment);

                // manage dependancies
                for (Order order : orderPayment.getPaymentOrders()) {
                    // order object ekak oderdao hareha id eken aregena hdagnnw
                    Order payorder = orderDao.getReferenceById(order.getId());

                    payorder.setOrderstatus_id(orderstatusDao.getReferenceById(4));

                    // save operator
                    // orderHasSubmenuList list ekata loop ekak dala read krela
                    for (OrderHasSubmenu ohs : payorder.getOrderHasSubmenuList()) {
                        // onebyone (sohi) illegena purchase order eka set krnw
                        ohs.setOrder_id(payorder);
                    }

                    // OrderHasMenuitemList list ekata loop ekak dala read krela
                    for (OrderHasMenuitem ohm : payorder.getOrderHasMenuitemList()) {
                        // onebyone (sohi) illegena purchase order eka set krnw
                        ohm.setOrder_id(payorder);
                    }

                    // getOrderHasIngredientList list ekata loop ekak dala read krela
                    for (OrderHasIngredient ohi : payorder.getOrderHasIngredientList()) {
                        // onebyone (sohi) illegena purchase order eka set krnw
                        ohi.setOrder_id(payorder);
                    }

                    orderDao.save(payorder);
                }

                return "OK";

            } catch (Exception e) {
                return "Save not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Save : You don't have permission..!";
        }
    }

}
