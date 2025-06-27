//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshMenuTable();
});

//define function for refresh form
const refreshForm = () => {
    formMenu.reset();
    // btnsubmit.disabled = false;
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";
    //define new object
    menuitem = new Object();
    menuitem.menuHasSubmenusList = new Array();

    const seasonaldiscounts = getServiceRequest("/seasonaldiscount/alldata");
    fillDropdown(selectDiscount, "Select Discount.!", seasonaldiscounts, "discountedoption");

    const menuStatuses = getServiceRequest("/menuStatus/alldata");
    fillDropdown(menuStatus, "Select Status.!", menuStatuses, "status");

    setDefault([txtMenuname, txtPrice, selectDiscount, menuStatus]);

    // status eka form eka open weddima active wdyt select wenna
    menuStatus.value = JSON.stringify(menuStatuses[0]);//select value eka string wenna one nisa object eka string baweta convert krenw
    // menuStatuses list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    menuitem.menustatus_id = menuStatuses[0];
    menuStatus.style.border = "2px solid green";

    refreshInnerFormandTable();
}

/* ############################## INNER FORM FUNCTIONS ################################# */

// define function for check Submenus existance
const checkSubmenuExt = () => {
    //dropdown eken select krena value eka aregnnewa object ekak lesa convert krela 
    let SelectSubmenu = JSON.parse(SelectSubmenus.value);
    // menuHasSubmenusList list eke menu item ekin eka search krela eke id eka selected submenu eke id ekata samana wenewanm index eka return krenw
    let extIndex = menuitem.menuHasSubmenusList.map(submitem => submitem.submenu_id.id).indexOf(SelectSubmenu.id);
    // index eka -1 ta wada wadinm,
    if (extIndex > -1) {
        // ema selected Submenu eka already list eke thyena item ekak
        window.alert("selected Submenu already existed.!");
        refreshInnerFormandTable();
    }
}

//define function for refresh inner form
const refreshInnerFormandTable = () => {
    //define new object
    menuHasSubmenu = new Object();

    let submenus = getServiceRequest("/submenu/alldata");
    fillDropdown(SelectSubmenus, "Select Submenu.!", submenus, "name");

    txtQuantity.value = "";

    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnInnerUpdate.classList.add("d-none");
    btnInnerSubmit.classList.remove("d-none");

    setDefault([SelectSubmenus, txtQuantity]);

    //define function for refresh inner table
    let columns = [
        { property: getSubmenuName, dataType: "function" },
        { property: "quantity", dataType: "string" },
    ];

    //call fill data into table
    fillInnerTable(tBodyMenuHasSubmenu, menuitem.menuHasSubmenusList, columns, menuSubmenuFormRefill, menuSubmenuDelete, true);
}

const getSubmenuName = (ob) => {
    return ob.submenu_id.name;
}

const menuSubmenuFormRefill = (ob, index) => {
    innerFormindex = index;
    btnInnerUpdate.classList.remove("d-none");
    btnInnerSubmit.classList.add("d-none");

    menuHasSubmenu = JSON.parse(JSON.stringify(ob));
    oldmenuHasSubmenu = JSON.parse(JSON.stringify(ob));

    /*         ingredients = getServiceRequest("/ingredient/list");
    // fillDropdownTwo function eka common eke declare kranna one meka gnnanm
        fillDropdownTwo(SelectIngredints, "Select Ingredients", ingredients, "ingredient_name", menuHasSubmenu.submenu_id.ingredient_name); */

    SelectSubmenus.value = JSON.stringify(ob.submenu_id);
    txtQuantity.value = ob.quantity;
}

