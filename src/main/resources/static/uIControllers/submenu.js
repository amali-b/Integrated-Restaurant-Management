//browser load event handler
window.addEventListener("load", () => {

    //call refresh form
    refreshSubmenuForm();

    //call refresh Table
    refreshSubmenutable();
});

//define refresh form function
const refreshSubmenuForm = () => {
    formSubmenu.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    submenu = new Object();//define submenu Object
    submenu.submenuHasIngredientList = new Array(); //define ingredient array

    const Submenucategories = getServiceRequest("/submenucategory/alldata");
    fillDropdown(selectCategory, "Select Menu Item Category.!", Submenucategories, "name");

    const Submenustatuses = getServiceRequest("/submenustatus/alldata");
    fillDropdown(productStatus, "Select Status.!", Submenustatuses, "name");

    //adala category id ekata anuwa subcategory eka dropdown eke list kregnnewa --> getServiceRequest("/submenu/bycategory?category_id=1")
    //category_id = 1 wenuweta parameters kipayk pass krannath puluwn
    /*  let submenucategorybyCategories = getServiceRequest("/submenu/bycategory?category_id=" + category_id);
     fillDropdown(selectSubCategory, "Select Menu Item Category.!", submenucategorybyCategories, "name"); */

    setDefault([imgProduct, txtProductname, txtPrice, selectCategory, productStatus]);

    // status eka form eka open weddima active wdyt select wenna
    //select value eka string wenna one nisa object eka string baweta convert krenw
    productStatus.value = JSON.stringify(Submenustatuses[0]);
    // Submenustatuses list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    submenu.submenustatus_id = Submenustatuses[0];
    productStatus.style.border = "2px solid green";

    refreshInnerFormandTable();
}

/* ############################## INNER FORM FUNCTIONS ################################# */

// define function for check ingredients existance
const checkIngredientExt = () => {
    //dropdown eken select krena value eka aregnnewa object ekak lesa convert krela 
    let Selectedingredient = JSON.parse(SelectIngredint.value);
    // submenuHasIngredientList list eke purchace order item ekin eka search krela eke id eka selected ingredient eke id ekata samana wenewanm index eka return krenw
    let extIndex = submenu.submenuHasIngredientList.map(item => item.ingredient_id.id).indexOf(Selectedingredient.id);
    // index eka -1 ta wada wadinm,
    if (extIndex > -1) {
        // ema selected ingredient eka already list eke thyena item ekak
        window.alert("selected ingredient already existed.!");
        refreshInnerFormandTable();
    }
}

//define function for refresh inner form
const refreshInnerFormandTable = () => {
    //define new object
    submenuHasIngredient = new Object();

    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnInnerUpdate.classList.add("d-none");
    btnInnerSubmit.classList.remove("d-none");

    let ingredients = getServiceRequest("/ingredient/alldata");
    fillDropdownTwo(SelectIngredint, "Select Ingredients", ingredients, "ingredient_name", "unittype_id.name");

    setDefault([SelectIngredint, txtQuantity]);

    //define function for refresh inner table
    let columns = [
        { property: getIngredientName, dataType: "function" },
        { property: "quantity", dataType: "string" }
    ];

    //call fill data into table
    fillInnerTable(tBodySubemenuhasIngredient, submenu.submenuHasIngredientList, columns, submenuIngredientFormRefill, submenuIngredientDelete, true);
}

const getIngredientName = (ob) => {
    return ob.ingredient_id.ingredient_name;
}

const submenuIngredientFormRefill = (ob, index) => {
    innerFormindex = index;
    btnInnerUpdate.classList.remove("d-none");
    btnInnerSubmit.classList.add("d-none");

    submenuHasIngredient = JSON.parse(JSON.stringify(ob)); // new changes welata aluth object ekk hadenwa 
    oldsubmenuHasIngredient = JSON.parse(JSON.stringify(ob));

    SelectIngredint.value = JSON.stringify(ob.ingredient_id);
    txtQuantity.value = ob.quantity;
}

const submenuIngredientDelete = (ob, index) => {
    submenuHasIngredient = ob;
    Swal.fire({
        title: "Are you sure to Delete Seleted Submenu Ingredient Details.?",
        text: "Ingredient : " + ob.ingredient_id.ingredient_name
            + ",  Qauntity : " + ob.quantity,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = submenu.submenuHasIngredientList.map(submenuIngredient => submenuIngredient.ingredient_id.id).indexOf(ob.ingredient_id.id);
            if (extIndex != -1) {
                submenu.submenuHasIngredientList.splice(extIndex, 1);
            }
            Swal.fire({
                title: "Deleted Successfully.!",
                text: "Submenu Ingredient has Deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            //refresh table & Form
            refreshInnerFormandTable();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                icon: "error"
            });
        }
    });
}

