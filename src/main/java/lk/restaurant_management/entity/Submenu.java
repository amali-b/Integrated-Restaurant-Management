package lk.restaurant_management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

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
@Table(name = "submenu") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString by lombok
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
@JsonInclude(value = Include.NON_NULL) // null data values filter kranne na
public class Submenu {
    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private String submenu_code;

    @NotNull
    private String name;

    @NotNull
    private BigDecimal price;

    private byte[] submenuimage;

    private String note;

    @NotNull
    private Integer addeduser;

    private Integer updateuser;

    private Integer deleteuser;

    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updatedatetime;

    private LocalDateTime deletedatetime;

    @ManyToOne // Submenu and SubmenuCategory has many to one relationship
    // category_id is a foreign key column from SubmenuCategory table
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private SubmenuCategory category_id;

    @ManyToOne // Submenu and SubmenuStatus has many to one relationship
    // submenustatus_id is a foreign key column from SubmenuStatus table
    @JoinColumn(name = "submenustatus_id", referencedColumnName = "id")
    private SubmenuStatus submenustatus_id;

    // Submenu and submenu_has_ingredient has one to many relationship
    @OneToMany(mappedBy = "submenu_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubmenuHasIngredient> submenuHasIngredientList;
}