package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Module;

//extend JpaRepository to ModuleDao for inherit to moduleDao
//ethakota jparepository eke thyena functions use kirime facility eka hmbenewa
public interface ModuleDao extends JpaRepository<Module, Integer> {

    /*  */
    @Query(value = "SELECT m.name FROM resturant_management_project.module as m where m.id in (SELECT p.module_id FROM resturant_management_project.privilege as p where p.privi_select=0 and role_id in (SELECT uhr.role_id FROM resturant_management_project.user_has_role as uhr where uhr.user_id in (SELECT u.id FROM resturant_management_project.user as u where u.username=?1)));", nativeQuery = true)
    List<Module> getModuleByusername(String username);
}
