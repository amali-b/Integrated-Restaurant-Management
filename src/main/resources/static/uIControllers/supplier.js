//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshSupplierTable();
});

//define function for refresh form
const refreshForm = () => {
    formSupplier.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    //define new object
    supplier = new Object();
    // selected data array eka
    supplier.supplyIngredients = new Array();

    ingredientCategories = getServiceRequest("/ingredientcategory/alldata");
    //define function for create supplier ingredient type
    let supplierType = document.querySelector("#supplierTypes");
    supplierType.innerHTML = "";

    ingredientCategories.forEach((ingredientCategory, index) => {
        /*  let div = document.createElement("div");
         div.className = "form-check form-check-inline";
         supplierType.appendChild(div); */

        let inputCheck = document.createElement("input");
        inputCheck.type = "radio";
        inputCheck.id = ingredientCategory.id;
        inputCheck.className = "btn-check";
        inputCheck.name = "supplier_type";
        inputCheck.setAttribute("autocomplete", "off");
        inputCheck.value = ingredientCategory.id;
        // div.appendChild(inputCheck);

        if (supplier.supplier_type == ingredientCategory.name) {
            inputCheck.checked = true;
        }

        supplierType.appendChild(inputCheck);

        let label = document.createElement("label");
        label.className = "btn btn-outline-success me-3";
        label.innerText = ingredientCategory.name;
        label.setAttribute("for", inputCheck.id);
        supplierType.appendChild(label);

        label.onclick = () => {
            IngredientsBycategory = getServiceRequest("/ingredient/bycategory?ingredientcategory_id=" + ingredientCategory.id);
            fillDropdown(SelectBycategory, "", IngredientsBycategory, "ingredient_name");

            // CATEGORY LIST EKAK HADELA EKATA CATEGORY ID TIKA DAGNNAWA ITEPASSE EKEN ENA INGREDIENTS TIKA WENAMA ARAGENA E SET EKA SELECT EKA 

            // foreach eka ahtule iddi element eka access kranna puluwn nisa this.checked wenuwata inputCheck.checked user krnna puluwn
            /*  if (label.checked) {
                 //Supplier Types list ekata foreach eken gnna ingredientCategory eka set krnw
                 console.log("CHECKED");
             } 
            // supplier.IngredientsBycategory.push(ingredients);
             else {
                //unchecked weddi ingredientCategory object eka available wena index eka hoyagnnw
                let extIndex = supplier.ingredientCategories.map(category => category.id).indexOf(ingredientCategory.id);
                console.log("UNCHECKED");
                // index eka exist nam eka list eken splice krela ain krenewa
                if (extIndex != -1) {
                    supplier.ingredientCategories.splice(extIndex, 1);
                }
            } */
        }
    });

    setDefault([supStatus, nameSupplier, txtNumber, txtEmail, txtAdres, txtBankname, txtBranch, accNo, accHolder, supplierTypes, SelectBycategory, SelectedIngredints, txtNote]);

    const supplierStatuses = getServiceRequest("/supplierstatus/alldata");
    fillDropdown(supStatus, "Select Status", supplierStatuses, "status");
    // status eka form eka open weddima active wdyt select wenna
    //select element eke value eka string value ekak wenna one nisa object eka string baweta convert krenw
    supStatus.value = JSON.stringify(supplierStatuses[0]);
    // supplierStatuses list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    supplier.supplierstatus_id = supplierStatuses[0];
    supStatus.style.border = "2px solid green";

    fillDropdown(SelectedIngredints, "", supplier.supplyIngredients, "ingredient_name");
}

//create refresh table function
const refreshSupplierTable = () => {
    // get list of suppliers using ajax get request
    const suppliers = getServiceRequest("/supplier/alldata");

    //create display property list
    const columns = [
        { property: "supplier_name", dataType: "string" },
        { property: "contact_no", dataType: "string" },
        { property: "email", dataType: "string" },
        { property: getSupplierType, dataType: "function" },
        { property: "bankname", dataType: "string" },
        { property: "accountnumber", dataType: "string" },
        { property: getSupplierStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodySupplier, suppliers, columns, supplierFormRefill, true);
    $('#tableSupplier').DataTable(); //add dataTable
}

const getSupplierStatus = (dataOb) => {
    if (dataOb.supplierstatus_id.status == "Active") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.supplierstatus_id.status + "</p>";
    }
    if (dataOb.supplierstatus_id.status == "In-Active") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.supplierstatus_id.status + "</p>";
    }
    if (dataOb.supplierstatus_id.status == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.supplierstatus_id.status + "</p>";
    }
    return dataOb.supplierstatus_id.status;
}

