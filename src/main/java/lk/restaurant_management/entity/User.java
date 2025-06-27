package lk.restaurant_management.entity;

import java.time.LocalDateTime;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Entity // Specifies that the class is an entity
@Table(name = "user") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    @Length(max = 8, min = 5, message = "Length must be 8.!")
    private String username;

    @NotNull
    private String password;

    @NotNull
    private String email;

    @NotNull
    private Boolean status;

    private String note;

    private byte[] userphoto;

    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updateddatetime;

    private LocalDateTime deletedatetime;

    @ManyToOne(optional = true)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;
}
