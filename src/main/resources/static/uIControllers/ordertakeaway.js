//browser load event handler
window.addEventListener("load", () => {
    //call refresh form function
    refreshForm();

    $('#SelectCustomer').select2({
        theme: "bootstrap-5",
        width: 'resolve', //style="width:342px"
        dropdownParent: $('#modalOrders')
    });
});

//define function for refresh form
const refreshForm = () => {
    $('#modalOrders').modal('show');
    formOrder.reset();
    // btnsubmit.disabled = false;
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    SelectCustomer.disabled = "";
    txtTotalAmount.value = "";
    txtTotalAmount.disabled = "disabled";
    // txtNetAmount.value = "";
    // txtNetAmount.disabled = "disabled";
    selectOrderType.disabled = "disabled";

    //define new object
    order = new Object();
    order.orderHasSubmenuList = new Array();
    order.orderHasMenuitemList = new Array();

    const customers = getServiceRequest("/customer/alldata");
    fillDropdown(SelectCustomer, "Select Customer Contact No.!", customers, "contact_no");

    const orderTypes = getServiceRequest("/order/Type/alldata");
    fillDropdown(selectOrderType, "Select Type.!", orderTypes, "type");

    const orderStatuses = getServiceRequest("/orderStatus/alldata");
    fillDropdown(orderStatus, "Select Status.!", orderStatuses, "status");

    setDefault([SelectCustomer, txtCustName, txtNumber, selectOrderType, txtTotalAmount, orderStatus]);
    $(SelectCustomer).next('.select2').find('.select2-selection').css('border', 'solid 1px #ced4da');

    // type eka form eka open weddima active wdyt select wenna
    selectOrderType.value = JSON.stringify(orderTypes[1]);//select value eka string wenna one nisa object eka string baweta convert krenw
    // orderTypes list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    order.ordertype_id = orderTypes[1];
    selectOrderType.style.border = "2px solid green";

    // status eka form eka open weddima active wdyt select wenna
    orderStatus.value = JSON.stringify(orderStatuses[0]);//select value eka string wenna one nisa object eka string baweta convert krenw
    // orderStatuses list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    order.orderstatus_id = orderStatuses[0];
    orderStatus.style.border = "2px solid green";

    refreshInnerFormandTableSubmenu();
    refreshInnerFormandTableMenu();
}

const calculateTotal = () => {
    let totalamount = 0.00;

    for (const ositem of order.orderHasSubmenuList) {
        totalamount = parseFloat(totalamount) + parseFloat(ositem.lineprice);
    }

    for (const omitem of order.orderHasMenuitemList) {
        totalamount = parseFloat(totalamount) + parseFloat(omitem.lineprice);
    }

    //totalamount = submenuTotal + menuTotal;

    txtTotalAmount.value = parseFloat(totalamount).toFixed(2);
    order.totalamount = txtTotalAmount.value;
    order.netamount = txtTotalAmount.value;
    txtTotalAmount.style.border = "2px solid green";

    /*    if (txtTotalAmount.value != 0.00) {
           let totalamount = parseFloat(txtTotalAmount.value);
           let discount = parseFloat(0);
   
           // calculate net amount
           let netamount = totalamount - discount;
           // Update net amount input
           txtNetAmount.value = parseFloat(netamount).toFixed(2);
           // Store in order object
           order.netamount = txtNetAmount.value;
           txtNetAmount.style.border = "2px solid green";
       } */
}

/* ############################## SUBMENU INNER FORM FUNCTIONS ################################# */
// define function for check Submenu existance
const checkSubmenuExt = () => {
    //dropdown eken select krena value eka aregnnewa object ekak lesa convert krela 
    let SelectSmenu = JSON.parse(SelectSubmenu.value);
    // orderHasSubmenuList list eke order item ekin eka search krela eke id eka selected submenu eke id ekata samana wenewanm index eka return krenw
    let extIndex = order.orderHasSubmenuList.map(oitem => oitem.submenu_id.id).indexOf(SelectSmenu.id);

    // index eka -1 ta wada wadinm,
    if (extIndex > -1) {
        // ema selected Submenu eka already list eke thyena item ekak
        window.alert("selected Submenu already existed.!");
        refreshInnerFormandTableSubmenu();
    } else {
        //list eke naththan
        // price eka input box eke show krnw
        txtPrice.value = parseFloat(SelectSmenu.price).toFixed(2); //ingredient entity eken SelectSmenu eke price eka gnnewa
        orderHasSubmenu.price = parseFloat(txtPrice.value).toFixed(2);
        txtPrice.style.border = "2px solid green";
    }
}