const getSupplierType = (dataOb) => {
    let ingredientCategories = getServiceRequest("/ingredientcategory/alldata");
    // return dataOb.supplier_type; (return kranne type eke int eka)
    // ingredientCategories array eka search krela condition ekata galepena first element eka return krenewa
    let category = ingredientCategories.find(cat => cat.id === dataOb.supplier_type); //category list eke foreach category ekaka cat.id  samanada supplier.supplier_type
    // matching category ekak hmbunoth category eke nama return krnw
    if (category) {
        return category.name;
    } else {
        return "Unknown";
    }
}

const selectOneIngredient = () => {
    if (SelectBycategory.value != "") {
        //selectedByCategory list eken selected value eka object ekk baweta convert krela selectedIngredient variable ekata danewa
        let selectedIngredient = JSON.parse(SelectBycategory.value);
        //selectedIngredient varible eka selected ingredients array ekata push krenewa
        supplier.supplyIngredients.push(selectedIngredient);
        //selected ingredients array list eka fill krenewa
        fillDropdown(SelectedIngredints, "", supplier.supplyIngredients, "ingredient_name");

        // IngredientsBycategory side eke eka ingredient eheka id eka selected ingredient eke id ekata samanada blnw 
        let extIndex = IngredientsBycategory.map(ingredient => ingredient.id).indexOf(selectedIngredient.id);
        console.log("yyyyy");
        // exist wenewanm eka thyena thanin (selected ingredient list eken) ain krenewa
        if (extIndex != -1) {
            IngredientsBycategory.splice(extIndex, 1);
        }
        fillDropdown(SelectBycategory, "", IngredientsBycategory, "ingredient_name");
    } else {
        Swal.fire({
            title: "Please Select Ingredient.!",
            icon: "error"
        });
    }
}

const selectAllIngredient = () => {
    // IngredientsBycategory eke ingredients one by one kyewela supplier.supplyIngredients array ekt push krenewa
    for (const ingredient of IngredientsBycategory) {
        supplier.supplyIngredients.push(ingredient);
    }
    // SelectedIngredints list eka refresh krenewa
    fillDropdown(SelectedIngredints, "", supplier.supplyIngredients, "ingredient_name");

    // SelectBycategory list eka empty krela refresh krenewa
    IngredientsBycategory = [];
    fillDropdown(SelectBycategory, "", IngredientsBycategory, "ingredient_name");
}

const removeAllIngredient = () => {
    // supplier.supplyIngredients array eke ingredients one by one kyewela IngredientsBycategory array ekt push krenewa
    for (const ingredient of supplier.supplyIngredients) {
        IngredientsBycategory.push(ingredient);
    }
    // SelectBycategory  list eka refresh krenewa
    fillDropdown(SelectBycategory, "", IngredientsBycategory, "ingredient_name");

    // supplier.supplyIngredients array eka empty krela refresh krenewa
    supplier.supplyIngredients = [];
    fillDropdown(SelectedIngredints, "", supplier.supplyIngredients, "ingredient_name");
}

const removeOneIngredient = () => {
    if (SelectedIngredints.value != "") {
        //SelectedIngredints list eken selected value eka object ekk baweta convert krela removedIngredient variable ekata danewa
        let removedIngredient = JSON.parse(SelectedIngredints.value);
        //removedIngredient varible eka IngredientsBycategory array ekata push krenewa
        IngredientsBycategory.push(removedIngredient);
        //select ingredients by category array list eka fill krenewa
        fillDropdown(SelectBycategory, "", IngredientsBycategory, "ingredient_name");

        console.log(supplier.supplyIngredients);

        // selectedByCategory side eke eka ingredient eheka id eka select IngredientsBycategory eke id ekata samanada blnw 
        let extIndex = supplier.supplyIngredients.map(ingredient => ingredient.id).indexOf(removedIngredient.id);
        console.log("yyyyy");
        // exist wenewanm eka thyena thanin (selected ingredient list eken) ain krenewa
        if (extIndex != -1) {
            supplier.supplyIngredients.splice(extIndex, 1);
        }
        console.log(supplier.supplyIngredients);

        fillDropdown(SelectedIngredints, "", supplier.supplyIngredients, "ingredient_name");
    } else {
        Swal.fire({
            title: "Please Select Ingredient for remove.!",
            icon: "error"
        });
    }

}

