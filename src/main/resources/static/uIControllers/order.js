//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshOrderTable();
});

//define function for refresh form
const refreshForm = () => {
    formOrder.reset();
    // btnsubmit.disabled = false;
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";
    SelectCustomer.disabled = "";

    //define new object
    order = new Object();
    order.orderHasSubmenuList = new Array();
    order.orderHasMenuList = new Array();

    const customers = getServiceRequest("/customer/alldata");
    fillDropdown(SelectCustomer, "Select Customer.!", customers, "contact_no");

    const orderTypes = getServiceRequest("/orderType/alldata");
    fillDropdown(selectOrderType, "Select Type.!", orderTypes, "type");

    const orderStatuses = getServiceRequest("/orderStatus/alldata");
    fillDropdown(orderStatus, "Select Status.!", orderStatuses, "status");

    const orderTables = getServiceRequest("/tables/alldata");
    fillDropdown(tableNO, "Select Table.!", orderTables, "number");

    const orderVehicles = getServiceRequest("/vehicle/alldata");
    fillDropdown(tableNO, "Select Vehicle.!", orderVehicles, "name");

    setDefault([SelectCustomer, txtCustName, txtNumber, selectOrderType, txtTotalAmount, txtServiceChg, txtDeliveryChg, txtNetAmount, orderStatus, tableNO, deliveryVehicle, txtNote]);

    // type eka form eka open weddima active wdyt select wenna
    selectOrderType.value = JSON.stringify(orderTypes[0]);//select value eka string wenna one nisa object eka string baweta convert krenw
    // orderTypes list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    console.log("Mokakada Me;", orderTypes[0]);

    order.ordertype_id = orderTypes[0];
    selectOrderType.style.border = "2px solid green";

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
        selectTypeElement.style.border = "2px solid green"
    });

    refreshInnerFormandTableSubmenu();
    refreshInnerFormandTableMenu();
}


const calculateTotal = () => {

    let totalamount = 0.00;
    // const submenuTotal = parseFloat(order.orderHasSubmenuList?.lineprice) || 0;
    // const menuTotal = parseFloat(order.orderHasMenuitemList?.lineprice) || 0;

    // let submenuTotal = (order.orderHasSubmenuList || []).map(ositem => parseFloat(ositem.lineprice) || 0).reduce((sum, price) => sum + price, 0);;
    // let menuTotal = (order.orderHasMenuitemList || []).map(omitem => parseFloat(omitem.lineprice) || 0).reduce((sum, price) => sum + price, 0);;


    for (const ositem of order.orderHasSubmenuList) {
        totalamount = parseFloat(totalamount) + parseFloat(ositem.lineprice);
    }

    for (const omitem of order.orderHasMenuitemList) {
        totalamount = parseFloat(totalamount) + parseFloat(omitem.lineprice);
    }

    //totalamount = submenuTotal + menuTotal;


    txtTotalAmount.value = totalamount.toFixed(2);
    order.totalamount = txtTotalAmount.value;
    txtTotalAmount.style.border = "2px solid green";

    /* ### Generate Service Charge ### */
    if (txtTotalAmount.value > 0) {
        let serviceChg = totalamount * 0.10;

        txtServiceChg.value = parseFloat(serviceChg.toFixed(2));
        order.servicecharge = txtServiceChg.value;
        txtServiceChg.style.border = "2px solid green";
    }

    /* ### Generate Net Amount ### */
    if (txtTotalAmount.value != 0.00) {
        let totalamount = parseFloat(txtTotalAmount.value);
        let servicecharge = parseFloat(txtServiceChg.value);
        let netamount = totalamount + servicecharge;

        txtNetAmount.value = parseFloat(netamount.toFixed(2));
        order.netamount = txtNetAmount.value;
        txtNetAmount.style.border = "2px solid green";
    }

    /* let submenuTotal = 0;
    for (const ositem of order.orderHasSubmenuList || []) {
        submenuTotal = parseFloat(submenuTotal) + parseFloat(ositem.lineprice);
    }
    let menuTotal = 0;
    for (const omitem of order.orderHasMenuitemList || []) {
        menuTotal = parseFloat(menuTotal) + parseFloat(omitem.lineprice);
    }

    totalamount = submenuTotal + menuTotal;

    if (totalamount > 0) {
        txtTotalAmount.value = totalamount.toFixed(2);
        order.totalamount = txtTotalAmount.value;
        txtTotalAmount.style.border = "2px solid green";
    } else {
        txtTotalAmount.value = "";
        txtTotalAmount.style.border = "1px solid #ced4da"; // reset style
        order.totalamount = 0;
    }
    generateServiceChg(); */
}
/* 
const generateServiceChg = () => {
    const totalamount = parseFloat(txtTotalAmount.value) || 0;
    if (totalamount > 0) {
        let serviceChg = totalamount * 0.10;

        txtServiceChg.value = parseFloat(serviceChg.toFixed(2));
        order.servicecharge = txtServiceChg.value;
        txtServiceChg.style.border = "2px solid green";
    } else {
        order.servicecharge = 0.00;
        txtServiceChg.value = "";
        txtServiceChg.style.border = "1px solid #ced4da";
    }
    generateNetamount();
}

const generateNetamount = () => {
    if (txtTotalAmount.value != 0.00) {
        let totalamount = parseFloat(txtTotalAmount.value);
        let servicecharge = parseFloat(txtServiceChg.value);
        let netamount = totalamount + servicecharge;

        txtNetAmount.value = parseFloat(netamount.toFixed(2));
        order.netamount = txtNetAmount.value;
        txtNetAmount.style.border = "2px solid green";
    } else {
        order.netamount = 0.00;
        txtNetAmount.value = "";
        txtNetAmount.style.border = "1px solid #ced4da";
    }
} */

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

