package lk.restaurant_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

@Entity // Specifies that the class is an entity
@Table(name = "submenu_has_ingredient") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString by lombok
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
public class SubmenuHasIngredient {

    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String quantity;

    @ManyToOne // submenu_has_ingredient and submenu has many to one relationship
    @JoinColumn(name = "submenu_id", referencedColumnName = "id")
    @JsonIgnore // block supplierorder_id property from reading
    // recursion wena eka naweththanna one nisa submenu eke id eka self ignore krnw
    private Submenu submenu_id;

    @ManyToOne // submenu_has_ingredient and ingredient has many to one relationship
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient_id;

}
