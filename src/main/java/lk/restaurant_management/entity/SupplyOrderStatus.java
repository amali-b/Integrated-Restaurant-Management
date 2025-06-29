package lk.restaurant_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Specifies that the class is an entity
@Table(name = "supplyorderstatus") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString by lombok
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
public class SupplyOrderStatus {

    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String status;
}
