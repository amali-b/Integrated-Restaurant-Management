package lk.restaurant_management.entity;

import java.time.LocalDate;
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
@Table(name = "employee") // Specifies the primary table for the annotated entity
@Data // generate setter, getter, toString by lombok
@AllArgsConstructor // All argument constructor
@NoArgsConstructor // generate default constructor
public class Employee {

    // generate default constructor by @NoArgsConstructor annotation
    // parameters mkuth pass wenne na
    // public Employee(){}

    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    @Length(min = 8, max = 8, message = "Lenght must be 8..!")
    private String emp_uid;

    @NotNull
    private String fullname;

    @NotNull
    private String callingname;
    /*
     * getters setters tika me wdyt auto lombok walin hadela denewa @Data annotation
     * eka dammame
     * public void setCallingname(String callingname) {
     * this.callingname = callingname;
     * }
     * 
     * public String getCallingname() {
     * return this.callingname;
     * }
     */

    @NotNull
    private LocalDate dob;

    @NotNull
    private String address;

    @NotNull
    private String email;

    @NotNull
    private String gender;

    @NotNull
    @Length(min = 10, max = 10, message = "Lenght must be 10..!")
    private String mobile_no;

    private String land_no;

    @NotNull
    @Length(min = 10, max = 12)
    private String nic;

    private byte[] employeeimage;

    private String note;

    @NotNull
    private Integer added_user;

    @NotNull
    private LocalDateTime added_datetime;

    private Integer update_user;
    private LocalDateTime update_datetime;

    private Integer delete_user;
    private LocalDateTime delete_datetime;

    @ManyToOne // employee and designation has many to one relationship
    // designation_id is a foreign key column from designation table
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    private Designation designation_id;

    @ManyToOne // employee and civilstatus has many to one relationship
    // civilstatus_id is a foreign key column from civilstatus table
    @JoinColumn(name = "civilstatus_id", referencedColumnName = "id")
    private CivilStatus civilstatus_id;

    @ManyToOne // employee and employeestatus has many to one relationship
    // employeestatus_id is a foreign key column from employeestatus table
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")
    private EmployeeStatus employeestatus_id;

}
