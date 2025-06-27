package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.SubmenuStatusDao;
import lk.restaurant_management.entity.SubmenuStatus;

@RestController
// controller eke thyena implementation
public class SubmenuStatusController {

    @Autowired
    private SubmenuStatusDao submenuStatusDao;

    // define mapping get all ingredient status data
    @GetMapping(value = "/submenustatus/alldata", produces = "application/json")
    public List<SubmenuStatus> getAllSubmenuStatus() {
        return submenuStatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }
}