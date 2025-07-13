//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshOrderTable();

    $('#SelectCustomer').select2({
        theme: "bootstrap-5",
        width: 'resolve', //style="width:342px"
        dropdownParent: $('#modalOrders')
    });
});

//define function for refresh form
const refreshForm = () => {
    formOrder.reset();
    // btnsubmit.disabled = false;
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";
    SelectCustomer.disabled = "";
    txtTotalAmount.value = "";
    txtTotalAmount.disabled = "disabled";
    txtServiceChg.value = "";
    txtServiceChg.disabled = "disabled";
    txtNetAmount.value = "";
    txtNetAmount.disabled = "disabled";

    //define new object
    order = new Object();
    order.orderHasSubmenuList = new Array();
    order.orderHasMenuitemList = new Array();

    const customers = getServiceRequest("/customer/alldata");
    fillDropdown(SelectCustomer, "Select Customer.!", customers, "contact_no");

    const orderTypes = getServiceRequest("/order/Type/alldata");
    fillDropdown(selectOrderType, "Select Type.!", orderTypes, "type");

    const orderStatuses = getServiceRequest("/orderStatus/alldata");
    fillDropdown(orderStatus, "Select Status.!", orderStatuses, "status");

    const orderTables = getServiceRequest("/tables/alldata");
    fillDropdownTwo(tableNO, "Select Table.!", orderTables, "number", "seatcount");

    const orderVehicles = getServiceRequest("/vehicle/alldata");
    fillDropdown(deliveryVehicle, "Select Vehicle.!", orderVehicles, "name");

    setDefault([SelectCustomer, txtCustName, txtNumber, selectOrderType, txtTotalAmount, txtServiceChg, txtDeliveryChg, txtNetAmount, orderStatus, tableNO, deliveryVehicle]);

    // status eka form eka open weddima active wdyt select wenna
    orderStatus.value = JSON.stringify(orderStatuses[0]);//select value eka string wenna one nisa object eka string baweta convert krenw
    // orderStatuses list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    order.orderstatus_id = orderStatuses[0];
    orderStatus.style.border = "2px solid green";


    // dynamic validator ekak noda select tags validate kregnna
    let selectTypeElement = document.querySelector("#selectOrderType");
    selectTypeElement.addEventListener("change", () => {
        //stringify value ekak thyena nisa eka JSON parse krela Type object ekak gnnewa
        let type = JSON.parse(selectTypeElement.value);
        order.ordertype_id = JSON.stringify(type);
        selectTypeElement.style.border = "2px solid green"
    });

    refreshInnerFormandTableSubmenu();
    refreshInnerFormandTableMenu();
}

