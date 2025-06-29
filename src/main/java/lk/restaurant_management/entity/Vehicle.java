package lk.restaurant_management.entity;

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

@Entity // Specifies that the class is an entity
@Table(name = "vehicle") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString by lombok
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
public class Vehicle {
    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String name;

    @NotNull
    private String vehiclenumber;

    @ManyToOne // vehicle and vehiclestatus has many to one relationship
    // vehiclestatus_id is a foreign key column from vehiclestatus table
    @JoinColumn(name = "vehiclestatus_id", referencedColumnName = "id")
    private VehicleStatus vehiclestatus_id;
}
