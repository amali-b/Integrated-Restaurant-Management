package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.EmployeeStatus;

//extend JpaRepository to EmployeestatusDao for inherit to employeestatusDao
public interface EmployeestatusDao extends JpaRepository<EmployeeStatus, Integer> {

}
