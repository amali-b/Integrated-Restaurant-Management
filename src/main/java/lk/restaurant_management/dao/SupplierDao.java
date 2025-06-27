package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {

    @Query(value = "select s from Supplier s where s.email=?1")
    Supplier getByEmail(String email);

    @Query(value = "select s from Supplier s where s.supplier_name=?1")
    Supplier getBySupplierName(String name);
}
