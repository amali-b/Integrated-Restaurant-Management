//function for load browser
window.addEventListener("load", () => {

    //call form refrech function
    refreshEmpForm();

    //call table refresh function
    refreshEmpTable();

});

// function for display clear button when hover on img
document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.getElementById('clearBtn');
    const container = document.getElementById('imgContainer');

    // Show button on hover
    container.addEventListener('mouseenter', () => {
        clearBtn.style.display = 'inline';
    });
    // hide button when mouse leave
    container.addEventListener('mouseleave', () => {
        clearBtn.style.display = 'none';
    });
    // Clear image on button click
    clearBtn.onclick = () => {
        imgEmployee.value = "";
        imgPreview.src = "images/userimage.png";
        window[object][property] = null;
    };
});

//define function for form refresh
const refreshEmpForm = () => {
    formEmp.reset();
    /* btnsubmit.disabled = false;
    btnupdate.disabled = true; */
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    //define object
    employee = new Object();

    imgEmployee.value = "";
    imgPreview.src = "images/userimage.png";

    /* const designations = [
        //id = property , name = value, values hama thanama 100% samana wenna one
        { id: 1, name: "Manager" },
        { id: 2, name: "Cashier" },
        { id: 3, name: "As-Manager" },
        { id: 4, name: "Admin" },
        { id: 5, name: "Chef" },
        { id: 6, name: "Owner" },
        { id: 7, name: "Waiter" },
        { id: 8, name: "Delivery Driver" }
    ]; */
    const designations = getServiceRequest("/designation/alldata");

    /* const employeeStatuses = [
        { id: 1, status: "Working" },
        { id: 2, status: "Resigned" },
        { id: 3, status: "Removed" },
        { id: 4, status: "Trainee" }
    ]; */
    const employeeStatuses = getServiceRequest("employeestatus/alldata");

    const civilStatuses = getServiceRequest("civilstatus/alldata");

    fillDropdown(selectDesignation, "Select Employee Designation", designations, "name");
    fillDropdown(empStatus, "Select Employee Status", employeeStatuses, "status");
    fillDropdown(civilStatus, "Select Civil Status", civilStatuses, "status");

    setDefault([txtfullName, txtcName, txtNic, txtEmail, txtNumber, txtAdres, txtNote, selectDesignation, empStatus, civilStatus]);

    // status eka form eka open weddima active wdyt select wenna
    //select value eka string wenna one nisa object eka string baweta convert krenw
    empStatus.value = JSON.stringify(employeeStatuses[0]);
    // customerStatus list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    employee.employeestatus_id = employeeStatuses[0];
    empStatus.style.border = "2px solid green";
}

//define function for refresh table data
const refreshEmpTable = () => {
    //datalist
    /* const employees = [
        {
            id: 1,
            empid: "EMP240001",
            fullname: "Amali Bhuvisara Abeysekera",
            callingname: "",
            mobile: "0713265485",
            nic: "200152103499",
            dob: "2001-01-21",
            gender: "Female",
            civilstatus: "Single",
            email: "amalibhuvisara@gmail.com",
            designation_id: { id: 4, name: "Admin" },
            employeeStatus_id: { id: 1, status: "Working" },
        }
    ]; */

    let employees = getServiceRequest("/employee/allempdata");

    //columnlist
    const columnList = [
        { property: "emp_uid", dataType: "string" },
        { property: "fullname", dataType: "string" },
        { property: "nic", dataType: "string" },
        { property: "mobile_no", dataType: "string" },
        { property: "email", dataType: "string" },
        { property: "dob", dataType: "string" },
        { property: getGender, dataType: "function" },
        { property: getDesignation, dataType: "function" },
        { property: getEmpStatus, dataType: "function" }
    ];

    //call fill data into table funftion (TablebodyID, datalist, columnlist, editFunctionName, printFunctionName, deleteFunctionName, buttonvisibility)
    fillTableThree(tableBody, employees, columnList, employeeFormRefill, true);
    $('#tableEmployee').DataTable();
}

//data Types
//string --> text / number / date
//function --> object / array / boolean / customize
const getGender = (dataOb) => {
    if (dataOb.gender == "Female") {
        return "<div class='text-center'><i class='fa-solid fa-person-dress fa-2x' style='color:pink'></i></div>";
    } else {
        return "<div class='text-center'><i class='fa-solid fa-person fa-2x' style='color:blue'></i></div>";
    }
}

