package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.VehicleStatus;

public interface VehicleStatusDao extends JpaRepository<VehicleStatus, Integer> {

}
