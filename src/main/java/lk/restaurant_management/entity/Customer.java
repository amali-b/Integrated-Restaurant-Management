package lk.restaurant_management.entity;

import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

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
@Table(name = "customer") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString etc..
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // empty constructor
public class Customer {
    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Length(min = 8, max = 8, message = "Lenght must be 8..!")
    private String reg_no;

    @NotNull
    private String title;

    @NotNull
    private String firstname;

    @NotNull
    private String lastname;

    @NotNull
    @Length(min = 10, max = 10, message = "Lenght must be 10..!")
    private String contact_no;

    private String address;

    @NotNull
    private String email;

    private String note;

    @NotNull
    private Integer added_user;
    @NotNull
    private LocalDateTime added_datetime;

    private Integer update_user;
    private LocalDateTime update_datetime;

    private Integer delete_user;
    private LocalDateTime delete_datetime;

    @ManyToOne // customer and customerstatus has many to one relationship
    @JoinColumn(name = "customerstatus_id", referencedColumnName = "id")
    private CustomerStatus customerstatus_id;
}
