package lk.restaurant_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "menuitems_has_submenu")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuHasSubmenu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "menuitems_id", referencedColumnName = "id")
    @JsonIgnore // block menuitems_id property from reading
    private MenuItem menuitems_id;

    @ManyToOne
    @JoinColumn(name = "submenu_id", referencedColumnName = "id")
    private Submenu submenu_id;

}
