package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Specifies that the class is an entity
@Table(name = "garbageremove") // Specifies the primary table for the annotated entity
@Data // getters setters tika me wdyt auto lombok walin hadela denewa
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
public class Garbageremove {
    // generate default constructor by @NoArgsConstructor annotation
    // parameters mkuth pass wenne na
    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    private BigDecimal quantity;

    private String reason;

    private Integer addeduser;

    private LocalDateTime addeddatetime;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient_id;

    @ManyToOne
    @JoinColumn(name = "inventory_id", referencedColumnName = "id")
    private Inventory inventory_id;

}
