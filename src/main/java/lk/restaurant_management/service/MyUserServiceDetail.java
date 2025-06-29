package lk.restaurant_management.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.restaurant_management.dao.UserDao;
import lk.restaurant_management.entity.Role;
import lk.restaurant_management.entity.User;

@Service
public class MyUserServiceDetail implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("Attempting to find user: " + username);

        // create user by get by username from dao file
        User extUser = userDao.getByUsername(username);

        Set<GrantedAuthority> authority = new HashSet<>();
        for (Role userRole : extUser.getRoles()) {
            authority.add(new SimpleGrantedAuthority(userRole.getName()));
        }
        return new org.springframework.security.core.userdetails.User(extUser.getUsername(), extUser.getPassword(),
                extUser.getStatus(), true, true, true, authority);
    }

}
