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
@Table(name = "orderstatus") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class Orderstatus {
    @Id // Specifies the primary key of ab entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String status;
}