// define function for calculate total
const calculateTotal = () => {
    let totalamount = 0.00;
    // Calculate total from submenu items
    for (const ositem of order.orderHasSubmenuList || []) {
        totalamount = parseFloat(totalamount) + parseFloat(ositem.lineprice || 0);
    }

    // Calculate total from menu items
    for (const omitem of order.orderHasMenuitemList || []) {
        totalamount = parseFloat(totalamount) + parseFloat(omitem.lineprice || 0);
    }

    // Set total amount
    txtTotalAmount.value = parseFloat(totalamount).toFixed(2);
    order.totalamount = txtTotalAmount.value;
    txtTotalAmount.style.border = "2px solid green";

    // Reset charges first
    txtServiceChg.value = "";
    txtDeliveryChg.value = "";
    order.servicecharge = 0;
    order.deliverycharge = 0;

    // check if selected order type is dine in
    let selectOrderTypeElement = document.getElementById('selectOrderType');
    const orderType = selectOrderTypeElement.options[selectOrderTypeElement.selectedIndex].text.trim().toLowerCase();

    // check type 
    if (orderType === "dine-in") {
        console.log("Processing Dine-In order");

        /* ### Generate Service Charge ### */
        txtServiceChg.value = parseFloat(totalamount * 0.10).toFixed(2); // 10% service charge;

        order.servicecharge = txtServiceChg.value;
        txtServiceChg.style.border = "2px solid green";

    } else if (orderType === "delivery") {
        console.log("Processing Delivery order");

        /* ### Generate Delivery Charge ### */
        txtDeliveryChg.value = parseFloat(250).toFixed(2);// 250 delivery charge

        order.deliverycharge = txtDeliveryChg.value;
        txtDeliveryChg.style.border = "2px solid green";

    } else { // order type == Take Away
        console.log("Processing Take Away order");

        // Reset border styles for unused fields
        txtServiceChg.style.border = "";
        txtDeliveryChg.style.border = "";
    }

    /* ### Calculate Net Amount ### */
    if (txtTotalAmount.value != 0.00) {
        // convert values to number format from string
        let totalamount = parseFloat(txtTotalAmount.value);
        let servicecharge = parseFloat(txtServiceChg.value || 0);
        let deliverycharge = parseFloat(txtDeliveryChg.value || 0);
        let netamount = totalamount + deliverycharge + servicecharge;

        console.log("Net amount calculation:");
        console.log("- Total amount:", totalamount);
        console.log("- Service charge:", servicecharge);
        console.log("- Delivery charge:", deliverycharge);
        console.log("- Net amount:", netamount);


        txtNetAmount.value = parseFloat(netamount).toFixed(2);
        order.netamount = txtNetAmount.value;
        txtNetAmount.style.border = "2px solid green";
    }
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

//onkeyup ekedi wada krenewa (adala html input field eka athule function eka call kranne one)
const generateLinepriceSmenu = (ob) => {
    if (txtQuantity.value > 0) {
        //input fields wela values convert krenewa string walin float bawat
        let unitprice = parseFloat(txtPrice.value);
        let quantity = parseFloat(txtQuantity.value);
        //multiply quantity and unit price
        let lineprice = quantity * unitprice;

        // Assign to the object
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

// define function for filter submenu by category
const filterSubmenusbyCategory = () => {
    if (selectCategory.value != "") {
        let submenus = getServiceRequest("/submenu/bycategory?category_id=" + JSON.parse(selectCategory.value).id);
        fillDropdown(SelectSubmenu, "Select Submenu", submenus, "name");
        SelectSubmenu.disabled = false;
    } else {
        fillDropdown(SelectSubmenu, "Select Category First.!", [], "");
        SelectSubmenu.disabled = true;
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

    selectCategory.value = "";
    txtPrice.value = "";
    txtPrice.disabled = true;
    txtQuantity.value = "";
    txtLinePrice.value = "";
    txtLinePrice.disabled = true;

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

    selectCategory.value = JSON.stringify(submenu_id.category_id);
    SelectSubmenu.disabled = true;
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
            Swal.fire({
                title: "Saved Successfully..!",
                icon: "success",
                showConfirmButton: false,
                timer: 1800
            });
            refreshInnerFormandTableSubmenu();
        }
    });

    // main eke thyena list ekta inner object eka push krenewa
    order.orderHasSubmenuList.push(orderHasSubmenu);
    refreshInnerFormandTableSubmenu();
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

    // main eke thyena list ekta inner object eka push krenewa
    order.orderHasSubmenuList[innerFormindex] = orderHasSubmenu;
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
const generateLineprice = () => {
    if (txtQuantityMenu.value > 0) {
        //input fields wela values convert krenewa string walin float bawat
        let unitprice = parseFloat(txtPriceMenu.value);
        let quantity = parseFloat(txtQuantityMenu.value);

        //multiply quantity and unit price
        let lineprice = (quantity * unitprice);

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
    // SeasonalDiscount.value = ob.menuitems_id.seasonaldiscount_id ? JSON.stringify(ob.menuitems_id.seasonaldiscount_id) : ""; //empty if null
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

//create refresh table function
const refreshOrderTable = () => {
    // Attach event to all category buttons
    let listElement = document.querySelectorAll('.status-btn');
    listElement.forEach(button => {
        button.addEventListener('click', () => {
            const statusId = button.getAttribute('data-id');
            let orderbyStatuses = getServiceRequest("/order/bystatus?orderstatus_id=" + statusId);
            fillTableFour(tBodyOrders, orderbyStatuses, columns, orderFormRefill, true)
        });
    });

    let orders = getServiceRequest("/order/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "ordercode", dataType: "string" },
        { property: getCustomerName, dataType: "function" },
        { property: getOrderType, dataType: "function" },
        { property: "totalamount", dataType: "decimal" },
        { property: "discount", dataType: "decimal" },
        { property: "servicecharge", dataType: "decimal" },
        { property: "deliverycharge", dataType: "decimal" },
        { property: "netamount", dataType: "decimal" },
        { property: getOrderStatus, dataType: "function" },
        { property: getOrderTable, dataType: "function" },
        { property: getOrderVehicle, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodyOrders, orders, columns, orderFormRefill, true);
    $('#tableOrders').DataTable();
}

//define function for get  table number
const getOrderTable = (dataOb) => {
    return dataOb.tables_id?.number ?? "-";
}

//define function for get  vehicle name
const getOrderVehicle = (dataOb) => {
    return dataOb.vehicle_id?.name ?? "-";
}

//define function for get  order status
const getOrderType = (dataOb) => {
    if (dataOb.ordertype_id.type == "Dine-In") {
        return "<p class='btn btn-sm btn-outline-secondary text-center'>" + dataOb.ordertype_id.type + "</p>";
    }
    if (dataOb.ordertype_id.type == "Take-Away") {
        return "<p class='btn btn-sm btn-outline-secondary text-center'>" + dataOb.ordertype_id.type + "</p>";
    }
    if (dataOb.ordertype_id.type == "Delivery") {
        return "<p class='btn btn-sm btn-outline-secondary text-center'>" + dataOb.ordertype_id.type + "</p>";
    }
    return dataOb.ordertype_id.type;
}

//define function for get  order status
const getOrderStatus = (dataOb) => {
    if (dataOb.orderstatus_id.status == "New") {
        return "<p class='btn btn-outline-info text-center'>" + dataOb.orderstatus_id.status + "</p>";
    }
    if (dataOb.orderstatus_id.status == "In-Progress") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.orderstatus_id.status + "</p>";
    }
    if (dataOb.orderstatus_id.status == "Completed") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.orderstatus_id.status + "</p>";
    }
    if (dataOb.orderstatus_id.status == "Canceled") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.orderstatus_id.status + "</p>";
    }
    if (dataOb.orderstatus_id.status == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.orderstatus_id.status + "</p>";
    }
    return dataOb.orderstatus_id.status;
}

//define function for get  name
const getCustomerName = (dataOb) => {
    if (dataOb.customer_id != null) {
        return dataOb.customer_id.firstname;
    } else {
        return dataOb.customername ? dataOb.customername : "";
    }
}

//define function for get Ingredients list
const getOrderedItems = (dataOb) => {
    return "Items";
}


/* ############### ORDER TYPE WORKS ################ */
// user form eken order type(Dine-in / Delivery / Take-Away) eka select kalama method ekata adala input field display krenewa

// Get order type element by ID
const selectOrderTypeElement = document.querySelector("#selectOrderType");

// Add event listener, user kenek change ekak kalama
selectOrderTypeElement.addEventListener("change", () => {

    // selected option eke text eka aregena whitespace ain krela lowercase welata convert krenewa
    const orderType = selectOrderTypeElement.options[selectOrderTypeElement.selectedIndex].text.trim().toLowerCase();

    // Highlight the dropdown border in green to show user interaction
    selectOrderTypeElement.style.border = "2px solid green";

    // method eka bank transfer wena input field wela ids aran group kregnnewa
    const dineInFieldGroup = ["colServiceChrg", "colDineinTable"];
    // method eka cheque wena input field wela ids aran group kregnnewa
    const deliveryFieldGroup = ["colDeliveryChrg", "colDeliveryVehicle"];

    let netamount = "";
    // Selected method ekata anuwa input field eka display kregnnawa
    if (orderType === "dine-in") {
        // Show transfer fields and hide cheque fields
        dineInFieldGroup.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
        deliveryFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));

    } else if (orderType === "delivery") {
        // Show cheque fields and hide transfer fields
        deliveryFieldGroup.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
        dineInFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    } else {
        // For any other order type, hide both cheque and transfer related fields
        deliveryFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));
        dineInFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    }
});


