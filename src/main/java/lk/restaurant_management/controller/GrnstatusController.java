package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.GrnstatusDao;
import lk.restaurant_management.entity.GrnStatus;

@RestController
public class GrnstatusController {
    @Autowired
    private GrnstatusDao grnstatusDao;

    @GetMapping(value = "/grnstatus/alldata", produces = "application/json")
    public List<GrnStatus> getAlldata() {
        return grnstatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }

}
