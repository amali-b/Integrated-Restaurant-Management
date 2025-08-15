package lk.restaurant_management.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoggedUser {

    private String oldusername;

    private String username;

    private String oldpassword;

    private String newpassword;

    private String email;

    private byte[] userphoto;

}
