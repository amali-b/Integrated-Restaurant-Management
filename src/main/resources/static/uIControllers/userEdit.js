//browser load event handler
window.addEventListener("load", () => {
    refreshUserForm();
});

//create form refresh function
const refreshUserForm = () => {
    // open modal when browser load
    $('#modalUserProfile').modal('show');

    // logged user object ekak arn eka store kregnnewa variable deheka
    loguser = getServiceRequest("/loggeduserdetails");
    oldloguser = getServiceRequest("/loggeduserdetails");

    // reset photo
    if (loguser.userphoto != null) {
        imgPreviewUser.src = atob(loguser.userphoto);
    } else {
        imgPreviewUser.src = "images/userimage.png";
    }
    // set logged username 
    txtuserName.value = loguser.username;

    // set log user email
    txtEmail.value = loguser.email;

    setDefault([txtuserName, txtEmail]);

}

//define function for check for updates 
checkFormChanges = () => {
    let changes = "";
    if (loguser.userphoto != oldloguser.userphoto) {
        changes = changes + "Employee Photo has Changed.! \n";
    }
    if (loguser.username != oldloguser.username) {
        changes = changes + "Employee Name has Changed.! \n";
    }
    if (loguser.oldpassword != oldloguser.newpassword) {
        changes = changes + "Employee Name has Changed.! \n";
    }
    if (loguser.email != oldloguser.email) {
        changes = changes + "Employee Name has Changed.! \n";
    }
    return changes;
}

//define function for submit button
const buttonUserProfileSubmit = () => {
    console.log("User Object : " + loguser);

    //check updates
    let changes = checkFormChanges();

    if (changes) {
        Swal.fire({
            title: "Are you sure you want to Save following changes.?",
            text: changes,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call put servuce
                let saveResponse = getHTTPServiceRequest('/editUser/submit', "PUT", loguser);
                if (saveResponse == "OK") {
                    Swal.fire({
                        title: "Saved Profile Changes.!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    window.location.replace("/logout");
                } else {
                    Swal.fire({
                        title: "Failed to Save.! Has following errors :",
                        text: saveResponse,
                        icon: "info"
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: "Nothing Changed.!",
            icon: "info",
            showConfirmButton: false,
            timer: 1500
        });
    }
}

const pswdValidator = () => {
    if (txtNewPwd.value === txtReNewPwd.value) {
        loguser.newpassword = txtNewPwd.value;
        txtReNewPwd.style.border = "2px solid green";
    } else {
        loguser.newpassword = null;
        txtReNewPwd.style.border = "solid red 2px";
    }
}
