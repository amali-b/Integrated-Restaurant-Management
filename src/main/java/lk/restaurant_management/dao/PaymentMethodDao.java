package lk.restaurant_management.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.restaurant_management.entity.PaymentMethod;

public interface PaymentMethodDao extends JpaRepository<PaymentMethod, Integer> {

}