//define Form edit function
const orderFormRefill = (ob, rowIndex) => {
    $('#modalOrders').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    order = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldorder = JSON.parse(JSON.stringify(ob));

    SelectCustomer.disabled = "disabled";
    SelectCustomer.value = ob.customer_id != null ? JSON.stringify(ob.customer_id) : "";
    txtCustName.value = ob.customername != null ? ob.customername : "";
    txtNumber.value = ob.customercontact != null ? ob.customercontact : "";
    selectOrderType.value = JSON.stringify(ob.ordertype_id);
    txtTotalAmount.value = ob.totalamount;
    txtServiceChg.value = ob.servicecharge != null ? ob.servicecharge : "";
    txtDeliveryChg.value = ob.deliverycharge != null ? ob.deliverycharge : "";
    txtNetAmount.value = ob.netamount;
    orderStatus.value = JSON.stringify(ob.orderstatus_id);
    tableNO.value = ob.tables_id != null ? JSON.stringify(ob.tables_id) : "";

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
    if (order.ordertype_id.type === "Dine-In") {
        if (order.servicecharge == null || order.servicecharge.trim() === "") {
            txtServiceChg.style.border = "2px solid red";
        }
        if (order.tables_id == null) {
            tableNO.style.border = "2px solid red";
            errors = errors + "Please Select Table No.! \n";
        }
    } else if (order.ordertype_id.type === "Delivery") {
        if (order.deliverycharge == null || order.deliverycharge.trim() === "") {
            txtDeliveryChg.style.border = "2px solid red";
        }
        if (order.vehicle_id == null) {
            deliveryVehicle.style.border = "2px solid red";
            errors = errors + "Please Select Vehicle.! \n";
        }
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
        if (order.customer_id != null) {
            if (order.customer_id.contact_no != oldorder.customer_id.contact_no) {
                updates = updates + " Mobile No. has updated from " + oldorder.customer_id._contact_no + " \n";
            }
        }
        if (order.customername != null) {
            if (order.customername != oldorder.customername) {
                updates = updates + "Customer Name has updated from " + oldorder.customername + " \n";
            }
            if (order.customercontact != oldorder.customercontact) {
                updates = updates + "Customer Contact has updated from " + oldorder.customercontact + " \n";
            }
        }

        if (order.totalamount != oldorder.totalamount) {
            updates = updates + "Total Amount has updated from " + oldorder.totalamount + " \n";
        }
        if (order.servicecharge != oldorder.servicecharge) {
            updates = updates + "Service Charge has updated from " + oldorder.servicecharge + " \n";
        }
        if (order.deliverycharge != oldorder.deliverycharge) {
            updates = updates + "Delivery Charge has updated from " + oldorder.deliverycharge + " \n";
        }
        if (order.netamount != oldorder.netamount) {
            updates = updates + "Net Amount has updated from " + oldorder.netamount + " \n";
        }
        if (order.tables_id.number != oldorder.tables_id.number) {
            updates = updates + "Table No. has updated from " + oldorder.tables_id.number + " \n";
        }
        if (order.vehicle_id.name != oldorder.vehicle_id.name) {
            updates = updates + "Vehicle has updated from " + oldorder.vehicle_id.name + " \n";
        }
        if (order.orderstatus_id.status != oldorder.orderstatus_id.status) {
            updates = updates + "Status has updated from " + oldorder.orderstatus_id.status + " \n";
        }

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
    title = "Are you sure to Submit following Customer Order";
    obName = "";
    text = "Type : " + order.ordertype_id.type
        + ", Net Amount : " + order.netamount;
    let submitResponse = getHTTPServiceRequest('/order/insert', "POST", order);
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
        let updateResponse = getHTTPServiceRequest('/order/update', "PUT", order);
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
    title = "Are you sure to Delete Selected Customer Order";
    obName = "";
    text = "Order : " + order.id
        + ", Net Amount : " + order.netamount;
    let deleteResponse = getHTTPServiceRequest('/order/delete', "DELETE", order);
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
        title: "Are you Sure to Close Customer Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
            $('#modalOrders').modal('hide');
            refreshOrderTable();
        }
    });
}

