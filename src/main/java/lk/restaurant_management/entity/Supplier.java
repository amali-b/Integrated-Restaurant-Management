package lk.restaurant_management.entity;

import java.time.LocalDateTime;
import java.util.Set;

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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Specifies that the class is an entity
@Table(name = "supplier") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class Supplier {
    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String supplier_name;

    @NotNull
    private String contact_no;

    @NotNull
    private String email;

    @NotNull
    private String address;

    @NotNull
    private Integer supplier_type;

    @NotNull
    private String bankname;

    @NotNull
    private String branchname;

    @NotNull
    private String accountnumber;

    @NotNull
    private String holdername;

    private String note;

    @NotNull
    private Integer addeduser;

    @NotNull
    private LocalDateTime addeddatetime;

    private Integer updateuser;
    private LocalDateTime updatedatetime;

    private Integer deleteuser;
    private LocalDateTime deletedatetime;

    @ManyToOne // supplier and supplierstatus has many to one relationship
    // supplierstatus_id is a foreign key column from supplierstatus table
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    private SupplierStatus supplierstatus_id;

    // foreign key dekak wthrk thyena association table ekak me wdyt gnna puluwn
    // (List transfer sadeha)
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "supplier_has_ingredient", joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "ingredient_id"))
    private Set<Ingredient> supplyIngredients;
}