//define Form edit function
const supplierFormRefill = (ob, rowIndex) => {
    $('#modalSupplier').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";
    /* btnsubmit.disabled = true;
    btnupdate.disabled = false; */

    supplier = getServiceRequest("/supplier/getbyId?id=" + ob.id);
    oldsupplier = getServiceRequest("/supplier/getbyId?id=" + ob.id);

    nameSupplier.value = ob.supplier_name;
    txtNumber.value = ob.contact_no;
    txtEmail.value = ob.email;
    txtAdres.value = ob.address;
    txtBankname.value = ob.bankname;
    txtBranch.value = ob.branchname;
    accNo.value = ob.accountnumber;
    accHolder.value = ob.holdername;

    //define function for create supplier ingredient type
    let supplierType = document.querySelector("#supplierTypes");
    supplierType.innerHTML = "";

    ingredientCategories.forEach((ingredientCategory, index) => {
        /*  let div = document.createElement("div");
         div.className = "form-check form-check-inline";
         supplierType.appendChild(div); */

        let inputCheck = document.createElement("input");
        inputCheck.type = "radio";
        inputCheck.id = ingredientCategory.id;
        inputCheck.className = "btn-check";
        inputCheck.name = "supplier_type";
        inputCheck.setAttribute("autocomplete", "off");
        inputCheck.value = ingredientCategory.id;
        // div.appendChild(inputCheck);

        if (ob.supplier_type == ingredientCategory.id) {
            inputCheck.checked = true;
        }

        supplierType.appendChild(inputCheck);

        let label = document.createElement("label");
        label.className = "btn btn-outline-success me-3";
        label.innerText = ingredientCategory.name;
        label.setAttribute("for", inputCheck.id);
        supplierType.appendChild(label);

        label.onclick = () => {
            IngredientsBycategory = getServiceRequest("/ingredient/bycategory?ingredientcategory_id=" + ingredientCategory.id);
            fillDropdown(SelectBycategory, "", IngredientsBycategory, "ingredient_name");

        }

        /* if (ob.supplier_type == JSON.stringify(ingredientCategory.id)) {
                    ingredientCategory.id.label.checked = "checked";
                } else {
                    ingredientCategory.id.label.checked = "";
                } */
    });

    // supplier visin supply nokarana Ingredients tika aregnnawa
    allIngredients = getServiceRequest("/ingredient/listwithoutsupply?supplierid=" + supplier.id);
    fillDropdown(SelectBycategory, "", allIngredients, "ingredient_name");

    //supplier visin supply krena items tika
    fillDropdown(SelectedIngredints, "", supplier.supplyIngredients, "ingredient_name");

    supStatus.value = JSON.stringify(ob.supplierstatus_id);

    if (ob.note == undefined) {
        txtNote.value = "";
    } else {
        txtNote.value = ob.note;
    }

}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (supplier.supplier_name == null) {
        nameSupplier.style.border = "2px solid red";
        errors = errors + "Please Enter Supplier Name.! \n";
    }
    if (supplier.contact_no == null) {
        txtNumber.style.border = "2px solid red";
        errors = errors + "Please Enter Phone Number.! \n";
    }
    if (supplier.email == null) {
        txtEmail.style.border = "2px solid red";
        errors = errors + "Please Enter Email.! \n";
    }
    if (supplier.address == null) {
        txtAdres.style.border = "2px solid red";
        errors = errors + "Please Enter Address.! \n";
    }
    if (supplier.bankname == null) {
        txtBankname.style.border = "2px solid red";
        errors = errors + "Please Enter Bank Namee.! \n";
    }
    if (supplier.branchname == null) {
        txtBranch.style.border = "2px solid red";
        errors = errors + "Please Enter Branch Name.! \n";
    }
    if (supplier.accountnumber == null) {
        accNo.style.border = "2px solid red";
        errors = errors + "Please Enter Account Number.! \n";
    }
    if (supplier.holdername == null) {
        accHolder.style.border = "2px solid red";
        errors = errors + "Please Enter Holder Name.! \n";
    }
    if (supplier.supplier_type == null) {
        errors = errors + "Please Select Supplier Type.! \n";
    }
    if (supplier.supplyIngredients.length == 0) {
        SelectedIngredints.style.border = "2px solid red";
        errors = errors + "Please Select Ingredient.! \n";
    }
    /*  if (supplier.supplierstatus_id == null) {
         supStatus.style.border = "2px solid red";
         errors = errors + "Please Select Status.! \n";
     } */

    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";

    if (supplier != null && oldsupplier != null) {
        if (supplier.supplier_name != oldsupplier.supplier_name) {
            uupdates = updates + "Supplier name has updated from " + oldsupplier.supplier_name + " \n";
        }
        if (supplier.contact_no != oldsupplier.contact_no) {
            updates = updates + "Phone Number has updated from " + oldsupplier.contact_no + " \n";
        }
        if (supplier.email != oldsupplier.email) {
            updates = updates + "Email has updated from " + oldsupplier.email + " \n";
        }
        if (supplier.address != oldsupplier.address) {
            updates = updates + "Address has updated from " + oldsupplier.address + " \n";
        }
        if (supplier.bankname != oldsupplier.bankname) {
            updates = updates + "Bank name has updated from " + oldsupplier.bankname + " \n";
        }
        if (supplier.branchname != oldsupplier.branchname) {
            updates = updates + "Branch name has updated from " + oldsupplier.branchname + " \n";
        }
        if (supplier.accountnumber != oldsupplier.accountnumber) {
            updates = updates + "Account no. has updated from " + oldsupplier.accountnumber + " \n";
        }
        if (supplier.holdername != oldsupplier.holdername) {
            updates = updates + "Holder name has updated from " + oldsupplier.holdername + " \n";
        }
        if (supplier.supplier_type != oldsupplier.supplier_type) {
            updates = updates + "Supplier type has updated from " + oldsupplier.supplier_type + " \n";
        }
        if (supplier.supplyIngredients.length != oldsupplier.supplyIngredients.length) {
            updates = updates + "Supplier Ingredients has updated \n";
        }
        if (supplier.supplierstatus_id.status != oldsupplier.supplierstatus_id.status) {
            updates = updates + "Status has updated from " + oldsupplier.supplierstatus_id.status + " \n";
        }
    }
    return updates;
}

