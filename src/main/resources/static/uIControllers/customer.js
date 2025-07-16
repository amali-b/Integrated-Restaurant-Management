//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();
    //call refresh table function
    refreshCustomerTable();
});

//define function for refresh form
const refreshForm = () => {
    formCustomer.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    //define new object
    customer = new Object();

    //get customer status
    const customerStatus = getServiceRequest("/customerStatus/alldata");
    fillDropdown(cusStatus, "Select Status", customerStatus, "status");

    setDefault([cusStatus, titleCus, txtfirstName, txtlastName, txtNumber, txtEmail, txtAdres]);

    // status eka form eka open weddima active wdyt select wenna
    //select value eka string wenna one nisa object eka string baweta convert krenw
    cusStatus.value = JSON.stringify(customerStatus[0]);
    // customerStatus list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    customer.customerstatus_id = customerStatus[0];
    cusStatus.style.border = "2px solid green";
    cusStatus.disabled = true;
}

//create refresh table function
const refreshCustomerTable = () => {

    let customers = getServiceRequest("/customer/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "reg_no", dataType: "string" },
        { property: "title", dataType: "string" },
        { property: "firstname", dataType: "string" },
        { property: "lastname", dataType: "string" },
        { property: "contact_no", dataType: "string" },
        { property: "address", dataType: "string" },
        { property: "email", dataType: "string" },
        { property: getCustStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodyCustomer, customers, columns, customerFormRefill, true);
    $('#tableCustomer').DataTable();
}

const getCustStatus = (dataOb) => {
    if (dataOb.customerstatus_id.status == "New") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.customerstatus_id.status + "</p>";
    }
    if (dataOb.customerstatus_id.status == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.customerstatus_id.status + "</p>";
    }
    if (dataOb.customerstatus_id.status == "Regular") {
        return "<p class='btn btn-outline-primary text-center'>" + dataOb.customerstatus_id.status + "</p>";
    }
    return dataOb.customerstatus_id.status;
}

