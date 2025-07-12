//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshPrivilegeTable();
});

//define function for refresh form
const refreshForm = () => {
    formPriv.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";
    //define new object
    privilege = new Object();


    /* const roles = [
        { id: 1, name: "Manager" },
        { id: 2, name: "Cashier" },
        { id: 3, name: "As-Manager" },
        { id: 4, name: "Admin" },
        { id: 5, name: "Chef" },
        { id: 6, name: "Owner" },
        { id: 7, name: "Waiter" },
        { id: 8, name: "Delivery Driver" }
    ]; */

    const roles = getServiceRequest("/role/alldata");

    /* const modules = [
        { id: 1, name: "Employee" },
        { id: 2, name: "Invoice" },
        { id: 3, name: "Report" },
        { id: 4, name: "Kitchen" },
        { id: 5, name: "Delivery" },
        { id: 6, name: "Payment" },
        { id: 7, name: "Reservation" },
        { id: 2, name: "Delivery" },
        { id: 8, name: "Submenu" },
        { id: 9, name: "Menu" }
    ]; */

    const modules = getServiceRequest("/module/alldata");

    //call fill dropdown function
    fillDropdown(selectRole, "Select Role", roles, "name");
    fillDropdown(selectModule, "Select Module", modules, "name");

    checkboxSelect.checked = false;
    privilege.privi_select = false;

    checkboxInsert.checked = false;
    privilege.privi_insert = false;

    checkboxUpdate.checked = false;
    privilege.privi_update = false;

    checkboxDelete.checked = false;
    privilege.privi_delete = false;

    setDefault([selectRole, selectModule]);
}

//create refresh function
const refreshPrivilegeTable = () => {
    /* const privileges = [
            {
                id: 1, privi_select: true, privi_update: true, privi_insert: true, privi_delete: true,
                role_id: { id: 1, name: "Manager" }, module_id: { id: 1, name: "Employee" }
            },
            {
                id: 2, privi_select: true, privi_update: false, privi_insert: false, privi_delete: false,
                role_id: { id: 2, name: "Cashier" }, module_id: { id: 1, name: "Employee" }
            },
            {
                id: 3, privi_select: true, privi_update: true, privi_insert: false, privi_delete: false,
                role_id: { id: 2, name: "Cashier" }, module_id: { id: 2, name: "Invoice" }
            }]; */

    let privileges = getServiceRequest("/privilege/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: getRole, dataType: "function" }, //object
        { property: getModule, dataType: "function" }, //object
        { property: getSelect, dataType: "function" }, // boolean
        { property: getInsert, dataType: "function" }, // boolean
        { property: getUpdate, dataType: "function" }, // boolean
        { property: getDelete, dataType: "function" } // boolean
    ];

    //call fill data into table
    /*   function(tablebodyID, datalist, columnlist, editFunction, printFunction, deleteFunction, button visibility)
       $('#tablePrivilege').DataTable();
      fillTable(tBodyPrivilege, privileges, columns, privilegeFormRefill, privilegeDelete, privilegePrint);
      fillTableTwo(tBodyPrivilege, privileges, columns, privilegeFormRefill, privilegeDelete, privilegePrint, true); */

    fillTableFour(tBodyPrivilege, privileges, columns, privilegeFormRefill, true);
    $('#tablePrivilege').DataTable();
}

const getRole = (ob) => {
    return ob.role_id.name;
}

const getModule = (ob) => {
    return ob.module_id.name;
}

const getSelect = (ob) => {
    if (ob.privi_select) {
        return "Granted";
    } else {
        return "NOT Granted";
    }
}

const getInsert = (ob) => {
    if (ob.privi_insert) {
        return "Granted";
    } else {
        return "NOT Granted";
    }
}

const getUpdate = (ob) => {
    if (ob.privi_update) {
        return "Granted";
    } else {
        return "NOT Granted";
    }
}

const getDelete = (ob) => {
    if (ob.privi_delete) {
        return "Granted";
    } else {
        return "NOT Granted";
    }
}

//function define for edit privilege record
const privilegeFormRefill = (ob, rowIndex) => {
    $('#modalPrivilege').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    privilege = JSON.parse(JSON.stringify(ob));
    oldprivilege = JSON.parse(JSON.stringify(ob));

    selectRole.value = JSON.stringify(ob.role_id);
    selectModule.value = JSON.stringify(ob.module_id);

    if (ob.privi_select) {
        checkboxSelect.checked = true;
    } else {
        checkboxSelect.checked = false;
    }
    if (ob.privi_insert) {
        checkboxInsert.checked = true;
    } else {
        checkboxInsert.checked = false;
    }
    if (ob.privi_update) {
        checkboxUpdate.checked = true;
    } else {
        checkboxUpdate.checked = false;
    }
    if (ob.privi_delete) {
        checkboxDelete.checked = true;
    } else {
        checkboxDelete.checked = false;
    }
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (privilege.role_id == null) {
        errors = errors + "Please Select Role First.!\n"
        selectRole.style.borderBottom = "2px solid red";
    }
    if (privilege.module_id == null) {
        errors = errors + "Please Select Module.!\n"
        selectModule.style.borderBottom = "2px solid red";
    }
    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";
    if (oldprivilege != null && privilege != null) {
        if (privilege.role_id.name != oldprivilege.role_id.name) {
            updates = updates + "Role has changed.!\n";
        }
        if (privilege.module_id.name != oldprivilege.module_id.name) {
            updates = updates + "Module has changed.!\n";
        }
        if (privilege.privi_select != oldprivilege.privi_select) {
            updates = updates + "Select Privilege has changed.!\n";
        }
        if (privilege.privi_insert != oldprivilege.privi_insert) {
            updates = updates + "Insert Privilege has changed.!\n";
        }
        if (privilege.privi_update != oldprivilege.privi_update) {
            updates = updates + "Update Privilege has changed.!\n";
        }
        if (privilege.privi_delete != oldprivilege.privi_delete) {
            updates = updates + "Delete Privilege has changed.!\n";
        }
    }

    return updates;
}

