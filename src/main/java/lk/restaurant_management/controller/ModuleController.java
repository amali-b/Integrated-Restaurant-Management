package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.ModuleDao;
import lk.restaurant_management.entity.Module;

@RestController
public class ModuleController {

    @Autowired
    private ModuleDao moduleDao; // generate instance for interface file

    // define mapping get all module data -- URL [/module/alldata]
    // backend eke idan data fontend ekata return kranne json format eken nisa
    // (produces = "application/json")
    @GetMapping(value = "/module/alldata", produces = "application/json")
    public List<Module> getModuleDate() {
        return moduleDao.findAll();
    }
}