const buttonSubmenuIngredientSubmit = () => {
    console.log(submenuHasIngredient);

    Swal.fire({
        title: "Are you sure to Submit Following Details.?",
        text: "Ingredient : " + submenuHasIngredient.ingredient_id.ingredient_name
            + ", Quantity : " + submenuHasIngredient.quantity,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Submit!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Saved Successfully..!",
                icon: "success",
                showConfirmButton: false,
                timer: 1800
            });
            refreshInnerFormandTable();
        }
    });

    // main eke thyena list ekta inner object eka push krenewa
    submenu.submenuHasIngredientList.push(submenuHasIngredient);
    refreshInnerFormandTable();
}

const checkInnerFormUpdate = () => {
    let innerupdates = "";
    if (submenuHasIngredient != null && oldsubmenuHasIngredient != null) {
        if (submenuHasIngredient.ingredient_id != oldsubmenuHasIngredient.ingredient_id) {
            innerupdates = innerupdates + "Ingredient has Updated from " + oldsubmenuHasIngredient.ingredient_id + "--> " + submenuHasIngredient.ingredient_id + " \n";
        }
        if (submenuHasIngredient.quantity != oldsubmenuHasIngredient.quantity) {
            innerupdates = innerupdates + "Quantity has updated from " + oldsubmenuHasIngredient.quantity + "--> " + submenuHasIngredient.quantity + " \n";
        }
    }
    return innerupdates;
}

const buttonSubmenuIngredientUpdate = () => {
    console.log(submenuHasIngredient);
    //check updates
    let updates = checkInnerFormUpdate();
    if (updates == "") {
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
                Swal.fire({
                    title: "Successfully Updated..!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1800
                });
                refreshInnerFormandTable();
            }
        });
    }
    // main eke thyena list ekta inner object eka push krenewa
    submenu.submenuHasIngredientList[innerFormindex] = submenuHasIngredient;
    refreshInnerFormandTable();
}

/* ############################## MAIN FORM FUNCTIONS ################################# */

//define refresh table function
const refreshSubmenutable = () => {
    // Attach event to all category buttons
    let listElement = document.querySelectorAll('.category-btn');
    listElement.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-id');
            let submenucategorybyCategories = getServiceRequest("/submenu/bycategory?category_id=" + categoryId);
            fillTableFour(tBodySubmenu, submenucategorybyCategories, columns, submenuFormRefill, true)
        });
    });

    /* submenucategorybyCategories.forEach(submenuCategory => {
        let button = document.getElementsByClassName(".nav-link");
        button.id = submenuCategory.id;
        listElement.appendChild(button);
 
        button.onclick = () => {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            let submenucategorybyCategories = getServiceRequest("/submenu/bycategory?category_id=" + categoryid);
            fillTableFour(tBodySubmenu, submenucategorybyCategories, columns, submenuFormRefill, true);
        }
    }); */


    // Initial load with all submenus
    let submenus = getServiceRequest("/submenu/alldata");

    let columns = [
        { property: "submenuimage", dataType: "string" },
        { property: "name", dataType: "string" },
        { property: "submenu_code", dataType: "string" },
        { property: getSubmenuCategory, dataType: "function" },
        { property: "price", dataType: "decimal" },
        { property: getSubmenuStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodySubmenu, submenus, columns, submenuFormRefill, true);
    $('#tableSubmenu').DataTable();
}

const getSubmenuCategory = (dataOb) => {
    return dataOb.category_id.name;
}

const getSubmenuStatus = (dataOb) => {
    if (dataOb.submenustatus_id.name == "Available") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.submenustatus_id.name + "</p>";
    }
    if (dataOb.submenustatus_id.name == "In-stock") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.submenustatus_id.name + "</p>";
    }
    if (dataOb.submenustatus_id.name == "Not-Available") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.submenustatus_id.name + "</p>";
    }
    if (dataOb.submenustatus_id.name == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.submenustatus_id.name + "</p>";
    }
    return dataOb.submenustatus_id.name;
}

//define Form edit function
const submenuFormRefill = (ob, rowIndex) => {
    $('#modalSubmenu').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    submenu = JSON.parse(JSON.stringify(ob));
    oldsubmenu = JSON.parse(JSON.stringify(ob));

    // imgProduct.value = ob.submenuimage;
    selectCategory.value = JSON.stringify(ob.category_id);
    txtProductname.value = ob.name;
    txtPrice.value = ob.price;
    productStatus.value = JSON.stringify(ob.submenustatus_id);

    refreshInnerFormandTable();
}

