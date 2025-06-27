package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.CivilStatus;

public interface CiviltausDao extends JpaRepository<CivilStatus, Integer> {

}