//function define for print Order record
/* const orderPrint = (ob, rowIndex) => {

    console.log("Print", ob, rowIndex);
    activeTableRow(tBodyOrders, rowIndex, "White");

    let newWindow = window.open();
    let printView = '<html>'
        + '<head>'
        + '<link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">'
        + '<title>BIT Project Order | 2025 </title></head>'
        + '<body><h1>Print Order Details</h1>'
        + '<table class="table-bordered table-stripped border-1 w-25">'
        + '<tr><th> Order :</th><td>' + ob.ordercode + '</td></tr>'
        + '<tr><th> Total Amount :</th><td>' + ob.totalamount + '</td></tr>'
        + '<tr><th> Discount :</th><td>' + ob.discount + '</td></tr>'
        + '<tr><th> Service Charge :</th><td>' + ob.servicecharge + '</td></tr>'
        + '<tr><th> Net Amount :</th><td>' + ob.netamount + '</td></tr>'
        + '<tr><th> Order type :</th><td>' + ob.ordertype_id.type + '</td></tr>'
        + 'tr'
        + `<div class="row mt-1">
            <div class="col justify-content-md-center">
                <div class="card">
                    <div class="card-body">
                        <table class="table tablet table-bordered"
                            id="tableOrderhasSubmenuandMemu">
                            <thead>
                                <tr id="tablehead">
                                    <th> # </th>
                                    <th> Items </th>
                                    <th> Unit Price </th>
                                    <th> Quantity </th>
                                    <th> Line Price </th>
                                </tr>
                            </thead>
                            <tbody class="tableBody"
                                id="tBodyOrderhasSubmenu">
                                <tr>
                                    <td> 1 </td>
                                    <td> Biriyani </td>
                                    <td> 1500.00 </td>
                                    <td> 2 </td>
                                    <td> 3000.00 </td>
                                    <td> -</td>
                                </tr>
                            </tbody>
                            <tfoot id="tfootOrderhasSubmenu">
                                <tr>
                                    <td colspan="4"
                                        class="text-start fw-bold">
                                        Total
                                        Amount</td>
                                    <td>7500.00</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>`
        + '</tr>'




        + '<tr><th> Status :</th><td>' + ob.orderstatus_id.status + '</td></tr>'
        + '<tr><th> Table No. :</th><td>' + ob.tables_id.number + '</td></tr>'
        + '</table>'
        + '</body></html>'
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
} */