//define function for refresh inner form
const refreshInnerFormandTableSubmenu = () => {
    //define new object
    orderHasSubmenu = new Object();

    let submenus = getServiceRequest("/submenu/alldata");
    fillDropdown(SelectSubmenu, "Select Submenu", submenus, "name");

    SelectSubmenu.disabled = "";
    txtPrice.value = "";
    txtPrice.disabled = "disabled";
    txtQuantity.value = "";
    txtLinePrice.value = "";
    txtLinePrice.disabled = "disabled";

    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnSmenuUpdate.classList.add("d-none");
    btnSmenuSubmit.classList.remove("d-none");

    setDefault([SelectSubmenu, txtPrice, txtQuantity, txtLinePrice]);

    //define function for refresh inner table
    let columns = [
        { property: getSubmenuName, dataType: "function" },
        { property: "price", dataType: "decimal" },
        { property: "quantity", dataType: "string" },
        { property: "lineprice", dataType: "decimal" },
    ];

    //call fill data into table
    fillInnerTable(tBodyOrderhasSubmenu, order.orderHasSubmenuList, columns, orderSubmenuFormRefill, orderSubmenuDelete, true);

    // orderHasSubmenuList ekata data ekathu unoth line price wela ekathuwa gnna puluwn
    let totalamount = 0.00;
    for (const orderSubemenu of order.orderHasSubmenuList) {
        totalamount = parseFloat(totalamount) + parseFloat(orderSubemenu.lineprice);
    }
    /* if (totalamount != 0.00) {
        txtTotalAmount.value = totalamount.toFixed(2);
        order.totalamount = txtTotalAmount.value;
        txtTotalAmount.style.border = "2px solid green";
    } */

    let column = [{ property: "lineprice", dataType: "decimal" }];
    fillInnerTableFooter(tfootOrderhasSubmenu, order.orderHasSubmenuList, column);
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

    // orderHasSubmenuList ekata data ekathu unoth line price wela ekathuwa gnna puluwn
    let totalamount = 0.00;
    for (const orderMenu of order.orderHasMenuitemList) {
        totalamount = parseFloat(totalamount) + parseFloat(orderMenu.lineprice);
    }
    /*  if (totalamount != 0.00) {
         txtTotalAmount.value = totalamount.toFixed(2);
         order.totalamount = txtTotalAmount.value;
         txtTotalAmount.style.border = "2px solid green";
     } */

    let column = [{ property: "lineprice", dataType: "decimal" }];
    fillInnerTableFooter(tfootOrderhasItem, order.orderHasMenuitemList, column);
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
            Swal.fire({
                title: "Saved Successfully..!",
                icon: "success",
                showConfirmButton: false,
                timer: 1800
            });
            refreshInnerFormandTableMenu();
        }
    });

    // main eke thyena list ekta inner object eka push krenewa
    order.orderHasMenuitemList.push(orderHasMenuitem);
    refreshInnerFormandTableMenu();
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

    // main eke thyena list ekta inner object eka push krenewa
    order.orderHasMenuitemList[innerFormindex] = orderHasMenuitem;
    refreshInnerFormandTableMenu();
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
        { property: getOrderedItems, dataType: "function" },
        { property: "totalamount", dataType: "decimal" },
        { property: "discount", dataType: "decimal" },
        { property: "servicecharge", dataType: "decimal" },
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
    return dataOb.tables_id.number;
}

