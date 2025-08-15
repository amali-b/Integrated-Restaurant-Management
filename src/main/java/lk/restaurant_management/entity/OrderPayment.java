package lk.restaurant_management.entity;

import java.math.BigDecimal;
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
@Table(name = "orderpayment") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class OrderPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String code;

    @NotNull
    private BigDecimal totalamount;

    @NotNull
    private Integer addeduser;

    @NotNull
    private LocalDateTime addeddatetime;

    @NotNull
    private BigDecimal paidamount;

    private BigDecimal balanceamount;

    @ManyToOne(optional = true)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    /*
     * @OneToOne // Order and orderpayment has one to one relationship
     * 
     * @JoinColumn(name = "order_id", referencedColumnName = "id")
     * private Order order_id;
     */

    @ManyToOne // Order Peyment and orderPaymentmethod has Many to one relationship
    @JoinColumn(name = "orderpaymentmethod_id", referencedColumnName = "id")
    private OrderPaymentMethod orderpaymentmethod_id;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "orderpayment_has_order", joinColumns = @JoinColumn(name = "orderpayment_id"), inverseJoinColumns = @JoinColumn(name = "order_id"))
    private Set<Order> paymentOrders;
}
