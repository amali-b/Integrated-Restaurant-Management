package lk.restaurant_management.entity;

import java.math.BigDecimal;

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

@Entity
@Table(name = "supplierorder_has_ingredient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierorderHasIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private BigDecimal price;

    @NotNull
    private BigDecimal quantity;

    @NotNull
    private BigDecimal lineprice;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient_id;

    @ManyToOne
    @JoinColumn(name = "supplierorder_id", referencedColumnName = "id")
    @JsonIgnore // block supplierorder_id property from reading
    private SupplierOrder supplierorder_id;
}
