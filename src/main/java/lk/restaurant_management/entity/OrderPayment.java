package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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

    @OneToOne // Order and orderpayment has one to one relationship
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order_id;

    @ManyToOne // Order Peyment and orderPaymentmethod has Many to one relationship
    @JoinColumn(name = "orderpaymentmethod_id", referencedColumnName = "id")
    private OrderPaymentMethod orderpaymentmethod_id;
}