const getDesignation = (dataOb) => {
    return dataOb.designation_id.name;
}

const getEmpStatus = (dataOb) => {
    if (dataOb.employeestatus_id.status == "Working") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.employeestatus_id.status + "</p>";
    }
    if (dataOb.employeestatus_id.status == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.employeestatus_id.status + "</p>";
    }
    if (dataOb.employeestatus_id.status == "Resigned") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.employeestatus_id.status + "</p>";
    }
    if (dataOb.employeestatus_id.status == "Trainee") {
        return "<p class='btn btn-outline-info text-center'>" + dataOb.employeestatus_id.status + "</p>";
    }
    return dataOb.employeestatus_id.status;
}

//define Form edit function
const employeeFormRefill = (ob, rowIndex) => {
    $('#collapsEmpForm').collapse('show');

    // btnsubmit.disabled = true;
    // btnupdate.disabled = false;
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    employee = JSON.parse(JSON.stringify(ob)); //change wena ekata wenama namak danewa
    oldemployee = JSON.parse(JSON.stringify(ob)); //parana 

    txtfullName.value = ob.fullname;

    //generate calling name
    let fullNameParts = txtfullName.value.split(" ");
    dlcallingName.innerHTML = "";
    fullNameParts.forEach(part => {
        let option = document.createElement("option");
        option.innerText = part;
        if (part.length > 2) {
            dlcallingName.appendChild(option);
        }
    });
    txtcName.value = ob.callingname;

    //for optional properties, use as this
    if (ob.address != undefined || ob.address != null) {
        txtAdres.value = ob.address;
    } else {
        txtAdres.value = "";
    }

    txtNic.value = ob.nic;
    txtEmail.value = ob.email;
    txtNumber.value = ob.mobile_no;
    dateDOB.value = ob.dob;

    if (ob.gender == "Male") {
        radioMale.checked = "checked";
    } else {
        radioFemale.checked = "checked";
    }

    civilStatus.value = JSON.stringify(ob.civilstatus_id);
    selectDesignation.value = JSON.stringify(ob.designation_id);
    empStatus.value = JSON.stringify(ob.employeestatus_id);
    // reset photo
    if (ob.employeeimage != null) {
        imgPreview.src = atob(ob.employeeimage);
    } else {
        imgPreview.src = "images/userimage.png";
    }

    if (ob.note == undefined) {
        txtNote.value = "";
    } else {
        txtNote.value = ob.note;
    }

    // check user privilege and enable or disable update button
    /* if (userPrivilege.privi_update) {
        btnupdate.disabled = false;
    } else {
        btnupdate.disabled = true;
    } */
}

//define function for print
const employeePrint = (ob, rowIndex) => {
    idH3.innerText = ob.fullname;
    tdEmpId.innerText = ob.emp_uid;
    tdEmpFname.innerText = ob.fullname;
    tdNic.innerText = ob.nic;
    tdMobile.innerText = ob.mobile_no;
    tdDob.innerText = ob.dob;
    tdGender.innerText = ob.gender;
    tdDesignation.innerText = ob.designation_id.name;
    tdStatus.innerText = ob.employeestatus_id.status;
}

//define print function for modal
const printEmployeeRow = () => {
    let newWindow = window.open();
    newWindow.document.writeln(
        '<html><head><link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css"><script src="bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>' +
        '<title> Print | Employee Details </title><head>' +
        '<body>'
        + `<h1>Employee Record</h1>`
        //outterHTML eken tag dekath ekkama allenewa. Inner eken tag eka athule wthrai gnne
        + tableEmployeeRowPrint.outerHTML
        + '</body></html>'
    );
    setInterval(() => {
        //window eka load wena eka naweththenewa
        newWindow.stop();
        //print option eka open wenna
        newWindow.print();
        //print model eke close eka click kalama tab ekath close wenw
        newWindow.close();
    }, 300);
}