//define function for update button
const buttonPrivilegeUpdate = () => {
    refreshPrivilegeTable();
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
            //window.alert("Nothing has Updated.!\n")
        } else {
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
                    //call put service
                    let putResponse = getHTTPServiceRequest('/privilege/update', "PUT", privilege);
                    if (putResponse == "OK") {
                        Swal.fire({
                            title: "Successfully Updated.!!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        //window.alert("Updated Successfully..!");
                        /*  refreshForm();
                         refreshPrivilegeTable(); */
                        window.location.reload();
                    } else {
                        Swal.fire({
                            title: "Failed to Update.! Has following errors :",
                            text: putResponse,
                            icon: "info"
                        });
                        //window.alert("Failed to Update..! Has following Errors : \n" + putResponse);
                    }
                }
            });
            // let userConfirm = window.confirm("Are you sure you want to update following changes.? \n\n" + updates);
        }
    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors :",
            text: errors,
            icon: "error"
        });
        // window.alert("Has following Errors.!\n" + errors);
    }
}

//define function for submit button
const buttonPrivilegeSubmit = () => {
    refreshPrivilegeTable();
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        /* let userConfirm = window.confirm("Do you want to Submit following details.?" +
            "\n Role : " + privilege.role_id.name +
            "\n Module : " + privilege.module_id.name +
            "\n Select is " + getSelect(privilege) +
            "\n Insert is " + getInsert(privilege) +
            "\n Update is " + getUpdate(privilege) +
            "\n Delete is " + getDelete(privilege)
        ); */
        Swal.fire({
            title: "Do you want to Submit Privilege for " + privilege.role_id.name + " .?",
            text: "Module : " + privilege.module_id.name +
                "\n Select is " + getSelect(privilege) +
                "\n Insert is " + getInsert(privilege) +
                "\n Update is " + getUpdate(privilege) +
                "\n Delete is " + getDelete(privilege),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post service
                let postResponse = getHTTPServiceRequest('/privilege/insert', "POST", privilege);
                if (postResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully.!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1000
                    });
                    //window.alert("Save Details Successfully.!");
                    //refreshForm(); refreshPrivilegeTable(); browser eka refresh krenewa wenwt mewa use krnnth puluwn
                    window.location.reload();
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
                    // window.alert("Fail to Submit.! Following errors happened : \n" + postResponse);
                }
            }
        });
    } else {
        Swal.fire({
            title: "Failed to Submit.! Has following errors :",
            text: errors,
            icon: "error"
        });
        //window.alert("Has following errors.! \n" + errors);
    }
}

//define function for delete
const buttonPrivilegeDelete = () => {
    refreshPrivilegeTable();
}

//function define for delete privilege record
const privilegeDelete = (ob, rowIndex) => {
    privilege = ob;

    Swal.fire({
        title: "Are you sure to Delete Privilege of " + privilege.role_id.name + " .?",
        text: "Module : " + privilege.module_id.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            //call Delete service
            let deleteResponse = getHTTPServiceRequest('/privilege/delete', "DELETE", privilege);
            if (deleteResponse == "OK") {
                Swal.fire({
                    title: "Deleted Successfully.!",
                    text: "Privilege has been deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                //refresh table & Form
                refreshPrivilegeTable();
                refreshForm();
                $('#modalPrivilege').modal('hide');
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
    /* let userConfirm = window.confirm("Are you sure to delete following privilege.? \n"
        + "\n Role : " + privilege.role_id.name
        + "\n Module : " + privilege.module_id.name);

    if (userConfirm) {
        //let deleteResponse = "OK";
        let deleteResponse = getHTTPServiceRequest('/privilege/delete', "DELETE", privilege);

        if (deleteResponse == "OK") {
            window.alert("Deleted Successfully..!");
            //refresh form &  table
            refreshPrivilegeTable();
            refreshForm();
            $('#modalPrivilege').modal('hide');
        } else {
            window.alert("Failed to delete..! Has following Errors :  \n" + deleteResponse);
        }
    } */
}

/* //function define for print privilege record
const privilegePrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodyPrivilege, rowIndex, "White");

    let newWindow = window.open();
    let printView = '<html>'
        + '<head>'
        + '<link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">'
        + '<title>BIT Project | 2025</title></head>'
        + '<body><h1>Print Privilege Details</h1>'
        + '<table class="table-bordered table-stripped border-1 w-25">'
        + '<tr><th>Role :</th><td>' + ob.role_id.name + '</td></tr>'
        + `<tr><th>Module : </th><td>${ob.module_id.name}</td></tr>`
        + `<tr><th>Select : </th><td>${getSelect(ob)}</td></tr>`
        + `<tr><th>Insert : </th><td>${getInsert(ob)}</td></tr>`
        + `<tr><th>Update : </th><td>${getUpdate(ob)}</td></tr>`
        + `<tr><th>Delete : </th><td>${getDelete(ob)}</td></tr>`
        + '</table>'
        + '</body></html>'
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
} */

//define function for 
const buttonPrivilegeClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
        }
    });
}

//define function for modal close and refresh form
const buttonModalClose = () => {
    Swal.fire({
        title: "Are you Sure to Close Privilege Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
            $('#modalPrivilege').modal('hide');
            //call refresh table function
            refreshPrivilegeTable();
        }
    });
}