// define function for filter submenu by category
const filterSubmenusbyCategory = () => {
    if (selectCategory.value == "") {
        fillDropdown(SelectSubmenu, "Select Category First.!", [], "");
        SelectSubmenu.disabled = true;
    } else {
        let submenus = getServiceRequest("/submenu/bycategory?category_id=" + JSON.parse(selectCategory.value).id);
        fillDropdown(SelectSubmenu, "Select Submenu", submenus, "name");
        SelectSubmenu.disabled = false;
    }
}

//onkeyup ekedi wada krenewa (adala html input field eka athule function eka call kranne one)
const generateLinepriceSmenu = (ob) => {
    if (txtQuantity.value > 0) {
        //input fields wela values convert krenewa string walin float bawat
        let unitprice = parseFloat(txtPrice.value);
        let quantity = parseFloat(txtQuantity.value);
        //multiply quantity and unit price
        let lineprice = quantity * unitprice;
        orderHasSubmenu.lineprice = lineprice;

        // total eke value eka txtLinePrice input field eke decimal point 2kakin show krenewa
        txtLinePrice.value = parseFloat(lineprice).toFixed(2);
        txtLinePrice.style.border = "2px solid green";

    } else {
        orderHasSubmenu.quantity = null;
        orderHasSubmenu.lineprice = null;

        txtQuantity.style.border = "2px solid red";
        txtLinePrice.style.border = "solid 1px #ced4da";
        txtLinePrice.value = "";
    }
}

//define function for refresh inner form
const refreshInnerFormandTableSubmenu = () => {
    //define new object
    orderHasSubmenu = new Object();

    let categories = getServiceRequest("/submenucategory/alldata");
    fillDropdown(selectCategory, "Select Category", categories, "name");

    let submenus = [];
    if (selectCategory.value == "") {
        fillDropdown(SelectSubmenu, "Select Category First.!", [], "");
        SelectSubmenu.disabled = true;
    } else {
        submenus = getServiceRequest("/submenu/bycategory?category_id=" + JSON.parse(selectCategory.value).id);
        fillDropdown(SelectSubmenu, "Select Submenu", submenus, "name");
        SelectSubmenu.disabled = false;
    }

    txtPrice.value = "";
    txtPrice.disabled = "disabled";
    txtQuantity.value = "";
    txtLinePrice.value = "";
    txtLinePrice.disabled = "disabled";

    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnSmenuUpdate.classList.add("d-none");
    btnSmenuSubmit.classList.remove("d-none");

    setDefault([selectCategory, SelectSubmenu, txtPrice, txtQuantity, txtLinePrice]);

    //define function for refresh inner table
    let columns = [
        { property: getSubmenuName, dataType: "function" },
        { property: "price", dataType: "decimal" },
        { property: "quantity", dataType: "string" },
        { property: "lineprice", dataType: "decimal" },
    ];

    //call fill data into table
    fillInnerTable(tBodyOrderhasSubmenu, order.orderHasSubmenuList, columns, orderSubmenuFormRefill, orderSubmenuDelete, true);

    let column = [{ property: "lineprice", dataType: "decimal" }];
    fillInnerTableFooter(tfootOrderhasSubmenu, order.orderHasSubmenuList, column, columns.length);

    calculateTotal();
}

const getSubmenuName = (ob) => {
    if (ob.submenu_id != null) {
        return ob.submenu_id.name;
    } else {
        return "-";
    }
}

