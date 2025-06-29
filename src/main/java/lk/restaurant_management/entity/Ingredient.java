package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

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
@Table(name = "ingredient") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@NoArgsConstructor // All argument constructor
@AllArgsConstructor // empty constructor
@JsonInclude(value = Include.NON_NULL) // null data values filter kranne na
public class Ingredient {

    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String code;

    @NotNull
    private String ingredient_name;

    @NotNull
    private String measuring_unit;

    @NotNull
    private BigDecimal reoder_point;

    @NotNull
    private BigDecimal reorder_quantity;

    @NotNull
    private BigDecimal purchase_price;

    private String note;

    @NotNull
    private Integer addeduser;

    @NotNull
    private LocalDateTime addeddatetime;

    private Integer updateuser;

    private Integer deleteuser;

    private LocalDateTime updatedatetime;

    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "ingredientstatus_id", referencedColumnName = "id")
    private IngredientStatus ingredientstatus_id;

    @ManyToOne
    @JoinColumn(name = "unittype_id", referencedColumnName = "id")
    private UnitType unittype_id;

    @ManyToOne
    @JoinColumn(name = "ingredientcategory_id", referencedColumnName = "id")
    private IngredientCategory ingredientcategory_id;

    // getListBySupplier query eke hdagaththa constructor ekata adalawa constructor
    // eka define krenewa
    public Ingredient(Integer id, String ingredient_name, BigDecimal purchase_price, UnitType unittype_id) {
        this.id = id;
        this.ingredient_name = ingredient_name;
        this.purchase_price = purchase_price;
        this.unittype_id = unittype_id;
    }
}
