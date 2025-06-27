package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.Designation;

public interface DesignationDao extends JpaRepository<Designation, Integer> {

}
