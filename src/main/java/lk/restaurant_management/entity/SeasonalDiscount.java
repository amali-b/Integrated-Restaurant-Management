package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

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
@Table(name = "seasonaldiscount")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeasonalDiscount {
    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String promotioncode;

    @NotNull
    private LocalDate startdate;

    @NotNull
    private LocalDate enddate;

    @NotNull
    private String discountedoption;

    @NotNull
    private BigDecimal discountedprice;

    @ManyToOne // seasonaldiscount and menuitems has many to one relationship
    @JoinColumn(name = "menuitems_id", referencedColumnName = "id")
    private MenuItem menuitems_id;
}
