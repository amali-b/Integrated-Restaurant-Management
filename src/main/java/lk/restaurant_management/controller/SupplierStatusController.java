package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.SupplierstatusDao;
import lk.restaurant_management.entity.SupplierStatus;

@RestController
public class SupplierStatusController {

    @Autowired
    private SupplierstatusDao supplierstatusDao;

    @GetMapping(value = "supplierstatus/alldata", produces = "application/json")
    public List<SupplierStatus> getSupplierStatusAlldata() {
        return supplierstatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }
}
