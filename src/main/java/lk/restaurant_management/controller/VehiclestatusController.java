package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.VehicleStatusDao;
import lk.restaurant_management.entity.VehicleStatus;

@RestController
public class VehiclestatusController {
    @Autowired
    private VehicleStatusDao vehicleStatusDao; // generate instance for interface

    @GetMapping(value = "vehiclestatus/alldata", produces = "application/json")
    public List<VehicleStatus> getCivilStatusalldata() {
        return vehicleStatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }
}
