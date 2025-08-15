package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.OrderPaymentMethodDao;
import lk.restaurant_management.entity.OrderPaymentMethod;

@RestController
public class OrderPaymentMethodController {
    @Autowired
    private OrderPaymentMethodDao orderPaymentMethodDao;

    // define mapping get all order status data -- URL [/paymentmethod/alldata]
    @GetMapping(value = "/orderPaymentmethod/alldata", produces = "application/json")
    public List<OrderPaymentMethod> getAllOrderStatus() {
        return orderPaymentMethodDao.findAll(Sort.by(Direction.ASC, "id"));
    }
}
