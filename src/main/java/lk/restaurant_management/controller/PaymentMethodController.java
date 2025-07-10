package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import lk.restaurant_management.dao.PaymentMethodDao;
import lk.restaurant_management.entity.PaymentMethod;

@RestController
public class PaymentMethodController {
    @Autowired
    private PaymentMethodDao paymentMethodDao;

    // define mapping get all order status data -- URL [/paymentmethod/alldata]
    @GetMapping(value = "/paymentmethod/alldata", produces = "application/json")
    public List<PaymentMethod> getAllOrderStatus() {
        return paymentMethodDao.findAll(Sort.by(Direction.ASC, "id"));
    }

}
