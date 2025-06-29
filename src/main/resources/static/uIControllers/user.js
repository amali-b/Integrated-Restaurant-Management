//browser load event handler
window.addEventListener("load", () => {

    refreshUserForm();

    refreshUserTable();
});

//create form refresh function
const refreshUserForm = () => {
    formUser.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    user = new Object();
    user.roles = new Array();
    olduser = null;

    //user account hadila nathi employeela tika wthrai enna one
    const employees = getServiceRequest("/employee/withoutuseraccnt");
    fillDropdown(empName, "Select Employee", employees, "fullname");

    const roles = getServiceRequest("/role/withoutadmin");

    let divRole = document.querySelector("#divRoles");
    divRole.innerHTML = "";

    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";
        divRole.appendChild(div);

        let inputCheck = document.createElement("input");
        inputCheck.type = "checkbox";
        inputCheck.id = role.id;
        inputCheck.className = "form-check-input";
        div.appendChild(inputCheck);

        inputCheck.onclick = () => {
            // foreach eka ahtule iddi element eka access kranna puluwn nisa this.checked wenuwata inputCheck.checked user krnna puluwn
            if (inputCheck.checked) {
                //user ge roles list ekata foreach eken gnna role eka set krnw
                user.roles.push(role);
            } else {
                //unchecked weddi role object eka available wena index eka hoyagnnw
                console.log("xxxx");
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                console.log("yyyyy");
                // index eka available nam eka list eken splice krela ain krenewa
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        let label = document.createElement("label");
        label.className = "form-lable";
        label.innerText = role.name;
        div.appendChild(label);
    });

    empStatus.checked = "checked";
    labelUserStatus.innerText = "User Account is Active ";
    user.status = true;

    empName.disabled = false;
    txtUserPwd.disabled = false;
    txtrePwd.disabled = false;

    setDefault([empName, txtUid, txtUserPwd, txtrePwd, txtEmail, empStatus, txtNote]);

}
//create refresh function
const refreshUserTable = () => {

    /* let users = [
        { empName: "Amali Bhuvi Abeysekera", uId: "amali_2001", email: "amalibhuvisara@gmail.com", role_id: { id: 4, name: "Admin" }, status_id: { id: 1, status: "Active" } },
        { empName: "Vishaka Lakmini Anuradha", uId: "vishu78", email: "vishuanu@gmail.com", role_id: { id: 2, name: "Cashier" }, status_id: { id: 2, status: "Resigned" } },
        { empName: "Yasith Navodya de Silva", uId: "yas_navo12", email: "yasithnavo412@gmail.com", role_id: { id: 1, name: "Manager" }, status_id: { id: 3, status: "Removed" } }
    ]; */

    let users = getServiceRequest("/user/alldata");

    let propertyList = [
        { property: getEmpName, dataType: "function" },
        { property: "username", dataType: "string" },
        { property: "email", dataType: "string" },
        { property: getRoles, dataType: "function" },
        { property: getUserStatus, dataType: "function" }
    ];

    fillTableFour(userTableBody, users, propertyList, userFormRefill, true);
    $('#tableUser').DataTable();
}

const getEmpName = (ob) => {
    if (ob.employee_id != null) {
        return ob.employee_id.fullname;
    } else {
        return "-";
    }
}

//define a function to add comma and remove it from last role
const getRoles = (ob) => {
    let roles = "";
    ob.roles.forEach((role, index) => {
        //index ekath ekka length eka check krenewa
        if (ob.roles.length - 1 == index) {
            roles = roles + role.name;
        } else {
            //index eka length ekt samana naththan coma eka danna 
            roles = roles + role.name + ", ";
        }
    });
    return roles;
}

//need to create status table in database
const getUserStatus = (ob) => {
    if (ob.status) {
        return "<p class='btn btn-outline-success text-center'> Active </p>";
    } else {
        // return "Deactive";
        return "<p class='btn btn-outline-danger text-center'> In-Active </p>";
    }
}

