package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.SupplyOrderStatusDao;
import lk.restaurant_management.entity.SupplyOrderStatus;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class SupplyOrderstatusController {

    @Autowired
    private SupplyOrderStatusDao supplyOrderStatusDao;

    @GetMapping(value = "/supplyOrderStatus/alldata", produces = "application/json")
    public List<SupplyOrderStatus> getSupplierStatusAlldata() {
        return supplyOrderStatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }

}