const orderSubmenuFormRefill = (ob, index) => {
    innerFormindex = index;
    btnSmenuUpdate.classList.remove("d-none");
    btnSmenuSubmit.classList.add("d-none");

    orderHasSubmenu = JSON.parse(JSON.stringify(ob));
    oldorderHasSubmenu = JSON.parse(JSON.stringify(ob));

    /*         ingredients = getServiceRequest("/ingredient/list");
    // fillDropdownTwo function eka common eke declare kranna one meka gnnanm
        fillDropdownTwo(SelectIngredints, "Select Ingredients", ingredients, "ingredient_name", orderHasSubmenu.ingredient_id.ingredient_name); */

    SelectSubmenu.disabled = "disabled";
    SelectSubmenu.value = JSON.stringify(ob.submenu_id);
    txtPrice.value = ob.price;
    txtQuantity.value = ob.quantity;
    txtLinePrice.value = parseFloat(ob.lineprice).toFixed(2);
}

const orderSubmenuDelete = (ob, index) => {
    orderHasSubmenu = ob;
    Swal.fire({
        title: "Are you sure to Delete Seleted Submenu?",
        text: "Item : " + ob.submenu_id.name
            + ",  Qauntity : " + ob.quantity
            + ",  Line Price : " + ob.lineprice,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = order.orderHasSubmenuList.map(osubmenu => osubmenu.submenu_id.id).indexOf(ob.submenu_id.id);
            if (extIndex != -1) {
                order.orderHasSubmenuList.splice(extIndex, 1);
            }
            Swal.fire({
                title: "Deleted Successfully.!",
                text: "Submenu has Deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            //refresh table & Form
            refreshInnerFormandTableSubmenu();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                icon: "error"
            });
        }
    });
}

const buttonorderSubemnuSubmit = () => {
    console.log(orderHasSubmenu);
    Swal.fire({
        title: "Are you sure to Submit Following Details.?",
        text: "Submenu : " + orderHasSubmenu.submenu_id.name
            + ", Quantity : " + orderHasSubmenu.quantity,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Submit!"
    }).then((result) => {
        if (result.isConfirmed) {
            // main eke thyena list ekta inner object eka push krenewa
            order.orderHasSubmenuList.push(orderHasSubmenu);
            Swal.fire({
                title: "Saved Successfully..!",
                icon: "success",
                showConfirmButton: false,
                timer: 1800
            });
            refreshInnerFormandTableSubmenu();
        }
    });
}

