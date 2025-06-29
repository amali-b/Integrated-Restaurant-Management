package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.SeasonalDiscountDao;
import lk.restaurant_management.entity.SeasonalDiscount;

@RestController
public class SeasonalDiscountController {
    @Autowired
    private SeasonalDiscountDao seasonalDiscountDao;

    // define mapping get all customer status data -- URL [/customerStatus/alldata]
    @GetMapping(value = "/seasonaldiscount/alldata", produces = "application/json")
    public List<SeasonalDiscount> getAllStatusSeasonalDiscount() {
        return seasonalDiscountDao.findAll();
    }

}
