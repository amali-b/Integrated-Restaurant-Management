package lk.restaurant_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import lk.restaurant_management.dao.PrivilegeDao;
import lk.restaurant_management.entity.Privilege;

@RestController
public class UserPrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao;

    // define function for get privilege by given username and modulename
    public Privilege getPrivilegeByUserModule(String username, String modulename) {
        // privilege object ekak hadenewa
        Privilege userPrivilege = new Privilege();
        if (username.equalsIgnoreCase("admin")) {
            userPrivilege.setPrivi_select(true);
            userPrivilege.setPrivi_insert(true);
            userPrivilege.setPrivi_update(true);
            userPrivilege.setPrivi_delete(true);
        } else {
            //
            String userPrivString = privilegeDao.getPrivilegeByUserModule(username, modulename);
            String[] userPriviArray = userPrivString.split(",");
            System.out.println(userPrivString);

            userPrivilege.setPrivi_select(userPriviArray[0].equals("1"));
            userPrivilege.setPrivi_insert(userPriviArray[1].equals("1"));
            userPrivilege.setPrivi_update(userPriviArray[2].equals("1"));
            userPrivilege.setPrivi_delete(userPriviArray[3].equals("1"));
        }
        return userPrivilege;
    }

}