//define function for delete employee
const employeeDelete = (ob, rowIndex) => {
    employee = ob;

    //############## SWEET ALERT ############
    title = "Are you sure to Delete Employee.?";
    obName = ob.fullname;
    text = "Email : " + ob.email
        + ", Supplier Status : " + ob.employeestatus_id.status;
    let deleteResponse = getHTTPServiceRequest('/employee/delete', "DELETE", employee);
    message = "Employee has Deleted.";
    swalDelete(title, obName, text, deleteResponse, collapsEmpForm, message);

    /* Swal.fire({
        title: "Are you sure to Delete Employee.?",
        text: ob.fullname,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            //call Delete service
            let deleteServerResponse = getHTTPServiceRequest('/employee/delete', "DELETE", employee);
            if (deleteServerResponse == "OK") {
                Swal.fire({
                    title: "Deleted Successfully.!",
                    text: "Employee has Deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                //refresh table & Form
                refreshEmpTable();
                refreshEmpForm();
                $('#collapsEmpForm').collapse('hide');
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
    }); */

    /* let userConfirm = window.confirm("Are you sure you want to delete selected Employee.??\n"
        + "\n Emplyee UserID : " + ob.emp_uid
        + "\n Emplyee Full Name : " + ob.fullname
        + "\n Emplyee NIC : " + ob.nic
        + "\n Emplyee Email : " + ob.email);

    if (userConfirm) {
        //call Delete service
        let deleteServerResponse = getHTTPServiceRequest('/employee/delete', "DELETE", employee);

        if (deleteServerResponse == "OK") {
            window.alert("Deleted Successfully.!!");
            //refresh table & Form
            refreshEmpTable();
            refreshEmpForm();
            $('#collapsEmpForm').collapse('hide');
        } else {
            //window.alert("Failed to Delete.!\n" + deleteServerResponse);
            swal("Failed to Delete.!", {
                icon: "error", text: deleteServerResponse
            });
        }
    } */
}

//define function for check form errors
const checkFormError = () => {
    let errors = "";
    if (employee.fullname == null) {
        txtfullName.style.border = "2px solid red";
        errors = errors + "Please Enter Full Name.! \n";
        //errors = "" + "Please Enter Full Name.! \n";
    }
    if (employee.callingname == null) {
        txtcName.style.border = "2px solid red";
        errors = errors + "Please Select Calling Name.! \n";
        //error = "Please Enter Full Name.!" + "Please Select Calling Name.! \n"
    }
    if (employee.address == null) {
        txtAdres.style.border = "2px solid red";
        errors = errors + "Please Enter Address.! \n";
    }
    if (employee.nic == null) {
        txtNic.style.border = "2px solid red";
        errors = errors + "Please Enter NIC Number.! \n";
    }
    if (employee.email == null) {
        txtEmail.style.border = "2px solid red";
        errors = errors + "Please Enter Email.! \n";
    }
    if (employee.mobile_no == null) {
        txtNumber.style.border = "2px solid red";
        errors = errors + "Please Enter Contact Details.! \n";
    }
    if (employee.dob == null) {
        dateDOB.style.border = "2px solid red";
        errors = errors + "Please Select Date of Birth.! \n";
    }
    if (employee.civilstatus_id == null) {
        civilStatus.style.border = "2px solid red";
        errors = errors + "Please Select Civil Status.! \n";
    }
    if (employee.designation_id == null) {
        selectDesignation.style.border = "2px solid red";
        errors = errors + "Please Select Designation.! \n";
    }
    if (employee.employeestatus_id == null) {
        empStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    return errors;
}

//define function for submit button
const buttonEmployeeSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();

    title = "Are you sure to Submit Employee ";
    obName = employee.fullname;
    text = "Mobile No. : " + employee.mobile_no
        + ", NIC : " + employee.nic
        + ", Designatiom : " + employee.designation_id.name
        + ", Status : " + employee.employeestatus_id.status;
    let submitResponse = getHTTPServiceRequest('/employee/insert', "POST", employee);
    swalSubmit(errors, title, obName, text, submitResponse, collapsEmpForm);

    /* if (errors == "") {
        Swal.fire({
            title: "Are you sure to Submit Employee " + employee.fullname + " .?",
            text: "\n Mobile No. : " + employee.mobile_no + " NIC : " + employee.nic
                + " Designatiom : " + employee.designation_id.name
                + " Status : " + employee.employeestatus_id.status,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post service
                let submitResponse = getHTTPServiceRequest('/employee/insert', "POST", employee);
                if (submitResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully.!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refreshEmpForm();
                    refreshEmpTable();
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors : ",
                        text: submitResponse,
                        icon: "info"
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: "Failed to Submit.! Has following errors : ",
            text: errors,
            icon: "error"
        });
        //window.alert("Failed to Submit.! Has Following Errors : \n" + errors);
    } */
    /* const userConfirm = window.confirm("Are you sure you want to Submit following employee Detail.?\n "
        + "\n Employee Number : " + employee.emp_uid
        + "\n Employee Fullname : " + employee.fullname
        + "\n Employee Callingname : " + employee.callingname
        + "\n Employee NIC : " + employee.nic
        + "\n Employee Email : " + employee.email
        + "\n Employee Mobile No. : " + employee.mobile_no
        + "\n Designatiom : " + employee.designation_id.name
        + "\n Status : " + employee.employeestatus_id.status
    );
    if (userConfirm) {
        //call post service
        let submitResponse = getHTTPServiceRequest('/employee/insert', "POST", employee);
        if (submitResponse == "OK") {
            Swal.fire({
                title: "Saved Successfully.!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            refreshEmpForm();
            refreshEmpTable();
        } else {
            Swal.fire({
                title: "Save not Completed..!",
                text: "Has following errors : " + submitResponse,
                icon: "info"
            });
            //window.alert("Save not Completed..! \n Has following errors : \n" + submitResponse);
        }
    } */

}