//function define for print Order record
const orderPrint = (orderData, rowIndex) => {
    console.log("Printing order:", orderData, rowIndex);

    // table eke row eka click kalama color eka change wenw
    activeTableRow(tBodyOrders, rowIndex, "White");

    // Print eke content eka generate krena function eka cll krenewa
    const printContent = generateOrderPrintHTML(orderData);

    // Create and configure the print window
    const printWindow = window.open();

    // Write content and handle printing
    printWindow.document.writeln(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    };
};

// Print eke content eka generate krena function eka define krenewa
// @param {Object} order - order object eke thama all order details thyenne
const generateOrderPrintHTML = (order) => {
    const currentDateTime = new Date().toLocaleString();

    //  @returns {string} - print window eke display wenna one html eka return krnw
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">

        <!-- link css -->
        <link rel="stylesheet" href="css/print.css">

        <title> Order Management - BIT 2025</title>
    </head>
    <body>
        <div class="header">
                <img src="images/bando1.png" alt="Logo">
                <h1>Order Receipt</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
        </div>

        <div class="order-info">
            <table>
                <tr>
                    <th> Order Code</th>
                    <td>${order.ordercode}</td>
                    <th> Order Type</th>
                    <td>${order.ordertype_id.type}</td>
                </tr>
                <tr>
                    <th> Customer</th>
                    <td>${order.customer_id?.firstname ? order.customer_id.firstname : order.customername}</td>
                    <th> User</th>
                    <td>${order.addeduser.username}</td>
                </tr>
            </table>
        </div>

        <div class="items-section">
            <h3> Order Items</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item Name</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateItemRows(order)}
                </tbody>
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="4">Total</td>
                        <td>Rs. ${formatCurrency(order.totalamount)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="order-info">
            <table>
                <tr>
                    <th>Total Amount</th>
                    <td>Rs. ${formatCurrency(order.totalamount)}</td>
                    <th>Seasonal Discount</th>
                    <td>Rs. ${formatCurrency(order.discount ? order.discount : 0)}</td>
                </tr>
                <tr>
                    <th> Service Charge</th>
                    <td>Rs. ${formatCurrency(order.servicecharge ? order.servicecharge : 0)}</td>
                    <th> Delivery Charge</th>
                    <td>Rs. ${formatCurrency(order.deliverycharge ? order.deliverycharge : 0)}</td>
                </tr >
                <tr>
                    <th colspan="3"> Net Amount</th>
                    <td><strong>Rs. ${formatCurrency(order.netamount)}</strong></td >
                </tr >
            </table >
        </div >

    <div class="footer">
        &copy; 2025 BIT Project. All rights reserved.
        <p>Generated on ${currentDateTime}</p>
    </div>
    </body >
    </html >
    `;
};

//@param {Array} items - Array of order items
//@returns {string} - HTML string for table rows
const generateItemRows = (order) => {
    // Extract items from the correct association names
    const submenuItems = order.orderHasSubmenuList || [];
    const menuItems = order.orderHasMenuitemList || [];

    // Merge both arrays into a single items array
    const allItems = [...submenuItems, ...menuItems];

    console.log(" Found items:", allItems);

    return allItems.map((item, index) => {
        console.log(` Processing item ${index + 1}: `, item);

        // Handle different item types and database structures
        let itemName, unitPrice, quantity, lineTotal;

        // Check if it's a submenu item
        if (item.submenu_id) {
            itemName = item.submenu_id.name;
        }
        // Check if it's a menu item  
        else if (item.menuitems_id) {
            itemName = item.menuitems_id.name;
        }
        // Fallback to direct properties
        else {
            itemName = item.item_name;
        }

        // Extract pricing information
        unitPrice = item.unitprice || item.submenu_id?.price || item.menuitem_id?.price;

        quantity = item.quantity;

        lineTotal = item.lineprice;

        console.log(`Extracted data - Name: ${itemName}, Price: ${unitPrice}, Qty: ${quantity}, Total: ${lineTotal} `);

        return `
            < tr >
                <td>${index + 1}</td>
                <td>${itemName}</td>
                <td>Rs. ${formatCurrency(unitPrice)}</td>
                <td>${quantity}</td>
                <td>Rs. ${formatCurrency(lineTotal)}</td>
            </tr >
    `;
    }).join('');
};

//  @param {number} amount - The amount to format
//  @returns {string} - Formatted currency string
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount || 0);
};