package lk.restaurant_management.entity;

import java.math.BigDecimal;
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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Specifies that the class is an entity
@Table(name = "`order`") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String ordercode;

    private String customername;

    private String customercontact;

    @NotNull
    private BigDecimal totalamount;

    private BigDecimal discount;

    private BigDecimal servicecharge;

    private BigDecimal deliverycharge;

    @NotNull
    private BigDecimal netamount;

    @NotNull
    private Integer addeduser;

    private Integer updateuser;

    private Integer deleteuser;

    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updatedatetime;

    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "ordertype_id", referencedColumnName = "id")
    private OrderType ordertype_id;

    @ManyToOne
    @JoinColumn(name = "orderstatus_id", referencedColumnName = "id")
    private Orderstatus orderstatus_id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    private Vehicle vehicle_id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "tables_id", referencedColumnName = "id")
    private Tables tables_id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "deliveryassist_id", referencedColumnName = "id")
    private DeliveryAssist deliveryassist_id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    /*
     * Order object eheka order_has_submenu or order_has_menuitems ekak
     * orderHasSubmenuList list eken or orderHasMenuitemList eken
     * remove kaloth or submenu or menu ekak remove kloth eka database ekenuth
     * delete kranna orphanRemoval = true danewa
     */

    // Order and order_has_submenu has one to many relationship
    // orphanRemoval update delete kranna ba inner eke
    @OneToMany(mappedBy = "order_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderHasSubmenu> orderHasSubmenuList;

    // Order and order_has_menuitems has one to many relationship
    @OneToMany(mappedBy = "order_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderHasMenuitem> orderHasMenuitemList;
}
