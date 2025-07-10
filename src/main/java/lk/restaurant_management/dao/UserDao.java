package lk.restaurant_management.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.restaurant_management.entity.User;

public interface UserDao extends JpaRepository<User, Integer> {

    @Query(value = "select u from User u where u.username=?1")
    User getByUsername(String username);

    // log wela inna user saha admin ara anik usersla enna one
    @Query(value = "select u from User u where u.username<>?1 and u.username<>'Admin' order by u.id desc")
    List<User> findAll(String username);
}