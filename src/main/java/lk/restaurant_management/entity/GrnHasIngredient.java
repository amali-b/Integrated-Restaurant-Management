package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

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
@Table(name = "grn_has_ingredient") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class GrnHasIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    private LocalDate expiredate;

    private LocalDate manufacturedate;

    private String batchnumber;

    @NotNull
    private BigDecimal price;

    @NotNull
    private BigDecimal quantity;

    @NotNull
    private BigDecimal lineprice;

    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @JsonIgnore // block menuitems_id property from reading
    // recursion wena eka naweththanna one nisa methana self id ignore krnw
    private Grn grn_id;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient_id;

}