//define function form check update
const checkFormUpdate = () => {
    let updates = "";

    if (employee != null && oldemployee != null) {
        if (employee.fullname != oldemployee.fullname) {
            updates = updates + "Full Name has Updated from " + oldemployee.fullname + "--> " + employee.fullname + " \n";
        }
        if (employee.callingname != oldemployee.callingname) {
            updates = updates + "Calling Name has Updated..! \n";
        }
        if (employee.address != oldemployee.address) {
            updates = updates + "Address has Updated from " + oldemployee.address + "--> " + employee.address + " \n";
        }
        if (employee.nic != oldemployee.nic) {
            updates = updates + "NIC has Updated from " + oldemployee.nic + "--> " + employee.nic + " \n";
        }
        if (employee.email != oldemployee.email) {
            updates = updates + "Email has Updated from " + oldemployee.email + "--> " + employee.email + " \n";
        }
        if (employee.mobile_no != oldemployee.mobile_no) {
            updates = updates + "Contact Details has Updated from " + oldemployee.mobile_no + "--> " + employee.mobile_no + " \n";
        }
        if (employee.dob != oldemployee.dob) {
            updates = updates + "Birth Date has Updated from " + oldemployee.dob + "--> " + employee.dob + " \n";
        }
        if (employee.gender != oldemployee.gender) {
            updates = updates + "Gender has Updated from " + oldemployee.gender + "--> " + employee.gender + " \n";
        }
        if (employee.civilstatus_id.status != oldemployee.civilstatus_id.status) {
            updates = updates + "Civil Status has Updated from " + oldemployee.civilstatus_id.status + "--> " + employee.civilstatus_id.status + " \n";
        }
        if (employee.designation_id.name != oldemployee.designation_id.name) {
            updates = updates + "Designation has Updated from " + oldemployee.designation_id.name + "--> " + employee.designation_id.name + " \n";
        }
        if (employee.employeestatus_id.status != oldemployee.employeestatus_id.status) {
            updates = updates + "Employee Status has Updated from " + oldemployee.employeestatus_id.status + "--> " + employee.employeestatus_id.status + " \n";
        }
        if (employee.employeeimage != oldemployee.employeeimage) {
            updates = updates + "Employee Photo has Updated! \n";
        }
    }
    return updates;
}

//define function for update button
const buttonEmployeeUpdate = () => {
    console.log(employee);

    //check if there are any errors
    let errors = checkFormError();

    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();
        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = getHTTPServiceRequest('/employee/update', "PUT", employee);
        swalUpdate(updates, title, text, updateResponse, collapsEmpForm);

        /* if (updates == "") {
            Swal.fire({
                title: "Nothing Updated.!",
                icon: "info",
                showConfirmButton: false,
                timer: 1500
            });
            //window.alert("Nothing Updated.!!");
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
                    let updateResponse = getHTTPServiceRequest('/employee/update', "PUT", employee);
                    if (updateResponse == "OK") {
                        Swal.fire({
                            title: "Successfully Updated..!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        //window.alert("Updated Successfull..!");
                        window.location.reload();
                    } else {
                        Swal.fire({
                            title: "Failed to Update.! Has following errors : ",
                            text: updateResponse,
                            icon: "info"
                        });
                    }
                }
            });
            
            /* let userConfirm = window.confirm("Are you sure you want to update following changes.?? \n\n" + updates);
            if (userConfirm) {
                //call put service
                let updateResponse = getHTTPServiceRequest('/employee/update', "PUT", employee);
                if (updateResponse == "OK") {
                    Swal.fire({
                        title: "Successfully Updated.!!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    //window.alert("Successfully Updated.!!");
                    window.location.reload();
                } else {
                    Swal.fire({
                        title: "Failed to Update.!",
                        text: "Has following errors : " + updateResponse,
                        icon: "info"
                    });
                    //window.alert("Failed to Update.! Has following errors : \n" + updateResponse);
                }
            }
        } */
    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors : ",
            text: errors,
            icon: "error"
        });
        //window.alert("Form Has Following Errors..!! \n" + errors);
    }
}