const buttonorderSubemnuUpdate = () => {
    console.log(orderHasSubmenu);
    if (orderHasSubmenu.quantity != oldorderHasSubmenu.quantity) {
        Swal.fire({
            title: "Are you sure you want to update following changes.?",
            text: "Quantity has updated from " + oldorderHasSubmenu.quantity,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update!"
        }).then((result) => {
            if (result.isConfirmed) {
                // main eke thyena list ekta inner object eka push krenewa
                order.orderHasSubmenuList[innerFormindex] = orderHasSubmenu;
                Swal.fire({
                    title: "Successfully Updated..!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1800
                });
                refreshInnerFormandTableSubmenu();
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
    refreshInnerFormandTableSubmenu();
}

/* ############################## MENU INNER FORM FUNCTIONS ################################# */
// define function for check Menu existance
const checkMenuExt = () => {
    //dropdown eken select krena value eka aregnnewa object ekak lesa convert krela
    let SelectMenuItem = JSON.parse(SelectMenu.value);
    // orderHasMenuitemList list eke order item ekin eka search krela eke id eka selected menu eke id ekata samana wenewanm index eka return krenw
    let extIndex = order.orderHasMenuitemList.map(oitem => oitem.menuitems_id.id).indexOf(SelectMenuItem.id);

    // index eka -1 ta wada wadinm,
    if (extIndex > -1) {
        // ema selected Menu eka already list eke thyena item ekak
        window.alert("selected Menu already existed.!");
        refreshInnerFormandTableSubmenu();
    } else {
        //list eke naththan
        // price eka input box eke show krnw
        txtPriceMenu.value = parseFloat(SelectMenuItem.price).toFixed(2); //ingredient entity eken SelectMenuItem eke price eka gnnewa
        orderHasMenuitem.price = parseFloat(txtPriceMenu.value).toFixed(2);
        txtPriceMenu.style.border = "2px solid green";
    }
}

//onkeyup ekedi wada krenewa (adala html input field eka athule function eka call kranne one)
const generateLineprice = (ob) => {
    if (txtQuantityMenu.value > 0) {
        //input fields wela values convert krenewa string walin float bawat
        let unitprice = parseFloat(txtPriceMenu.value);
        let quantity = parseFloat(txtQuantityMenu.value);

        //multiply quantity and unit price
        let lineprice = quantity * unitprice;

        // Assign to the object
        orderHasMenuitem.lineprice = lineprice;

        // total eke value eka txtLinePrice input field eke decimal point 2kakin show krenewa
        txtLinePriceMenu.value = parseFloat(lineprice).toFixed(2);
        txtLinePriceMenu.style.border = "2px solid green";
    } else {
        orderHasMenuitem.quantity = null;
        orderHasMenuitem.lineprice = null;

        txtQuantityMenu.style.border = "2px solid red";
        txtLinePriceMenu.style.border = "solid 1px #ced4da";
        txtLinePriceMenu.value = "";
    }
}

//define function for refresh inner form
const refreshInnerFormandTableMenu = () => {
    //define new object
    orderHasMenuitem = new Object();

    let menus = getServiceRequest("/menuitems/alldata");
    fillDropdown(SelectMenu, "Select Menu", menus, "name");

    SelectMenu.disabled = "";
    txtPriceMenu.value = "";
    txtPriceMenu.disabled = "disabled";
    txtQuantityMenu.value = "";
    txtLinePriceMenu.value = "";
    txtLinePriceMenu.disabled = "disabled";

    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnInnerUpdate.classList.add("d-none");
    btnInnerSubmit.classList.remove("d-none");

    setDefault([SelectMenu, txtPriceMenu, txtQuantityMenu, txtLinePriceMenu]);

    //define function for refresh inner table
    let columns = [
        { property: getMenuName, dataType: "function" },
        { property: "price", dataType: "decimal" },
        { property: "quantity", dataType: "string" },
        { property: "lineprice", dataType: "decimal" },
    ];

    //call fill data into table
    fillInnerTable(tBodyOrderhasItem, order.orderHasMenuitemList, columns, orderItemFormRefill, orderItemDelete, true);

    let column = [{ property: "lineprice", dataType: "decimal" }];
    fillInnerTableFooter(tfootOrderhasItem, order.orderHasMenuitemList, column, columns.length);

    calculateTotal();
}

const getMenuName = (ob) => {
    if (ob.menuitems_id != null) {
        return ob.menuitems_id.name;
    } else {
        return "-";
    }
}

const orderItemFormRefill = (ob, index) => {
    innerFormindex = index;
    btnInnerUpdate.classList.remove("d-none");
    btnInnerSubmit.classList.add("d-none");

    orderHasMenuitem = JSON.parse(JSON.stringify(ob));
    oldorderHasMenuitem = JSON.parse(JSON.stringify(ob));

    SelectMenu.disabled = "disabled";
    SelectMenu.value = JSON.stringify(ob.menuitems_id);
    txtPriceMenu.value = ob.price;
    txtQuantityMenu.value = ob.quantity;
    txtLinePriceMenu.value = parseFloat(ob.lineprice).toFixed(2);
}

const orderItemDelete = (ob, index) => {
    orderHasMenuitem = ob;
    Swal.fire({
        title: "Are you sure to Delete Seleted Menu?",
        text: "Item : " + ob.menuitems_id.name
            + ",  Qauntity : " + ob.quantity
            + ",  Line Price : " + ob.lineprice,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = order.orderHasMenuitemList.map(omenu => omenu.menuitems_id.id).indexOf(ob.menuitems_id.id);
            if (extIndex != -1) {
                order.orderHasMenuitemList.splice(extIndex, 1);
            }
            Swal.fire({
                title: "Deleted Successfully.!",
                text: "Menu has Deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            //refresh table & Form
            refreshInnerFormandTableMenu();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                icon: "error"
            });
        }
    });
}

const buttonorderItemSubmit = () => {
    console.log(orderHasMenuitem);
    Swal.fire({
        title: "Are you sure to Submit Following Details.?",
        text: "Menuitem : " + orderHasMenuitem.menuitems_id.name
            + ", Quantity : " + orderHasMenuitem.quantity,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Submit!"
    }).then((result) => {
        if (result.isConfirmed) {
            // main eke thyena list ekta inner object eka push krenewa
            order.orderHasMenuitemList.push(orderHasMenuitem);
            Swal.fire({
                title: "Saved Successfully..!",
                icon: "success",
                showConfirmButton: false,
                timer: 1800
            });
            refreshInnerFormandTableMenu();
        }
    });
}

const buttonorderItemUpdate = () => {
    console.log(orderHasMenuitem);
    if (orderHasMenuitem.quantity != oldorderHasMenuitem.quantity) {
        Swal.fire({
            title: "Are you sure you want to update following changes.?",
            text: "Quantity has updated from " + oldorderHasMenuitem.quantity,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update!"
        }).then((result) => {
            if (result.isConfirmed) {
                // main eke thyena list ekta inner object eka push krenewa
                order.orderHasMenuitemList[innerFormindex] = orderHasMenuitem;
                Swal.fire({
                    title: "Successfully Updated..!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1800
                });
                refreshInnerFormandTableMenu();
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
}



/* ############################## MAIN FORM FUNCTIONS ################################# */


//define Form edit function
const orderFormRefill = (ob, rowIndex) => {
    $('#modalOrders').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    order = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldorder = JSON.parse(JSON.stringify(ob));

    SelectCustomer.disabled = "disabled";
    SelectCustomer.value = JSON.stringify(order.customer_id);
    if (ob.customername == null) {
        txtCustName.value = "";
    } else {
        txtCustName.value = ob.customername;
    }
    if (ob.customercontact == null) {
        txtNumber.value = "";
    } else {
        txtNumber.value = ob.customercontact;
    }
    selectOrderType.value = JSON.stringify(ob.ordertype_id);
    txtTotalAmount.value = ob.totalprice;
    // txtSecviceChg.value = ob.discount ? ob.discount : "";
    // txtNetAmount.value = ob.netamount;
    orderStatus.value = JSON.stringify(ob.orderstatus_id);

    refreshInnerFormandTableSubmenu();
}

//define function to check errors
const checkFormError = () => {
    let errors = "";

    if (order.ordertype_id == null) {
        selectOrderType.style.border = "2px solid red";
        errors = errors + "Please Select Order Type First.! \n";
    }
    if (order.totalamount == null) {
        txtTotalAmount.style.border = "2px solid red";
        errors = errors + "Please Fill Inner Form/s.! \n";
    }
    if (order.netamount == null) {
        txtNetAmount.style.border = "2px solid red";
        errors = errors + "Please Fill Inner Form/s.! \n";
    }
    if (order.orderHasSubmenuList.length == 0 && order.orderHasMenuitemList.length == 0) {
        errors = errors + "Please Select Submenu or Menu.! \n";
    }
    if (order.orderstatus_id == null) {
        orderStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";

    if (order != null && oldorder != null) {
        if (order.customer_id.contact_no != oldorder.customer_id.contact_no) {
            updates = updates + " Mobile No. has updated from " + oldorder.customer_id._contact_no + " \n";
        }
        if (order.customername != oldorder.customername) {
            updates = updates + "Customer Name has updated from " + oldorder.customername + " \n";
        }
        if (order.customercontact != oldorder.customercontact) {
            updates = updates + "Customer Contact has updated from " + oldorder.customercontact + " \n";
        }
        if (order.totalamount != oldorder.totalamount) {
            updates = updates + "Total Amount has updated from " + oldorder.totalamount + " \n";
        }
        if (order.orderstatus_id.status != oldorder.orderstatus_id.status) {
            updates = updates + "Status has updated from " + oldorder.orderstatus_id.status + " \n";
        }

        /* if (order.discount != oldorder.discount) {
            updates = updates + "Discount Charge has updated from " + oldorder.discount + " \n";
        }
        if (order.netamount != oldorder.netamount) {
            updates = updates + "Net Amount has updated from " + oldorder.netamount + " \n";
        } */


        /* ###### CHECK SUBMENU INNER FORM CHANGES ###### */

        // list wela length eka wenas welanm update ekk wela
        if (order.orderHasSubmenuList.length != oldorder.orderHasSubmenuList.length) {
            updates = updates + "Order Submenus has updated \n";
        } else {
            let equalCount = 0;
            // old list eke item ekin eka read krnewa
            for (const oldOhsubmenu of oldorder.orderHasSubmenuList) {
                for (const newOhsubmenu of order.orderHasSubmenuList) {
                    // old & new item wela id samanainm
                    if (oldOhsubmenu.submenu_id.id == newOhsubmenu.submenu_id.id) {
                        equalCount = +1;
                    }
                }
            }

            if (equalCount != order.orderHasSubmenuList) {
                updates = updates + "Order Submenus has updated \n";
            } else {
                // old list eke item ekin eka read krnewa
                for (const oldOhsubmenu of oldorder.orderHasSubmenuList) {
                    for (const newOhsubmenu of order.orderHasSubmenuList) {
                        // old & new item wela id samanai & quantity asemana wita
                        if (oldOhsubmenu.submenu_id.id == newOhsubmenu.submenu_id.id && oldOhsubmenu.quantity != newOhsubmenu.quantity) {
                            updates = updates + "Order Submenu Quantity has updated \n";
                            break;
                        }
                    }
                }
            }
        }

        /* ###### CHECK MENU INNER FORM CHANGES ###### */

        // list wela length eka wenas welanm update ekk wela
        if (order.orderHasMenuitemList.length != oldorder.orderHasMenuitemList.length) {
            updates = updates + "Order Menu Items has updated \n";
        } else {
            let equalCount = 0;
            // old list eke item ekin eka read krnewa
            for (const oldOmenu of oldorder.orderHasMenuitemList) {
                for (const newOmenu of order.orderHasMenuitemList) {
                    // old & new item wela id samanainm
                    if (oldOmenu.menuitems_id.id == newOmenu.menuitems_id.id) {
                        equalCount = +1;
                    }
                }
            }

            if (equalCount != order.orderHasMenuitemList) {
                updates = updates + "Order Menu Items has updated \n";
            } else {
                // old list eke item ekin eka read krnewa
                for (const oldOmenu of oldorder.orderHasMenuitemList) {
                    for (const newOmenu of order.orderHasMenuitemList) {
                        // old & new item wela id samanai & quantity asemana wita
                        if (oldOmenu.menuitems_id.id == newOmenu.menuitems_id.id && oldOmenu.quantity != newOmenu.quantity) {
                            updates = updates + "Order Menuitem Quantity has updated \n";
                            break;
                        }
                    }
                }
            }
        }
    }
    return updates;
}

//define function for submit button
const buttonOrderSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following Customer Order.?";
    obName = "";
    text = "Type : " + order.ordertype_id.type
        + ", Net Amount : " + order.netamount;
    let submitResponse = ['/order/insert', "POST", order];
    swalSubmit(errors, title, obName, text, submitResponse, modalOrders);
}

//define function for update button
const buttonOrderUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();

        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = ['/order/update', "PUT", order];
        swalUpdate(updates, title, text, updateResponse, modalOrders);
    } else {
        Swal.fire({
            title: "Failed to Update.! Form has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

//function define for delete Order record
const orderDelete = (ob, rowIndex) => {
    order = ob;
    title = "Are you sure to Delete Selected Customer Order.?";
    obName = "";
    text = "Order : " + order.id
        + ", Net Amount : " + order.netamount;
    let deleteResponse = ['/order/delete', "DELETE", order];
    message = "Customer Order has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalOrders, message);
}

//define function for clear Order form
const buttonOrderClear = () => {
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

//define function for clear Submenu Inner form
const buttonInnerSmenuFormClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshInnerFormandTableSubmenu();
        }
    });
}

//define function for clear Menu Inner form
const buttonInnerMenuFormClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshInnerFormandTableMenu();
        }
    });
}

//define function for modal close and refresh form
const buttonModalClose = () => {
    Swal.fire({
        title: "Are you Sure to Close Order Form.?",
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