//define function for update button
const buttonSupplierUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();
        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = getHTTPServiceRequest('/supplier/update', "PUT", supplier);
        swalUpdate(updates, title, text, updateResponse, modalSupplier);
    } else {
        Swal.fire({
            title: "Failed to Update.! Form has following errors :",
            text: errors,
            icon: "error"
        });
        /* if (updates == "") {
            Swal.fire({
                title: "Nothing Changed..!",
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
                    let updateResponse = getHTTPServiceRequest('/supplier/update', "PUT", supplier);
                    if (updateResponse == "OK") {
                        Swal.fire({
                            title: "Successfully Updated..!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
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
    }
}

//define function for submit button
const buttonSupplierSubmit = () => {
    // Assign selected supplier type before submit
    let selectedSupplierType = document.querySelector('input[name="supplier_type"]:checked');
    if (selectedSupplierType) {
        supplier.supplier_type = parseInt(selectedSupplierType.value);
    } else {
        supplier.supplier_type = null;
    }

    //check if there are any errors
    let errors = checkFormError();

    title = "Are you sure to Submit Supplier ";
    obName = supplier.supplier_name;
    text = "Phone Number : " + supplier.contact_no
        + ", Email : " + supplier.email;
    let submitResponse = getHTTPServiceRequest('/supplier/insert', "POST", supplier);
    swalSubmit(errors, title, obName, text, submitResponse, modalSupplier);

    //check errors
    /* if (errors == "") {
        Swal.fire({
            title: "Are you sure to Submit Supplier " + supplier.supplier_name + " .?",
            text: "Phone Number : " + supplier.contact_no
                + ", Email : " + supplier.email,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post servise for insert data
                let submitResponse = getHTTPServiceRequest('/supplier/insert', "POST", supplier);
                if (submitResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully..!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refreshForm();
                    refreshSupplierTable();
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
                }
            }
        });
    }else {
    Swal.fire({
        title: "Failed to Submit.! Has following errors :",
        text: errors,
        icon: "error"});
    } */
    /* let userConfirm = window.confirm("Are you sure you want to Submit following Supplier Detail.?\n "
        + "\n Supplier Name : " + supplier.supplier_name
        + "\n Supplier Phone Number : " + supplier.contact_no
        + "\n Supplier Email : " + supplier.email
        + "\n Supplier Address : " + supplier.address
        + "\n Supplier Bank : " + supplier.bankname
        + "\n Supplier Holder : " + supplier.holdername
        + "\n Supplier Type : " + supplier.supplier_type
        + "\n Supplier Status : " + supplier.supplierstatus_id.status
    ); */
}

