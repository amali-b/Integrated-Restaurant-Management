package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.CustomerstatusDao;
import lk.restaurant_management.entity.CustomerStatus;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class CustomerStatusController {

    @Autowired
    private CustomerstatusDao customerstatusDao;

    // define mapping get all customer status data -- URL [/customerStatus/alldata]
    @GetMapping(value = "/customerStatus/alldata", produces = "application/json")
    public List<CustomerStatus> getAllCustomerStatus() {
        return customerstatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }

}
