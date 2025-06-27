package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Role;

//extend JpaRepository to RoleDao for inherit to roleDao
//ethakota jparepository eke thyena functions use kirime facility eka hmbenewa
public interface RoleDao extends JpaRepository<Role, Integer> {

    @Query(value = "SELECT r FROM Role r where r.name<>'Admin'")
    List<Role> getUsersWithouthAdmin();

}