package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "supplierpayment") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class SupplierPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String paymentnumber;

    @NotNull
    private BigDecimal grnamount;

    @NotNull
    private BigDecimal paidamount;

    @NotNull
    private BigDecimal balanceamount;

    @NotNull
    private Integer addeduser;

    @NotNull
    private LocalDateTime addeddatetime;

    private String transferid;

    private LocalDateTime transferdatetime;

    private String checknumber;

    private LocalDate checkdate;

    @OneToOne // supplier and paymentmethod has one to one relationship
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne // grn and paymentmethod has one to one relationship
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private Grn grn_id;

    @ManyToOne // supplierpayment and paymentmethod has many to one relationship
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    private PaymentMethod paymentmethod_id;
}