//function define for edit user record
const userFormRefill = (ob, index) => {
    $('#modalUser').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    user = JSON.parse(JSON.stringify(ob));
    olduser = JSON.parse(JSON.stringify(ob));

    //user account hadila nathi employeela tika wthrai enna one
    const employees = getServiceRequest("/employee/allempdata");
    fillDropdown(empName, "Select Employee", employees, "fullname");
    empName.disabled = true;
    empName.value = JSON.stringify(ob.employee_id);

    txtUid.value = ob.username;
    txtUserPwd.disabled = true;
    txtrePwd.disabled = true;
    txtEmail.value = ob.email;
    if (ob.status) {
        empStatus.checked = "checked";
        labelUserStatus.innerText = "User Account is Active ";
    } else {
        empStatus.checked = "";
        labelUserStatus.innerText = "User Account is In-Active ";
    }

    if (ob.note = null || ob.note != undefined) {
        txtNote.value = ob.note;
    } else {
        txtNote.value = "";
    }

    const roles = getServiceRequest("/role/withoutadmin");
    let divRole = document.querySelector("#divRoles");
    divRole.innerHTML = "";

    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";
        divRole.appendChild(div);

        let inputCheck = document.createElement("input");
        inputCheck.type = "checkbox";
        inputCheck.id = role.id;
        inputCheck.className = "form-check-input";
        div.appendChild(inputCheck);

        inputCheck.onchange = () => {
            if (inputCheck.checked) {
                user.roles.push(role);
            } else {
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }
        let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
        if (extIndex != -1) {
            inputCheck.checked = true;
        }
        let label = document.createElement("label");
        label.className = "form-lable";
        label.innerText = role.name;
        div.appendChild(label);
    });

}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (user.employee_id == null) {
        empName.style.border = "2px solid red";
        errors = errors + "Enter Employee Name.! \n";
    }
    if (user.username == null) {
        txtUid.style.border = "2px solid red";
        errors = errors + "Enter User Name.! \n";
    }
    if (user.password == null) {
        txtUserPwd.style.border = "2px solid red";
        errors = errors + "Enter valid Password.! \n";
    }
    if (olduser == null) {
        if (txtrePwd.value == "") {
            txtrePwd.style.border = "2px solid red";
            errors = errors + "Re Enter Password.! \n";
        }
    }
    if (user.email == null) {
        txtEmail.style.border = "2px solid red";
        errors = errors + "Please Enter Email.! \n";
    }
    if (user.roles.length == 0) {
        errors = errors + "Please Select Role First.!\n"
    }
    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";
    if (olduser != null && user != null) {
        if (user.username != olduser.username) {
            updates = updates + "User ID has Updated from " + olduser.username + "--> " + user.username + " \n";
        }
        if (user.email != olduser.email) {
            updates = updates + "Email has Updated from " + olduser.email + "--> " + user.email + " \n";
        }
        if (user.status != olduser.status) {
            updates = updates + "Status has changed.!\n";
        }
        if (user.note != olduser.note) {
            updates = updates + "Note has changed.!\n";
        }
        if (user.roles.length != olduser.roles.length) {
            updates = updates + "Role has changed.!\n";
        }
    }
    return updates;
}

//define function for update button
const buttonUserUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();
        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated.!",
                icon: "info",
                showConfirmButton: false,
                timer: 1500
            });
            //window.alert("Nothing has Updated..!! \n")
        } else {
            // let userConfirm = window.alert("Are you sure you want to update following changes.? \n\n" + updates);
            Swal.fire({
                title: "Are you sure you want to update following changes.?",
                text: updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Update!"
            }).then((result) => {
                if (result.isConfirmed) {
                    //call put servuce
                    let putResponse = getHTTPServiceRequest('/user/update', "PUT", user);
                    if (putResponse == "OK") {
                        Swal.fire({
                            title: "Successfully Updated.!!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 2000
                        });
                        //window.alert("Updated Successfully..!!");
                        //refresh form &  table
                        window.location.reload();
                        $('#modalUser').modal('hide');
                    } else {
                        Swal.fire({
                            title: "Failed to Update.! Has following errors :",
                            text: putResponse,
                            icon: "info"
                        });
                        //window.alert("Failed to Update, Has following errors.! \n" + putResponse);
                    }
                }
            });
        }
    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors :",
            text: errors,
            icon: "error"
        });
        //window.alert("Has following Errors.!\n" + errors);
    }
}

