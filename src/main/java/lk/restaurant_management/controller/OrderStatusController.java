package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.OrderstatusDao;
import lk.restaurant_management.entity.Orderstatus;

@RestController
public class OrderStatusController {
    @Autowired
    private OrderstatusDao orderstatusDao;

    // define mapping get all order status data -- URL [/orderStatus/alldata]
    @GetMapping(value = "/orderStatus/alldata", produces = "application/json")
    public List<Orderstatus> getAllOrderStatus() {
        return orderstatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }

}
