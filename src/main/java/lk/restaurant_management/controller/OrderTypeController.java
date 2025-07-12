package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.OrderTypeDao;
import lk.restaurant_management.entity.OrderType;

@RestController
public class OrderTypeController {
    @Autowired
    private OrderTypeDao orderTypeDao;

    // define mapping get all order type data -- URL [/orderType/alldata]
    @GetMapping(value = "/order/Type/alldata", produces = "application/json")
    public List<OrderType> getAllOrderStatus() {
        return orderTypeDao.findAll(Sort.by(Direction.ASC, "id"));
    }

}
