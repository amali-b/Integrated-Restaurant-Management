package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.SupplierStatus;

//extend JpaRepository to SupplierstatusDao for inherit to supplierstatusDao
public interface SupplierstatusDao extends JpaRepository<SupplierStatus, Integer> {

}
