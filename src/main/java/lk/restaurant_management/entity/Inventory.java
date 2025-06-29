package lk.restaurant_management.entity;

import java.math.BigDecimal;
// import java.text.DecimalFormat;
import java.time.LocalDateTime;

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
@Table(name = "inventory")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private BigDecimal availablequantity;

    @NotNull
    private BigDecimal totalquantity;

    @NotNull
    private LocalDateTime expiredate;

    private LocalDateTime manufacturedate;

    @NotNull
    private Integer batchnumber;

    @ManyToOne
    @JoinColumn(name = "inventorystatus_id", referencedColumnName = "id")
    private InventoryStatus inventorystatus_id;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient_id;
}