//define function to check errors
const checkFormError = () => {
    //errors = empty
    let errors = "";
    if (submenu.category_id == null) {
        selectCategory.style.border = "2px solid red";
        errors = errors + "Please Select Product Category First.! \n";
        //errors = "" + "Please Select Product Category First.! \n";
    }
    if (submenu.name == null) {
        txtsubmenuname.style.border = "2px solid red";
        errors = errors + "Please Enter Product Name.! \n";
        //if Product category has an error,
        //errors = "Please Select Product Category First.! \n" + "Please Select Product Product Name.! \n";
    }
    if (submenu.price == null) {
        txtPrice.style.border = "2px solid red";
        errors = errors + "Please Enter Price.! \n";
    }
    if (submenu.submenuHasIngredientList.length == 0) {
        errors = errors + "Please Select Ingredients.! \n";
    }
    if (submenu.submenustatus_id == null) {
        productStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    return errors;
}

//define function for check for updates
const checkFormUpdate = () => {
    let updates = "";
    if (submenu != null && oldsubmenu != null) {
        if (submenu.submenuimage != oldsubmenu.submenuimage) {
            updates = updates + "Product Photo has Updated from " + oldsubmenu.submenuimage + "--> " + submenu.submenuimage + " \n";
        }
        if (submenu.category_id.name != oldsubmenu.category_id.name) {
            updates = updates + "Category has Updated from " + oldsubmenu.category_id.name + "--> " + submenu.category_id.name + " \n";
        }
        if (submenu.name != oldsubmenu.name) {
            updates = updates + "Product Name has Updated from " + oldsubmenu.name + "--> " + submenu.name + " \n";
        }
        if (submenu.price != oldsubmenu.price) {
            updates = updates + "Price has Updated from " + oldsubmenu.price + "--> " + submenu.price + " \n";
        }
        if (submenu.submenustatus_id.name != oldsubmenu.submenustatus_id.name) {
            updates = updates + "Status has Updated from " + oldsubmenu.submenustatus_id.name + "--> " + submenu.submenustatus_id.name + " \n";
        }
        if (submenu.submenuHasIngredientList.length != oldsubmenu.submenuHasIngredientList.length) {
            updates = updates + "Submenu Ingredients has updated \n";
        }
    }
    return updates;
}

//define function for update button
const buttonProductUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();

    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();
        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = getHTTPServiceRequest('/submenu/update', "PUT", submenu);
        swalUpdate(updates, title, text, updateResponse, modalSubmenu);
    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

//define function for submit button
const buttonProductSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit Product ";
    obName = submenu.name + " .?";
    text = "Category : " + submenu.category_id.name
        + ", Email : " + submenu.price
        + ", Status : " + submenu.submenustatus_id.name;
    let submitResponse = getHTTPServiceRequest('/submenu/insert', "POST", submenu);
    swalSubmit(errors, title, obName, text, submitResponse, modalSubmenu);
}

//function define for delete Ingredient record
const productDelete = (ob, rowIndex) => {
    submenu = ob;
    title = "Are you sure to Delete Product ";
    obName = ob.name + " .?";
    text = "Category : " + ob.category_id.name
        + ", Price : " + ob.price;
    let deleteResponse = getHTTPServiceRequest('/submenu/delete', "DELETE", submenu);
    message = "Product has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalSubmenu, message);
}

//define function for clear/reset button
const buttonProductClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshSubmenuForm();
        }
    });
}

//define function for clear Inner form
const buttonInnerFormClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshInnerFormandTable();
        }
    });
}

//define function for modal close and refresh form
const buttonModalClose = () => {
    Swal.fire({
        title: "Are you Sure to Close Submenu Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshSubmenuForm();
            $('#modalSubmenu').modal('hide');
        }
    });
}

//function define for print Supplier Order record
const productPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodySubmenu, rowIndex, "White");

    const newWindow = window.open("", "_blank");

    const printView = `
        <html>
        <head>
            <title>Submenu Management | 2025</title>
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
                <h1>Product Details</h1>
            </div>
            <div class="container">
            <div class="row detail-row justify-content-md-center">
                    <div class="col">${ob.submenuimage}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Product Name:</div>
                    <div class="col">${ob.name}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Category:</div>
                    <div class="col">${ob.category_id.name}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Price:</div>
                    <div class="col">LKR ${parseFloat(ob.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Status:</div>
                    <div class="col">${ob.submenustatus_id.name}</div>
                </div>
            </div>

            <div class="footer">
                &copy; 2025 BIT Project. All rights reserved.
            </div>
        </body>
        </html>
    `;

    newWindow.document.open();
    newWindow.document.write(printView);
    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
};

