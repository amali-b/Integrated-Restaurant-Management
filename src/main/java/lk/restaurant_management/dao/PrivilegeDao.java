package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.Privilege;

//privilege dao eka extend krela thyenne jparepository eka privilegedao ekata inherit kregnna
//ethakota jparepository eke thyena functions use kirime facility eka hmbenewa
public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    // use jpa query
    // method eke parameter eka athule thyena variable access krena piliwela --> ?1
    @Query("select p from Privilege p where p.role_id.id=?1 AND p.module_id.id=?2")
    Privilege getPrivilegeByRoleModule(Integer roleid, Integer moduleid);

    @Query(value = "SELECT bit_or(p.privi_select) as sel, bit_or(p.privi_insert) as inst, bit_or(p.privi_update) as upd, bit_or(p.privi_delete) as del FROM resturant_management_project.privilege as p where p.module_id in (select m.id from resturant_management_project.module as m where m.name =?2) and p.role_id in (select uhr.role_id from resturant_management_project.user_has_role as uhr where uhr.user_id in (select u.id from resturant_management_project.user as u where u.username=?1));", nativeQuery = true)
    String getPrivilegeByUserModule(String username, String modulename);

}