const menuSubmenuDelete = (ob, index) => {
    menuHasSubmenu = ob;
    Swal.fire({
        title: "Are you sure to Delete Seleted Menu submenu Details.?",
        text: "Submenu : " + ob.submenu_id.name
            + ",  Qauntity : " + ob.quantity,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = menuitem.menuHasSubmenusList.map(menuSubmenu => menuSubmenu.submenu_id.id).indexOf(ob.submenu_id.id);
            if (extIndex != -1) {
                menuitem.menuHasSubmenusList.splice(extIndex, 1);
            }
            Swal.fire({
                title: "Deleted Successfully.!",
                text: "Menu submenu Item has Deleted.",
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

const buttonmenuSubmenuSubmit = () => {
    console.log(menuHasSubmenu);

    Swal.fire({
        title: "Are you sure to Submit Following Details.?",
        text: "Submenu : " + menuHasSubmenu.submenu_id.name
            + ", Quantity : " + menuHasSubmenu.quantity,
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
    menuitem.menuHasSubmenusList.push(menuHasSubmenu);
    refreshInnerFormandTable();
}

const buttonmenuSubmenuUpdate = () => {
    console.log(menuHasSubmenu);
    if (menuHasSubmenu.quantity != oldmenuHasSubmenu.quantity || menuHasSubmenu.submenu_id.name != oldmenuHasSubmenu.submenu_id.name) {
        Swal.fire({
            title: "Are you sure you want to update following changes.?",
            text: "Submenu has updated from " + oldmenuHasSubmenu.submenu_id.name
                + "Quantity has updated from " + oldmenuHasSubmenu.quantity,
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
    } else {
        Swal.fire({
            title: "Nothing Changed..!",
            icon: "info",
            showConfirmButton: false,
            timer: 1500
        });
    }

    // main eke thyena list ekta inner object eka push krenewa
    menuitem.menuHasSubmenusList[innerFormindex] = menuHasSubmenu;
    refreshInnerFormandTable();
}

/* ############################## MAIN FORM FUNCTIONS ################################# */

//create refresh table function
const refreshMenuTable = () => {

    const menuItems = getServiceRequest("/menuitems/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    const columns = [
        { property: "code", dataType: "string" },
        { property: "name", dataType: "string" },
        { property: getSubmenus, dataType: "function" },
        { property: "price", dataType: "decimal" },
        { property: getDiscount, dataType: "function" },
        { property: getMenuStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodyMenu, menuItems, columns, menuFormRefill, true);
    $('#tableMenu').DataTable();
}

// define function for get Discount option
const getDiscount = (dataOb) => {
    if (dataOb.seasonaldiscount_id != null) {
        return dataOb.seasonaldiscount_id.discountedoption;
    } else {
        return "-";
    }
}

//define function for get Menu status
const getMenuStatus = (dataOb) => {
    if (dataOb.menustatus_id.status == "Available") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.menustatus_id.status + "</p>";
    }
    if (dataOb.menustatus_id.status == "Not-Available") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.menustatus_id.status + "</p>";
    }
    if (dataOb.menustatus_id.status == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.menustatus_id.status + "</p>";
    }
    return dataOb.menustatus_id.status;
}

//define function for get Submenu list
const getSubmenus = (ob) => {
    /* let submenus = "";
    ob.submenus.forEach((submenu, index) => {
        //index ekath ekka length eka check krenewa
        if (ob.submenus.length - 1 == index) {
            submenus = submenus + submenu.name;
        } else {
            //index eka length ekt samana naththan coma eka danna 
            submenus = submenus + submenu.name + ", ";
        }
    }); */
    return "submenus";
}

//define Form edit function
const menuFormRefill = (ob, rowIndex) => {
    $('#modalMenu').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    menuitem = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldmenuitem = JSON.parse(JSON.stringify(ob));

    txtMenuname.value = ob.name;
    selectDiscount.value = JSON.stringify(ob.seasonaldiscount_id);
    txtPrice.value = ob.price;
    menuStatus.value = JSON.stringify(ob.menustatus_id);

    refreshInnerFormandTable();
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (menuitem.name == null) {
        txtMenuname.style.border = "2px solid red";
        errors = errors + "Please Select Menu Item Name.! \n";
    }
    /* if (menuitem.seasonaldiscount_id == null) {
        selectDiscount.style.border = "2px solid red";
        errors = errors + "Please Select Discount.! \n";
    } */
    if (menuitem.price == null) {
        txtPrice.style.border = "2px solid red";
        errors = errors + "Please Enter Price.! \n";
    }
    if (menuitem.menuHasSubmenusList.length == 0) {
        errors = errors + "Please Select Submenus.! \n";
    }
    if (menuitem.menustatus_id == null) {
        menuStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";

    if (menuitem != null && oldmenuitem != null) {
        if (menuitem.name != oldmenuitem.name) {
            updates = updates + "Menu Name has updated from " + oldmenuitem.name + " \n";
        }
        if (menuitem.seasonaldiscount_id.discountedoption != oldmenuitem.seasonaldiscount_id.discountedoption) {
            updates = updates + "Discount Option has updated from " + oldmenuitem.seasonaldiscount_id.discountedoption + " \n";
        }
        if (menuitem.price != oldmenuitem.price) {
            updates = updates + "Price has updated from " + oldmenuitem.price + " \n";
        }
        if (menuitem.menustatus_id.status != oldmenuitem.menustatus_id.status) {
            updates = updates + "Status has updated from " + oldmenuitem.menustatus_id.status + " \n";
        }
    }
    return updates;
}

//define function for submit button
const buttonmenuItemSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following Menu Item.?";
    obName = menuitem.name;
    text = "Price : " + menuitem.price;
    let submitResponse = getHTTPServiceRequest('/menuitem/insert', "POST", menuitem);
    swalSubmit(errors, title, obName, text, submitResponse, modalMenu);
}

//define function for update button
const buttonmenuItemUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();

        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = getHTTPServiceRequest('/menuitem/update', "PUT", menuitem);
        swalUpdate(updates, title, text, updateResponse, modalMenu);
    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

//function define for delete Menu Item record
const menuItemDelete = (ob, rowIndex) => {
    menuitem = ob;
    title = "Are you sure to Delete Selected Menu Item";
    obName = menuitem.name;
    text = "Price : " + menuitem.price;
    let deleteResponse = getHTTPServiceRequest('/menuitem/delete', "DELETE", menuitem);
    message = "Menu Item has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalMenu, message);
}

//define function for clear Menu Item form
const buttonmenuItemClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning"
    });
    refreshForm();
}
//define function for clear Inner form
const buttonInnerFormClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning"
    });
    refreshForm();
}

//function define for print Menu Item record
const menuItemPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodyMenu, rowIndex, "White");

    let newWindow = window.open();
    let printView = '<html>'
        + '<head>'
        + '<link rel="stylesheet" href="../Resourse/bootstrap-5.2.3/css/bootstrap.min.css">'
        + '<title>BIT Project | 2025</title></head>'
        + '<body><h1>Print Menu Details</h1>'
        + '<table class="table-bordered table-stripped border-1 w-25">'
        + '<tr><th> Menu Name :</th><td>' + ob.name + '</td></tr>'
        + '<tr><th> Pricce :</th><td>' + ob.price + '</td></tr>'
        + '<tr><th> Submenus :</th><td>' + ob.submenu_id.name + '</td></tr>'
        + '<tr><th> Discount :</th><td>' + ob.seasonaldiscount_id.discountedoption + '</td></tr>'
        + '<tr><th> Status :</th><td>' + ob.menustatus_id.status + '</td></tr>'
        + '</table>'
        + '</body></html>'
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
}