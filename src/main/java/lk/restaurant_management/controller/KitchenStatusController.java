package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.KitchenStatusDao;
import lk.restaurant_management.entity.KitchenStatus;

@RestController
public class KitchenStatusController {

    @Autowired
    private KitchenStatusDao kitchenStatusDao;

    // define mapping get all Kitchen status data -- URL [/kitchenStatus/alldata]
    @GetMapping(value = "/kitchenStatus/alldata", produces = "application/json")
    public List<KitchenStatus> getAllKitchenStatus() {
        return kitchenStatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }
}
