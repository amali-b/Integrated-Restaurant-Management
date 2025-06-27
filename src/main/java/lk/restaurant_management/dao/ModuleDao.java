package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.Module;

//extend JpaRepository to ModuleDao for inherit to moduleDao
//ethakota jparepository eke thyena functions use kirime facility eka hmbenewa
public interface ModuleDao extends JpaRepository<Module, Integer> {

}
