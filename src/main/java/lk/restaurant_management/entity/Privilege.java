package lk.restaurant_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "privilege") // Specifies the primary table for the annotated entity
@Entity // Specifies that the class is an entity
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
@Data // generate setter, getter, toString etc..
public class Privilege {

    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private Boolean privi_select;
    @NotNull
    private Boolean privi_insert;
    @NotNull
    private Boolean privi_update;
    @NotNull
    private Boolean privi_delete;

    // privilege and designation has many to one relationship
    // designation_id is a foreign key column from designation table
    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role_id;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    private Module module_id;

}
