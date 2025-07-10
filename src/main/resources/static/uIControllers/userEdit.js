//browser load event handler
window.addEventListener("load", () => {
    refreshUserForm();
});

//create form refresh function
const refreshUserForm = () => {
    $('#modalUserProfile').modal('show');
    userProfile = new Object();

    setDefault([empName, userName, empPwd, txtEmail]);

}

userProfileRefill = (ob) => {
    userProfile = JSON.parse(JSON.stringify(ob));
    olduserProfile = JSON.parse(JSON.stringify(ob));

    // reset photo
    if (ob.userphoto != null) {
        imgPreview.src = atob(ob.userphoto);
    } else {
        imgPreview.src = "images/userimage.png";
    }
    empName.value = ob.username;
    userName.value = ob.username;
    empPwd.value = ob.password;
    txtEmail.value = ob.email;

}

//define function for check for updates 
checkFormUpdate = () => {
    let updates = "";
    if (userProfile.userphoto != olduserProfile.userphoto) {
        updates = updates + "Employee Photo has Updated! \n";
    }
    if (userProfile.empName != olduserProfile.empName) {
        updates = updates + "Employee Name has updated from " + olduserProfile.empName + " \n";
    }
    if (userProfile.username != olduserProfile.username) {
        updates = updates + "Employee Name has updated from " + olduserProfile.username + " \n";
    }
    if (userProfile.password != olduserProfile.password) {
        updates = updates + "Employee Name has updated from " + olduserProfile.password + " \n";
    }
    if (userProfile.email != olduserProfile.email) {
        updates = updates + "Employee Name has updated from " + olduserProfile.email + " \n";
    }
    return updates;
}

//define function for submit button
const buttonUserProfileSubmit = () => {
    //check updates
    let updates = checkFormUpdate();
    let title = "Are you sure you want to Save following changes.?";
    let text = updates;
    let updateResponse = getHTTPServiceRequest('/editUser/submit', "POST", user);
    swalUpdate(updates, title, text, updateResponse, modalUserProfile);
}

//define function for validate employee
userName.addEventListener("keyup", () => {
    const userValue = userName.value;
    //pattern to validate name
    const regPattern = new RegExp("^([A-Z][a-z]{1,20}[ ])+([a-z]{2}[ ])?([A-Z][a-z]{1,20})$");
    if (regPattern.test(userValue)) {
        //valid value
        userProfile.empName = userValue;
        userName.style.border = "2px solid green";
    } else {
        //invalid value
        userProfile.empName = null;
        userName.style.border = "red solid 2px";
    }
});


//define function for validate full name
empName.addEventListener("keyup", () => {
    const fullNameValue = empName.value;
    //pattern to validate name
    const regPattern = new RegExp("^([A-Z][a-z]{1,20}[ ])+([a-z]{2}[ ])?([A-Z][a-z]{1,20})$");
    if (regPattern.test(fullNameValue)) {
        //valid value
        userProfile.fullname = fullNameValue;
        empName.style.border = "2px solid green";
    } else {
        //invalid value
        userProfile.fullname = null;
        empName.style.border = "red solid 2px";
    }
});