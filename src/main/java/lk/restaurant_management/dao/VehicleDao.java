package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.Vehicle;

public interface VehicleDao extends JpaRepository<Vehicle, Integer> {

}
