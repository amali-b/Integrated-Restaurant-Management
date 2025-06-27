package lk.restaurant_management.controller;

import java.util.List;

import org.springframework.web.servlet.ModelAndView;

public interface CommonController<T> {

    // request mapping for load customer UI
    public ModelAndView UI();

    // define mapping get all customer data -- URL [/customer/alldata]
    public List<T> getAlldata();
    // check loged user authorization

    // get privilege object

    // check data exist

    public String insertRecord(T t);

    public String updateRecord(T t);

    public String deleteRecord(T t);

}