//define Form edit function
const customerFormRefill = (ob, rowIndex) => {
    $('#modalCustomer').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    customer = JSON.parse(JSON.stringify(ob));
    oldcustomer = JSON.parse(JSON.stringify(ob));

    titleCus.value = ob.title;
    txtfirstName.value = ob.firstname;
    txtlastName.value = ob.lastname;
    txtNumber.value = ob.contact_no;
    txtEmail.value = ob.email;
    cusStatus.value = JSON.stringify(ob.customerstatus_id);
    cusStatus.disabled = false;

    //for optional properties, use as this
    if (ob.address != undefined || ob.address != null) {
        txtAdres.value = ob.address;
    } else {
        txtAdres.value = "";
    }

    if (ob.customerstatus_id.status == "Removed") {
        btndelete.style.display = "none";
    } else {
        btndelete.style.display = "inline";
    }
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (customer.title == null) {
        titleCus.style.border = "2px solid red";
        errors = errors + "Please Select title.! \n";
    }
    if (customer.firstname == null) {
        txtfirstName.style.border = "2px solid red";
        errors = errors + "Please Enter valid First Name.! \n";
    }
    if (customer.lastname == null) {
        txtlastName.style.border = "2px solid red";
        errors = errors + "Please Enter valid Last Name.! \n";
    }
    if (customer.contact_no == null) {
        txtNumber.style.border = "2px solid red";
        errors = errors + "Please Enter valid Phone Number.! \n";
    }
    if (customer.address == null) {
        txtAdres.style.border = "2px solid red";
        errors = errors + "Please Enter valid Address.! \n";
    }
    if (customer.email == null) {
        txtEmail.style.border = "2px solid red";
        errors = errors + "Please Enter valid Email.! \n";
    }
    if (customer.customerstatus_id == null) {
        cusStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";

    if (customer != null && oldcustomer != null) {
        if (customer.title != oldcustomer.title) {
            updates = updates + " Title has updated.! \n";
        }
        if (customer.firstname != oldcustomer.firstname) {
            updates = updates + "First name has updates from " + oldcustomer.firstname + " \n";
        }
        if (customer.contact_no != oldcustomer.contact_no) {
            updates = updates + "Phone Number has updates from " + oldcustomer.contact_no + " \n";
        }
        if (customer.email != oldcustomer.email) {
            updates = updates + "Last name has updates from " + oldcustomer.email + " \n";
        }
        if (customer.address != oldcustomer.address) {
            updates = updates + "Address has updates from " + oldcustomer.address + " \n";
        }
        if (customer.customerstatus_id.status != oldcustomer.customerstatus_id.status) {
            updates = updates + "Status has updates from " + oldcustomer.customerstatus_id.status + " \n";
        }
    }
    return updates;
}

//define function for update button
const buttonCustomerUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();
        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = ['/customer/update', "PUT", customer];
        swalUpdate(updates, title, text, updateResponse, modalCustomer);

        /* if (updates == "") {
            Swal.fire({
                title: "Nothing Updated.!",
                icon: "info",
                showConfirmButton: false,
                timer: 1500
            });
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
                    let updateResponse = getHTTPServiceRequest('/customer/update', "PUT", customer);
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
                            title: "Failed to Update.! Has following errors :",
                            text: updateResponse,
                            icon: "info"
                        });
                    }
                }
            });
        } */
    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

//define function for submit button
const buttonCustomerRegister = () => {
    //check if there are any errors
    let errors = checkFormError();

    title = "Are you sure to add Customer ";
    obName = customer.title + " " + customer.firstname + " " + customer.lastname;
    text = "Phone Number : " + customer.contact_no
        + ", Email : " + customer.email
        + ", Status : " + customer.customerstatus_id.status;
    let submitResponse = ['/customer/insert', "POST", customer];
    swalSubmit(errors, title, obName, text, submitResponse, modalCustomer);

    /* //check errors
    if (errors == "") {
        Swal.fire({
            title: "Are you sure to Submit Customer " + ob.title + " " + ob.firstname + " " + ob.lastname + " .?",
            text: "Phone Number : " + customer.contact_no
                + "\n Email : " + customer.email
                + "\n Status : " + customer.customerstatus_id.status,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post
                let submitResponse = getHTTPServiceRequest('/customer/insert', "POST", customer);
                if (submitResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully.!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refreshForm();
                    refreshCustomerTable(); 
                    window.location.reload();
                    $('#modalCustomer').modal('hide');
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
                    //window.alert("Save not Completed..! \n Has following errors : \n" + submitResponse);
                }
            }
        });
    } else {
        Swal.fire({
            title: "Failed to Submit.! Has following errors :",
            text: errors,
            icon: "error"
        });
    } */
}

//function define for delete Customer record
const customerDelete = (ob, rowIndex) => {
    customer = ob;

    title = "Are you sure to Delete Customer : ";
    obName = ob.title + " " + ob.firstname + " " + ob.lastname;
    text = "Email : " + ob.email;
    let deleteResponse = ['/customer/delete', "DELETE", customer];
    message = "Customer has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalCustomer, message);

    /* Swal.fire({
        title: "Are you sure to Delete Customer : " + ob.title + " " + ob.firstname + " " + ob.lastname + " .?",
        text: "\n Email : " + ob.email,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            //call Delete service
            let deleteResponse = getHTTPServiceRequest('/customer/delete', "DELETE", customer);
            if (deleteResponse == "OK") {
                Swal.fire({
                    title: "Deleted Successfully.!",
                    text: "Customer has Deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                //refresh table & Form
                window.location.reload();
                $('#modalCustomer').modal('hide');
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

    /* let userConfirm = window.confirm("Are you sure you want to delete selected Customer.??\n"
        + "\n Customer Reg No. : " + ob.reg_no
        + "\n Customer Title : " + ob.title
        + "\n Customer Name : " + ob.firstname + " " + ob.lastname
        + "\n Emplyee Email : " + ob.email);
    if (userConfirm) {
        //call delete servise for delete customer
        let deleteResponse = "OK";
        if (deleteResponse == "OK") {

            window.alert("Deleted Successfully.!!");
            //refresh table & Form
            refreshCustomerTable();
            refreshForm();
            $('#modalCustomer').modal('hide');
        } else {
            //window.alert("Failed to Delete.!\n" + deleteResponse);
            swal("Failed to Delete.!", {
                icon: "error", text: deleteResponse
            });
        }
    } */

}

//define function for modal close and refresh form
const buttonModalClose = () => {
    Swal.fire({
        title: "Are you Sure to Close Customer Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
            $('#modalCustomer').modal('hide');
            refreshCustomerTable();
        }
    });
}

//define function for clear/reset button
const buttonCustomerClear = () => {
    /*  let userConfirm = window.confirm("Do you want to Refresh Form..?");
     if (userConfirm) {
         refreshForm();
     } */
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

//function define for print Customer record
const customerPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodyCustomer, rowIndex, "White");
    const currentDateTime = new Date().toLocaleString();

    let newWindow = window.open();
    const printView = `
        <html>
        <head>
            <title>Customer Report Management | BIT 2025</title>
            <link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">
            <style>
                body {
                    padding: 30px;
                    font-family: Arial, sans-serif;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header img {
                    max-width: 100px;
                    display: block;
                    margin: 0 auto 10px auto;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 5px;
                }
                .date-time {
                    font-size: 12px;
                    color: #555;
                }
                table {
                    margin: auto;
                    width: 60%;
                }
                th {
                    text-align: left;
                    width: 40%;
                    background-color: #f8f9fa;
                    padding: 8px;
                }
                td {
                    background-color: #fff;
                    padding: 8px;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="images/bando1.png" alt="Logo">
                <h1>Customer Details</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
            </div>
            <table class="table table-bordered table-striped">
                <tr>
                    <th>Customer Refistration Number</th>
                    <td>${ob.reg_no}</td>
                </tr>
                <tr>
                    <th>Customer</th>
                    <td>${ob.title + " " + ob.firstname + " " + ob.lastname}</td>
                </tr>
                <tr>
                    <th>Mobile Number</th>
                    <td>${ob.contact_no}</td>
                </tr>
                <tr>
                    <th>Emai</th>
                    <td>${ob.email}</td>
                </tr>
                <tr>
                    <th>Address</th>
                    <td>${ob.address}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>${ob.customerstatus_id.status}</td>
                </tr>
            </table>
            <div class="footer">
                &copy; 2025 BIT Project. All rights reserved.
            </div>
        </body>
        </html>
    `;

    newWindow.document.open();
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
}