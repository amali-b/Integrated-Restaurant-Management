package lk.restaurant_management.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // service authentication matching
        http.authorizeHttpRequests(auth -> {
            auth
                    // allow all request to access
                    .requestMatchers("/bootstrap-5.2.3/**").permitAll()
                    // allow all request to access
                    .requestMatchers("/css/**").permitAll()
                    // allow all request to access
                    .requestMatchers("/fontawesome-free-6.6.0-web/**").permitAll()
                    // allow all request to access
                    .requestMatchers("/images/**").permitAll()
                    // allow all request to access
                    .requestMatchers("/scripts/**").permitAll()
                    // allow all request to access
                    // .requestMatchers("/resources/**").permitAll()
                    // allow all request to access
                    .requestMatchers("/createadmin").permitAll()
                    // allow all request to access
                    .requestMatchers("/login").permitAll()
                    // allow all request to access
                    .requestMatchers("/index").permitAll()
                    // allow access only for admin, manger, Cashier, Chef, As-Manaager
                    .requestMatchers("/dashboard").permitAll()
                    // allow access only for admin, manger, As-Manaager
                    .requestMatchers("/employee/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    // allow access only for admin, manger
                    .requestMatchers("/privilege/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    // allow access only for admin, manger
                    .requestMatchers("/user/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/designation/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/employeestatus/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/customer/**").hasAnyAuthority("Admin", "Manager", "As-Manager", "Cashier")
                    .requestMatchers("/supplier/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/supplierstatus/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/ingredient/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/inventory/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/submenu/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/menuitem/**").hasAnyAuthority("Admin", "Manager", "As-Manager")
                    .requestMatchers("/order/**").hasAnyAuthority("Admin", "Manager", "As-Manager", "Cashier")
                    .requestMatchers("/supplierorder/**").hasAnyAuthority("Admin", "Manager", "As-Manager", "Cashier")
                    .anyRequest().authenticated();
        })
                // login details
                .formLogin(login -> {
                    login
                            .loginPage("/login")
                            .defaultSuccessUrl("/dashboard", true)
                            .failureUrl("/login?error=usernamepassworderror")// error=parametername,usernamepassworderror=value
                            .usernameParameter("username")
                            .passwordParameter("password");
                })
                // logout details
                .logout(logout -> {
                    logout
                            .logoutUrl("/logout")
                            .logoutSuccessUrl("/login");
                })
                .exceptionHandling(exp -> {
                    exp
                            .accessDeniedPage("/errorpage");
                })
                //
                .csrf(csrf -> {
                    csrf.disable();
                });
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
