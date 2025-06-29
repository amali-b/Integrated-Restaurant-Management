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
@Table(name = "menuitems") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString by lombok
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
public class MenuItem {
    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String code;

    @NotNull
    private String name;

    @NotNull
    private BigDecimal price;

    @NotNull
    private Integer addeduser;

    private Integer updateuser;

    private Integer deleteuser;

    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updatedatetime;

    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "seasonaldiscount_id", referencedColumnName = "id")
    private SeasonalDiscount seasonaldiscount_id;

    @ManyToOne
    @JoinColumn(name = "menustatus_id", referencedColumnName = "id")
    private MenuStatus menustatus_id;

    // menuitem and menuitems_has_submenu has one to many relationship
    /*
     * Menu object eheka menuitems_has_submenu ekak menuHasSubmenusList list eken
     * remove kaloth or submenu ekak remove kloth eka database ekenuth delete kranna
     * orphanRemoval = true danewa
     */
    @OneToMany(mappedBy = "menuitems_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MenuHasSubmenu> menuHasSubmenusList;

}
