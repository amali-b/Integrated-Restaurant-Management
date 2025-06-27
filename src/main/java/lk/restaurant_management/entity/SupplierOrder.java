package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Specifies that the class is an entity
@Table(name = "supplierorder") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString by lombok
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
public class SupplierOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String ordercode;

    @NotNull
    private LocalDate daterequired;

    @NotNull
    private BigDecimal totalamount;

    private String note;

    @NotNull
    private Integer addeduser;

    @NotNull
    private LocalDateTime addeddatetime;

    private Integer updateuser;

    private Integer deleteuser;

    private LocalDateTime updatedatetime;

    private LocalDateTime deletedatetim;

    @OneToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "supplyorderstatus_id", referencedColumnName = "id")
    private SupplyOrderStatus supplyorderstatus_id;

    // SupplierOrder and supplier_has_ingredient has one to many relationship
    @OneToMany(mappedBy = "supplierorder_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierorderHasIngredient> supplierorderHasIngredientList;
}