//function define for delete Supplier record
const supplierDelete = (ob, rowIndex) => {
    supplier = ob;
    title = "Are you sure to Delete Supplier ";
    obName = ob.supplier_name;
    text = "Email : " + ob.email
        + ", Bank Name : " + ob.bankname
        + ", Holder Name: " + ob.holdername
        + ", Supplier Type : " + ob.supplier_type
        + ", Supplier Status : " + ob.supplierstatus_id.status;
    let deleteResponse = getHTTPServiceRequest('/supplier/delete', "DELETE", supplier);
    message = "Supplier has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalSupplier, message);

    /* Swal.fire({
        title: "Are you sure to Delete Supplier " + ob.supplier_name + " ?",
        text: "Email : " + ob.email
            + " Bank Name : " + ob.bankname
            + " Holder Name: " + ob.holdername
            + " Supplier Type : " + ob.supplier_type
            + " Supplier Status : " + ob.supplierstatus_id.status,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            //call delete servise for delete supplier
            let deleteResponse = getHTTPServiceRequest('/supplier/delete', "DELETE", supplier);
            if (deleteResponse == "OK") {
                Swal.fire({
                    title: "Deleted Successfully.!",
                    text: "Supplier has Deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                //refresh table & Form
                refreshForm();
                refreshSupplierTable();
                $('#modalSupplier').modal('hide');
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
}

//define function for 
const buttonSupplierClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning"
    });
    refreshForm();
    supplier.supplyIngredients = [];
    fillDropdown(SelectedIngredints, "", supplier.supplyIngredients, "ingredient_name");

    IngredientsBycategory = [];
    fillDropdown(SelectBycategory, "", IngredientsBycategory, "ingredient_name");
}

//function define for print Supplier record
const supplierPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodySupplier, rowIndex, "White");

    let newWindow = window.open();
    let printView = '<html>'
        + '<head>'
        + '<link rel="stylesheet" href="../Resourse/bootstrap-5.2.3/css/bootstrap.min.css">'
        + '<title>BIT Project | 2025</title></head>'
        + '<body><h1>Print Supplier Details</h1>'
        + '<table class="table-bordered table-stripped border-1 w-25">'
        + '<tr><th> Supplier Name :</th><td>' + ob.supplier_name + '</td></tr>'
        + '<tr><th> Mobile Number :</th><td>' + ob.contact_no + '</td></tr>'
        + '<tr><th> Email :</th><td>' + ob.email + '</td></tr>'
        + '<tr><th> Address :</th><td>' + ob.address + '</td></tr>'
        + '<tr><th> Bank Name :</th><td>' + ob.bankname + '</td></tr>'
        + '<tr><th> Branch Name :</th><td>' + ob.branchname + '</td></tr>'
        + '<tr><th> Account Number :</th><td>' + ob.accountnumber + '</td></tr>'
        + '<tr><th> Account Holder Name :</th><td>' + ob.holdername + '</td></tr>'
        + '<tr><th> Supplier type :</th><td>' + ob.supplier_type + '</td></tr>'
        + '<tr><th> Status :</th><td>' + ob.supplierstatus_id.status + '</td></tr>'
        + '</table>'
        + '</body></html>'
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
}
