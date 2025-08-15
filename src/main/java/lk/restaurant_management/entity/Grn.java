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
@Table(name = "grn") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class Grn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private LocalDate dateofreceived;

    @NotNull
    private String supplierinvoiceno;

    @NotNull
    private BigDecimal totalamount;

    private BigDecimal discountamount;

    @NotNull
    private BigDecimal netamount;

    private BigDecimal paidamount;

    @NotNull
    private String grnnumber;

    @NotNull
    private Integer addeduser;

    private Integer updateuser;

    private Integer deleteuser;

    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updatedatetime;

    private LocalDateTime deletedatetime;

    @OneToOne
    @JoinColumn(name = "supplierorder_id", referencedColumnName = "id")
    private SupplierOrder supplierorder_id;

    @ManyToOne
    @JoinColumn(name = "grnstatus_id", referencedColumnName = "id")
    private GrnStatus grnstatus_id;

    /*
     * grn object eheka grn_has_ingredient ekak grnHasIngredientsList list eken
     * remove kaloth or ingredient ekak remove kloth eka database ekenuth delete
     * kranna orphanRemoval = true danewa
     */
    // Grn and grn_has_ingredient has one to many relationship
    @OneToMany(mappedBy = "grn_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GrnHasIngredient> grnHasIngredientList;

}