//define function for submit button
const buttonUserSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        /* let userConfirm = window.confirm("Do you want to Submit following User..?"
            + "\n Emplyee Full Name : " + user.employee_id.fullname
            + "\n Emplyee UserID : " + user.username
            + "\n Emplyee Email : " + user.email); */
        Swal.fire({
            title: "Do you want to Create User Account for " + user.employee_id.fullname + " .?",
            text: "UserID : " + user.username
                + "\n Email : " + user.email,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post service
                let postResponse = getHTTPServiceRequest('/user/insert', "POST", user);
                console.log(postResponse);
                if (postResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully.!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    //window.alert("Save User Details Successfully..!!");
                    refreshUserForm();
                    refreshUserTable();
                    $('#modalUser').modal('hide');
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
                    //window.alert("Fail to Submit.! Following errors happened.! \n" + postResponse);
                }
            }
        });
    }
    else {
        Swal.fire({
            title: "Failed to Submit.! Has following errors :",
            text: errors,
            icon: "error"
        });
        //window.alert("Has following errors.! \n" + errors);
    }
}

//function define for delete user record
const userDelete = (ob, rowIndex) => {
    //function eke pass wena parameter eka/object eka user object eka wdyt danewa
    user = ob;
    Swal.fire({
        title: "Are you sure to Delete User " + user.username + ".?",
        text: "Emplyee : " + getEmpName(user),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            //call Delete service
            let deleteResponse = getHTTPServiceRequest('/user/delete', "DELETE", user);
            if (deleteResponse == "OK") {
                Swal.fire({
                    title: "Deleted Successfully.!",
                    text: "User has Deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                //refresh table & Form
                refreshUserForm();
                refreshUserTable();
                $('#modalUser').modal('hide');
            } else {
                Swal.fire({
                    title: "Failed to Delete.!",
                    text: deleteResponse,
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                text: "Your data is safe!",
                icon: "error"
            });
        }
    });


    /* let userConfirm = window.confirm("Are you sure want to delete following User.? \n"
        + "\n Emplyee Full Name : " + getEmpName(user)
        + "\n Emplyee UserID : " + user.username
        + "\n Emplyee Email : " + user.email);

    if (userConfirm) {
        //call Delete service
        let deleteResponse = getHTTPServiceRequest('/user/delete', "DELETE", user);

        if (deleteResponse == "OK") {
            window.alert("Deleted Successfulle...!!");
            //refresh form &  table
            refreshUserForm();
            refreshUserTable();
            $('#canvasUser').offcanvas('hide');
        } else {
            window.alert("Failed to Delete : Has following errors. \n" + deleteResponse);
        }
    } */
}

//function define for print user record
/* const userPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(userTableBody, rowIndex, "cornsilk");

    let newWindow = window.open();
    let printView = '<html>'
        + '<head>'
        + '<link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">'
        + '<title>BIT Project | 2025</title></head>'
        + '<body><h1>Print User Details</h1>'
        + '<table class="table-bordered table-stripped border-1 w-25">'
        + '<tr><th>User Name :</th><td>' + ob.employee_id.fullname + '</td></tr>'
        + '<tr><th>User ID :</th><td>' + ob.username + '</td></tr>'
        + '<tr><th>Email :</th><td>' + ob.email + '</td></tr>'
        + '<tr><th>Role :</th><td>' + ob.role.name + '</td></tr>'
        + `<tr><th>Status  : </th><td>${ob.status_id.status}</td></tr>`
        + '</table>'
        + '</body></html>'
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
} */

//define function for delete
const buttonUserDelete = () => {
    refreshUserTable();
}

//define function for modal close and refresh form
const buttonModalClose = () => {
    Swal.fire({
        title: "Are you Sure to Close User Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshUserForm();
            $('#modalUser').modal('hide');
        }
    });
}

const pswdValidator = () => {
    if (txtUserPwd.value === txtrePwd.value) {
        user.password = txtUserPwd.value;
        txtrePwd.style.border = "2px solid green";
    } else {
        user.password = null;
        txtrePwd.style.border = "solid red 2px";
    }
}

//define function for clear/reset button
const buttonUserClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshUserForm();
        }
    });

    /* let userConfirm = window.confirm("Do you want to Refresh Form..?");
    if (userConfirm) {
        refreshUserForm();
    } */
}
/* const selectMultiElementValidator = () => {

} */