//define function for get  vehicle name
const getOrderVehicle = (dataOb) => {
    return dataOb.vehicle_id.name;
}

//define function for get  order status
const getOrderType = (dataOb) => {
    if (dataOb.ordertype_id.type == "Dine-In") {
        return "<p class='btn btn-outline-info text-center'>" + dataOb.ordertype_id.type + "</p>";
    }
    if (dataOb.ordertype_id.type == "Take-Away") {
        return "<p class='btn btn-outline-info text-center'>" + dataOb.ordertype_id.type + "</p>";
    }
    if (dataOb.ordertype_id.type == "Delivery") {
        return "<p class='btn btn-outline-info text-center'>" + dataOb.ordertype_id.type + "</p>";
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
        return "-";
    }
}

//define function for get Ingredients list
const getOrderedItems = (dataOb) => {
    return "Items";
}

//define Form edit function
const orderFormRefill = (ob, rowIndex) => {
    $('#modalOrders').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    order = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldorder = JSON.parse(JSON.stringify(ob));

    SelectCustomer.disabled = "disabled";
    SelectCustomer.value = JSON.stringify(order.customer_id);
    selectOrderType.value = JSON.stringify(ob.ordertype_id);
    txtTotalAmount.value = ob.totalprice;
    txtNetAmount.value = ob.netamount;
    orderStatus.value = JSON.stringify(ob.orderstatus_id);

    if (ob.servicecharge == undefined) {
        txtSecviceChg.value = "";
    } else {
        txtSecviceChg.value = ob.servicecharge;
    }

    if (ob.note == undefined) {
        txtNote.value = "";
    } else {
        txtNote.value = ob.note;
    }

    refreshInnerFormandTable();
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
    if (order.servicecharge == null) {
        txtServiceChg.style.border = "2px solid red";
        errors = errors + "Please Select Required Date.! \n";
    }
    if (order.netamount == null) {
        txtNetAmount.style.border = "2px solid red";
        errors = errors + "Please Fill Inner Form/s.! \n";
    }
    if (order.tables_id == null) {
        tableNO.style.border = "2px solid red";
        errors = errors + "Please Select Table.! \n";
    }
    if (order.vehicle_id == null) {
        deliveryVehicle.style.border = "2px solid red";
        errors = errors + "Please Select Vehicle.! \n";
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
        if (order.servicecharge != oldorder.servicecharge) {
            updates = updates + "Service Charge has updated from " + oldorder.servicecharge + " \n";
        }
        if (order.netamount != oldorder.netamount) {
            updates = updates + "Net Amount has updated from " + oldorder.netamount + " \n";
        }
        if (order.supplyorderstatus_id.status != oldorder.supplyorderstatus_id.status) {
            updates = updates + "Status has updated from " + oldorder.supplyorderstatus_id.status + " \n";
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
    text = "Type : " + order.ordertype_id
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
//define function for clear Inner form
const buttonInnerFormClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning"
    });
    refreshInnerFormandTableSubmenu();
    refreshInnerFormandTableMenu();
}

//function define for print Order record
const orderPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodyOrders, rowIndex, "White");

    let newWindow = window.open();
    let printView = '<html>'
        + '<head>'
        + '<link rel="stylesheet" href="../Resourse/bootstrap-5.2.3/css/bootstrap.min.css">'
        + '<title>BIT Project | 2025</title></head>'
        + '<body><h1>Print Order Details</h1>'
        + '<table class="table-bordered table-stripped border-1 w-25">'
        + '<tr><th> Order :</th><td>' + ob.id + '</td></tr>'
        + '<tr><th> Mobile Number :</th><td>' + ob.contact_no + '</td></tr>'
        + '<tr><th> Email :</th><td>' + ob.email + '</td></tr>'
        + '<tr><th> Address :</th><td>' + ob.address + '</td></tr>'
        + '<tr><th> Bank Name :</th><td>' + ob.bankname + '</td></tr>'
        + '<tr><th> Branch Name :</th><td>' + ob.branchname + '</td></tr>'
        + '<tr><th> Account Number :</th><td>' + ob.accountnumber + '</td></tr>'
        + '<tr><th> Account Holder Name :</th><td>' + ob.holdername + '</td></tr>'
        + '<tr><th> Order type :</th><td>' + ob.ordertype + '</td></tr>'
        + '<tr><th> Status :</th><td>' + ob.orderstatus_id.status + '</td></tr>'
        + '</table>'
        + '</body></html>'
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
}