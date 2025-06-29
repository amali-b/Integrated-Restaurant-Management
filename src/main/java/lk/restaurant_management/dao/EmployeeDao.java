package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import lk.restaurant_management.entity.Employee;

//employee dao eka extend krela thyenne jparepository eka employeedao ekata inherit kregnna
//ethakota jparepository eke thyena functions use kirime facility eka hmbenewa
public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    @Query(value = "SELECT lpad(max(e.emp_uid) + 1 , 8, 25000000 ) FROM resturant_management_project.employee as e;", nativeQuery = true)
    String getNextEmpUid();

    // method eke parameter eka athule thyena variable access krena piliwela --> ?1
    @Query(value = "SELECT e from Employee e where e.nic=?1")
    Employee getByNIC(String nic);

    // method eke parameter eka athule thyena variable eka @param annotation eka use
    // krela access krnnth puluwn--> (:variable name)
    @Query(value = "SELECT e from Employee e where e.email=:email")
    Employee getByEmail(@Param("email") String email);

    @Query(value = "SELECT e FROM Employee e where e.id not in (select u.employee_id.id from User u where u.employee_id is not null)")
    List<Employee> listWithoutUserAccount();
}