// define function for Delete buttton
const buttonEmployeeDelete = () => {
    refreshEmpTable();
}

// define function for clear buttton
const buttonEmployeeClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshEmpForm();
        }
    });
    /* let userConfirm = window.confirm("Do you want to Refresh Form..?");
    if (userConfirm) {
        refreshEmpForm();
    } */
}


/* ############################# VALIDATION ################################# */

//define function for validate full name
txtfullName.addEventListener("keyup", () => {
    const fullNameValue = txtfullName.value;
    //pattern to validate name
    const regPattern = new RegExp("^([A-Z][a-z]{1,20}[ ])+([a-z]{2}[ ])?([A-Z][a-z]{1,20})$");
    if (regPattern.test(fullNameValue)) {
        //valid value
        employee.fullname = fullNameValue;
        txtfullName.style.border = "2px solid green";
    } else {
        //invalid value
        employee.fullname = null;
        txtfullName.style.border = "red solid 2px";
    }

    //generate calling name validation
    let fullNameParts = fullNameValue.split(" ");
    dlcallingName.innerHTML = "";
    fullNameParts.forEach(part => {
        let option = document.createElement("option");
        option.innerText = part;
        if (part.length > 2) {
            dlcallingName.appendChild(option);
        }
    });
});

//define function for validate NIC
txtNic.addEventListener("keyup", () => {
    const nicValue = txtNic.value;
    const regPattern = new RegExp("^(((([6][4-9])|([7-9][0-9]))[0-9]{7}[VvXx])|((([1][9][6-9][0-9])|([2][0][0][1-6]))[0-9]{8}))$");

    if (regPattern.test(nicValue)) {
        //valid nic
        employee.nic = nicValue;
        txtNic.style.border = "2px solid green";

        //generate gender and DOB
        let birthyear, birthdate;

        //646299500V
        if (nicValue.length == 10) {
            birthyear = "19" + nicValue.substring(0, 2);// index (0 & 1) ==> 6 & 4
            //2 ha 5 athara value tika gnnewa (2, 3, 4)
            birthdate = nicValue.substring(2, 5);
            //200152103499
        } else {
            birthyear = nicValue.substring(0, 4)
            //4 ha 7 athara value tika (4, 5, 6)
            birthdate = nicValue.substring(4, 7);
        }
        console.log("Birthday" + birthyear, birthdate);

        //nic string value ekak substring ekak kalama return kranneth stringmai, greater than check kranna substring walin bari nisa int value welata maru kregnnawa ParseInt use krela
        if (parseInt(birthdate) > 500) {
            radioFemale.checked = true;
            employee.gender = "Female";
            // get birthdate
            birthdate = parseInt(birthdate) - 500;

        } else {
            radioMale.checked = true;
            employee.gender = "Male";
        }

        let birthdateOb = new Date(birthyear + "-01-01"); //jan 1 wenidain ptn gnne new date ekk hdagnnewa
        birthdateOb.setDate(parseInt(birthdate));
        // adika auruddakda kyl check krenewa
        /* adika auruddaknm year/4 != 0 saha (Jan+Feb) days == 61 nisa */
        if (parseFloat(birthyear) % 4 != 0 && parseInt(birthdate) > 60) {
            birthdateOb.setDate(birthdateOb.getDate() - 1);
        }

        // month enne array ekakin month[0-11] nisa 1k ekathu krenewa
        let month = birthdateOb.getMonth() + 1;
        let date = birthdateOb.getDate();
        /* 1-9 */
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }

        // get birthday
        dateDOB.value = birthyear + "-" + month + "-" + date;
        employee.dob = dateDOB.value;
        dateDOB.style.border = "solid green 2px";

        // get age
        /* let currentYear = new Date().getFullYear();
            age = currentYear - birthyear; 
        */
    } else {
        //invalid value
        employee.nic = null;
        employee.dob = null;
        employee.gender = null;
        txtNic.style.border = "solid red 2px";
    }
});