package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.MenuStatusDao;
import lk.restaurant_management.entity.MenuStatus;

@RestController
public class MenuStatusController {
    @Autowired
    private MenuStatusDao menuStatusDao;

    // define mapping get all customer status data -- URL [/customerStatus/alldata]
    @GetMapping(value = "/menuStatus/alldata", produces = "application/json")
    public List<MenuStatus> getAllMenuStatus() {
        return menuStatusDao.findAll(Sort.by(Direction.ASC, "id"));
    }

}
