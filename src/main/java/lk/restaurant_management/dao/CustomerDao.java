package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Customer;

public interface CustomerDao extends JpaRepository<Customer, Integer> {

    @Query(value = "select c from Customer c where c.email=?1")
    Customer getByEmail(String email);

    @Query(value = "SELECT lpad(max(c.reg_no) + 1 , 8, '25000000') FROM resturant_management_project.customer as c;", nativeQuery = true)
    String getNextCustomerUid();

}
