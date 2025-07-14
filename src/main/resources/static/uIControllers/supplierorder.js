//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshSupplierOrderTable();
});

//define function for refresh form
const refreshForm = () => {
    formSupplierOrder.reset();
    // btnsubmit.disabled = false;
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";
    SelectSupplier.disabled = "";
    //define new object
    supplierorder = new Object();
    supplierorder.supplierorderHasIngredientList = new Array();

    const suppliers = getServiceRequest("/supplier/alldata");
    fillDropdown(SelectSupplier, "Select Supplier.!", suppliers, "supplier_name");

    const supplierOrderStatuses = getServiceRequest("/supplyOrderStatus/alldata");
    fillDropdown(supplyorderStatus, "Select Status.!", supplierOrderStatuses, "status");

    setDefault([SelectSupplier, dateRequired, txtTotalAmount, supplyorderStatus, txtNote]);

    // status eka form eka open weddima active wdyt select wenna
    //select value eka string wenna one nisa object eka string baweta convert krenw
    supplyorderStatus.value = JSON.stringify(supplierOrderStatuses[0]);
    // supplierStatuses list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    supplierorder.supplyorderstatus_id = supplierOrderStatuses[0];
    supplyorderStatus.style.border = "2px solid green";

    // set min max value for required date field [yyyy-mm-dd]
    let currentDate = new Date(); //current date object ekak hdagnnw 
    let currentMonth = currentDate.getMonth() + 1; // [0-11]
    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth;
    }
    let currentDay = currentDate.getDate(); // [1-31]
    if (currentDay < 10) {
        currentDay = '0' + currentDay;
    }
    dateRequired.min = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

    currentDate.setDate(currentDate.getDate() + 7);
    let maxcurrentMonth = currentDate.getMonth() + 1; // [0-11]
    if (maxcurrentMonth < 10) {
        maxcurrentMonth = '0' + maxcurrentMonth;
    }
    let maxcurrentDay = currentDate.getDate(); // [1-31]
    if (maxcurrentDay < 10) {
        maxcurrentDay = '0' + maxcurrentDay;
    }
    dateRequired.max = currentDate.getFullYear() + "-" + maxcurrentMonth + "-" + maxcurrentDay;

    refreshInnerFormandTable();
}

/* ############################## INNER FORM FUNCTIONS ################################# */

// define function for check ingredients existance
// exit check krena welawedima thama selected item eke unit price ekth set kranne
const checkIngredientExt = () => {
    //dropdown eken select krena value eka aregnnewa object ekak lesa convert krela 
    let Selectedingredient = JSON.parse(SelectIngredints.value);
    // supplierorderHasIngredientList list eke purchace order item ekin eka search krela eke id eka selected ingredient eke id ekata samana wenewanm index eka return krenw
    let extIndex = supplierorder.supplierorderHasIngredientList.map(poitem => poitem.ingredient_id.id).indexOf(Selectedingredient.id);
    // index eka -1 ta wada wadinm,
    if (extIndex > -1) {
        // ema selected ingredient eka already list eke thyena item ekak
        window.alert("selected ingredient already existed.!");
        refreshInnerFormandTable();
    } else { //list eke naththan
        // price eka input box eke show krnw
        txtPrice.value = parseFloat(Selectedingredient.purchase_price).toFixed(2); //ingredient entity eken Selectedingredient eke purchase_price eka gnnewa
        supplierorderHasIngredient.price = parseFloat(txtPrice.value).toFixed(2);
        txtPrice.style.border = "2px solid green";
    }
}

// define function for filter ingredients by Supplier
const filteringredientsbySupplier = () => {
    let ingredients = getServiceRequest("/ingredient/listbysupplier?supplierid=" + JSON.parse(SelectSupplier.value).id);
    fillDropdownTwo(SelectIngredints, "Select Ingredients", ingredients, "ingredient_name", "unittype_id.name");
    SelectIngredints.disabled = false;
}

//define function for refresh inner form
const refreshInnerFormandTable = () => {

    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    //define new object
    supplierorderHasIngredient = new Object();

    //SelectIngredints.disabled = true;
    let ingredients = [];
    if (SelectSupplier.value == "") {
        fillDropdown(SelectIngredints, "Select Supplier First.!", [], "");
        SelectIngredints.disabled = true;
    } else {
        // filteringredientsbySupplier function eken ena data innerform eka refresh weddi makenewa.. e nisa methanadi api eka aye aregnna one
        ingredients = getServiceRequest("/ingredient/listbysupplier?supplierid=" + JSON.parse(SelectSupplier.value).id);
        fillDropdownTwo(SelectIngredints, "Select Ingredients", ingredients, "ingredient_name", "unittype_id.name");
        SelectIngredints.disabled = false;
    }

    /*         ingredients = getServiceRequest("/ingredient/list");
    // fillDropdownTwo function eka common eke declare kranna one meka gnnanm
        fillDropdownTwo(SelectIngredints, "Select Ingredients", ingredients, "ingredient_name", supplierorderHasIngredient.ingredient_id.ingredient_name); */

    txtPrice.value = "";
    txtPrice.disabled = "disabled";
    txtQuantity.value = "";
    txtLinePrice.value = "";
    txtLinePrice.disabled = "disabled";

    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnInnerUpdate.classList.add("d-none");
    btnInnerSubmit.classList.remove("d-none");

    setDefault([SelectIngredints, txtPrice, txtQuantity, txtLinePrice]);

    //define function for refresh inner table
    let columns = [
        { property: getIngredientName, dataType: "function" },
        { property: "price", dataType: "decimal" },
        { property: "quantity", dataType: "string" },
        { property: "lineprice", dataType: "decimal" },
    ];

    //call fill data into table
    fillInnerTable(tBodySupplyOrderhasIngredient, supplierorder.supplierorderHasIngredientList, columns, supplierOrderIngredientFormRefill, supplierOrderIngredientDelete, true);

    // supplierorderHasIngredientList ekata data ekathu unoth line price wela ekathuwa gnna puluwn
    let totalamount = 0.00;
    for (const orderIngredient of supplierorder.supplierorderHasIngredientList) {
        totalamount = parseFloat(totalamount) + parseFloat(orderIngredient.lineprice);
    }
    if (totalamount != 0.00) {
        txtTotalAmount.value = totalamount.toFixed(2);
        supplierorder.totalamount = txtTotalAmount.value;
        txtTotalAmount.style.border = "2px solid green";
    }

    let column = [{ property: "lineprice", dataType: "decimal" }];
    fillInnerTableFooter(tfootSupplyOrderhasIngredient, supplierorder.supplierorderHasIngredientList, column, columns.length);
}

const getIngredientName = (ob) => {
    return ob.ingredient_id.ingredient_name;
}

//onkeyup ekedi wada krenewa (adala html input field eka athule function eka call kranne one)
const generateLineprice = (ob) => {
    if (txtQuantity.value > 0) {
        //input fields wela values convert krenewa string walin float bawat
        let unitprice = parseFloat(txtPrice.value);
        let quantity = parseFloat(txtQuantity.value);

        //multiply quantity and unit price
        let lineprice = quantity * unitprice;
        supplierorderHasIngredient.lineprice = lineprice;

        // total eke value eka txtLinePrice input field eke decimal point 2kakin show krenewa
        txtLinePrice.value = parseFloat(lineprice).toFixed(2);
        txtLinePrice.style.border = "2px solid green";
    } else {
        supplierorderHasIngredient.quantity = null;
        supplierorderHasIngredient.lineprice = null;

        txtQuantity.style.border = "2px solid red";
        txtLinePrice.style.border = "solid 1px #ced4da";
        txtLinePrice.value = "";
    }
}

const supplierOrderIngredientFormRefill = (ob, index) => {
    innerFormindex = index;
    btnInnerUpdate.classList.remove("d-none");
    btnInnerSubmit.classList.add("d-none");

    supplierorderHasIngredient = JSON.parse(JSON.stringify(ob));
    oldSupplierorderHasIngredient = JSON.parse(JSON.stringify(ob));

    SelectIngredints.disabled = "disabled";
    SelectIngredints.value = JSON.stringify(ob.ingredient_id);
    txtPrice.value = ob.price;
    txtQuantity.value = ob.quantity;
    txtLinePrice.value = parseFloat(ob.lineprice).toFixed(2);
}

const supplierOrderIngredientDelete = (ob, index) => {
    supplierorderHasIngredient = ob;
    Swal.fire({
        title: "Are you sure to Delete Seleted Supply Ingredient Details.?",
        text: "Ingredient : " + ob.ingredient_id.ingredient_name
            + ",  Qauntity : " + ob.quantity
            + ",  Line Price : " + ob.lineprice,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = supplierorder.supplierorderHasIngredientList.map(orderIngredient => orderIngredient.ingredient_id.id).indexOf(ob.ingredient_id.id);
            if (extIndex != -1) {
                supplierorder.supplierorderHasIngredientList.splice(extIndex, 1);
            }
            Swal.fire({
                title: "Deleted Successfully.!",
                text: "Supply Ingredient Order has Deleted.",
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

const buttonSupplierOrderIngredientSubmit = () => {
    console.log(supplierorderHasIngredient);
    if (supplierorderHasIngredient.quantity != null || supplierorderHasIngredient.quantity > 0) {
        Swal.fire({
            title: "Are you sure to Submit Following Details.?",
            text: "Ingredient : " + supplierorderHasIngredient.ingredient_id.ingredient_name
                + ", Quantity : " + supplierorderHasIngredient.quantity,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                // main eke thyena list ekta inner object eka push krenewa
                supplierorder.supplierorderHasIngredientList.push(supplierorderHasIngredient);
                Swal.fire({
                    title: "Saved Successfully..!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1800
                });
                refreshInnerFormandTable();
            }
        });
    } else {
        Swal.fire({
            title: "Failed to Submit.!",
            text: "Enter valid Quantity.!",
            icon: "error"
        });
    }
}

const buttonSupplierOrderIngredientUpdate = () => {
    console.log(supplierorderHasIngredient);
    if (supplierorderHasIngredient.quantity != oldSupplierorderHasIngredient.quantity) {
        Swal.fire({
            title: "Are you sure you want to update following changes.?",
            text: "Quantity has updated from " + oldSupplierorderHasIngredient.quantity,
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
                // main eke thyena list ekta inner object eka push krenewa
                supplierorder.supplierorderHasIngredientList[innerFormindex] = supplierorderHasIngredient;
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
}

/* ############################## MAIN FORM FUNCTIONS ################################# */

//create refresh table function
const refreshSupplierOrderTable = () => {

    let supplierOrders = getServiceRequest("/supplierorder/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "ordercode", dataType: "string" },
        { property: getSupplierName, dataType: "function" },
        { property: "daterequired", dataType: "string" },
        { property: "totalamount", dataType: "decimal" },
        { property: getSupplyOrderStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodySupplierOrder, supplierOrders, columns, supplierOrderFormRefill, true);
    $('#tableSupplierOrder').DataTable();
}

//define function for get supplier order status
const getSupplyOrderStatus = (dataOb) => {
    if (dataOb.supplyorderstatus_id.status == "Completed") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.supplyorderstatus_id.status + "</p>";
    }
    if (dataOb.supplyorderstatus_id.status == "Received") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.supplyorderstatus_id.status + "</p>";
    }
    if (dataOb.supplyorderstatus_id.status == "Pending") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.supplyorderstatus_id.status + "</p>";
    }
    if (dataOb.supplyorderstatus_id.status == "Canceled") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.supplyorderstatus_id.status + "</p>";
    }
    if (dataOb.supplyorderstatus_id.status == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.supplyorderstatus_id.status + "</p>";
    }
    return dataOb.supplyorderstatus_id.status;
}

//define function for get supplier name
const getSupplierName = (dataOb) => {
    return dataOb.supplier_id.supplier_name;
}

//define Form edit function
const supplierOrderFormRefill = (ob, rowIndex) => {
    $('#modalSupplierOrder').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    supplierorder = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldsupplierorder = JSON.parse(JSON.stringify(ob));

    SelectSupplier.disabled = "disabled";
    SelectSupplier.value = JSON.stringify(supplierorder.supplier_id);
    dateRequired.value = ob.daterequired;
    supplyorderStatus.value = JSON.stringify(ob.supplyorderstatus_id);

    if (ob.note == undefined) {
        txtNote.value = "";
    } else {
        txtNote.value = ob.note;
    }
    // innerform eke date tika fill kregnna one nisa
    refreshInnerFormandTable();
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (supplierorder.supplier_id == null) {
        SelectSupplier.style.border = "2px solid red";
        errors = errors + "Please Select Supplier First.! \n";
    }
    if (supplierorder.daterequired == null) {
        dateRequired.style.border = "2px solid red";
        errors = errors + "Please Select Required Date.! \n";
    }
    if (supplierorder.totalamount == null) {
        txtTotalAmount.style.border = "2px solid red";
        errors = errors + "Please Enter valid Amount.! \n";
    }
    if (supplierorder.supplierorderHasIngredientList.length == 0) {
        errors = errors + "Please Select Order Ingredients.! \n";
    }
    if (supplierorder.supplyorderstatus_id == null) {
        supplyorderStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";

    if (supplierorder != null && oldsupplierorder != null) {
        /*  if (supplierorder.supplier_id.supplier_name != oldsupplierorder.supplier_id.supplier_name) {
             updates = updates + "Supplier name has updated from " + oldsupplierorder.supplier_id.supplier_name + " \n";
         } */
        if (supplierorder.daterequired != oldsupplierorder.daterequired) {
            updates = updates + "Required Date has updated from " + oldsupplierorder.daterequired + " \n";
        }
        if (supplierorder.totalamount != oldsupplierorder.totalamount) {
            updates = updates + "Total Amount has updated from " + oldsupplierorder.totalamount + " \n";
        }
        if (supplierorder.supplyorderstatus_id.status != oldsupplierorder.supplyorderstatus_id.status) {
            updates = updates + "Status has updated from " + oldsupplierorder.supplyorderstatus_id.status + " \n";
        }
        // list wela length eka wenas welanm update ekk wela
        if (supplierorder.supplierorderHasIngredientList.length != oldsupplierorder.supplierorderHasIngredientList.length) {
            updates = updates + "Supplier Ingredients has updated \n";
        } else {
            let equalCount = 0;
            // old list eke item ekin eka read krnewa
            for (const oldsoitem of oldsupplierorder.supplierorderHasIngredientList) {
                for (const newsoitem of supplierorder.supplierorderHasIngredientList) {
                    // old & new item wela id samanainm
                    if (oldsoitem.ingredient_id.id == newsoitem.ingredient_id.id) {
                        equalCount = +1;
                    }
                }
            }

            if (equalCount != supplierorder.supplierorderHasIngredientList) {
                updates = updates + "Supplier Ingredients has updated \n";
            } else {
                // old list eke item ekin eka read krnewa
                for (const oldsoitem of oldsupplierorder.supplierorderHasIngredientList) {
                    for (const newsoitem of supplierorder.supplierorderHasIngredientList) {
                        // old & new item wela id samanai & quantity asemana wita
                        if (oldsoitem.ingredient_id.id == newsoitem.ingredient_id.id && oldsoitem.quantity != newsoitem.quantity) {
                            updates = updates + "Supplier Ingredient Quantity has updated \n";
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
const buttonSupplierOrderSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following Purchase Order";
    obName = "";
    text = "Supplier : " + supplierorder.supplier_id.supplier_name
        + ", Required Date : " + supplierorder.daterequired
        + ", Total Amount : " + supplierorder.totalamount;
    let submitResponse = ['/supplierorder/insert', "POST", supplierorder];
    swalSubmit(errors, title, obName, text, submitResponse, modalSupplierOrder);

    /* //check errors
    if (errors == "") {
        Swal.fire({
            title: "Are you sure to Submit following Purchase Order.?",
            text: "Supplier : " + supplierorder.supplier_id.supplier_name
                + ", Required Date : " + supplierorder.daterequired
                + ", Total Amount : " + supplierorder.totalamount,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post servise for insert data
                let submitResponse = getHTTPServiceRequest('/supplierorder/insert', "POST", supplierorder);
                if (submitResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully..!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    window.location.reload();
                    $('#modalSupplierOrder').modal('hide');
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
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

//define function for update button
const buttonSupplierOrderUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();

        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = ['/supplierorder/update', "PUT", supplierorder];
        swalUpdate(updates, title, text, updateResponse, modalSupplierOrder);

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
                    let updateResponse = getHTTPServiceRequest('/supplierorder/update', "PUT", supplierorder);
                    if (updateResponse == "OK") {
                        Swal.fire({
                            title: "Successfully Updated..!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        window.location.reload();
                        $('#modalSupplierOrder').modal('hide');
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
            title: "Failed to Update.! Form has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

//function define for delete Supplier Order record
const supplierOrderDelete = (ob, rowIndex) => {
    supplier = ob;
    title = "Are you sure to Delete Selected Purchase Order";
    obName = "";
    text = "Supplier : " + supplierorder.supplier_id.supplier_name
        + ", Required Date : " + supplierorder.daterequired
        + ", Total Amount : " + supplierorder.totalamount;
    let deleteResponse = ['/supplierorder/delete', "DELETE", supplierorder];
    message = "Purchase Order has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalSupplierOrder, message);
}

//define function for clear Supplier Order form
const buttonSupplierOrderClear = () => {
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
        title: "Are you Sure to Close Purchase Order Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
            $('#modalSupplierOrder').modal('hide');
            //call refresh table function
            refreshSupplierOrderTable();
        }
    });
}


//function define for print Supplier Order record
/* const supplierOrderPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodySupplierOrder, rowIndex, "White");

    let newWindow = window.open();
    const currentDateTime = new Date().toLocaleString();
    const printView = `
        <html>
        <head>
            <title>Purchase Order Management | 2025</title>
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
                <h1>Purchase Order Details</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
            </div>
            <div class="container">
            <div class="row detail-row justify-content-md-center">
                    <div class="col-5 fw-bold">Purchase Order Code :</div>
                    <div class="col">${ob.ordercode}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Supplier Name :</div>
                    <div class="col">${ob.supplier_id.supplier_name}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Date Required :</div>
                    <div class="col">${ob.daterequired}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Purchased Ingredients :</div>
                    <div class="col">${ob.supplierorderHasIngredient.ingredient_id.ingredient_name}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Total Amount :</div>
                    <div class="col">LKR ${parseFloat(ob.totalamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div><br>
                <div class="row detail-row">
                    <div class="col-5 fw-bold">Status :</div>
                    <div class="col">${ob.supplyorderstatus_id.status}</div>
                </div>
            </div>

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
} */


//function define for print Order record
const supplierOrderPrint = (ob, rowIndex) => {
    console.log("Printing order:", ob, rowIndex);

    // table eke row eka click kalama color eka change wenw
    activeTableRow(tBodySupplierOrder, rowIndex, "White");

    // Print eke content eka generate krena function eka cll krenewa
    const printContent = generateSupplyOrderPrintHTML(ob);

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
const generateSupplyOrderPrintHTML = (ob) => {
    ob = supplierorder;
    const currentDateTime = new Date().toLocaleString();

    //  @returns {string} - print window eke display wenna one html eka return krnw
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- link bs5 -->
        <link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">
        <!-- link css -->
        <link rel="stylesheet" href="css/print.css">

        <title> Purchase Order Management - BIT 2025</title>
    </head>
    <body>
        <div class="header">
                <img src="images/bando1.png" alt="Logo">
                <h1>Purchase Order Receipt</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
        </div>

        <div class="order-info">
            <table>
                <tr>
                    <th>Purcahse Order ID</th>
                    <td>${ob.ordercode}</td>
                </tr>
                <tr>
                    <th> Supplier Name</th>
                    <td>${ob.supplier_id.supplier_name}</td>
                </tr>
                <tr>
                    <th> Required Date </th>
                    <td>${ob.daterequired}</td></tr>
                <tr>
                    <th> Status </th>
                    <td>${ob.supplyorderstatus_id.status}</td>
                </tr>
            </table>
        </div>

        <div class="items-section">
            <h3> Order Ingredients </h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ingredient Name</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateItemRows(ob)}
                </tbody>
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="4">Total</td>
                        <td>Rs.  ${formatCurrency(ob.totalamount)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="footer">
            <p>Thank you for your business! </p>
            &copy; 2025 BIT Project. All rights reserved.
            <p>Generated on ${currentDateTime}</p>
        </div>
    </body>
    </html>
    `;
};

//@param {Array} items - Array of order items
//@returns {string} - HTML string for table rows
const generateItemRows = (supplierorder) => {
    // Extract items from the correct association names
    const items = supplierorder.supplierorderHasIngredientList || [];

    return items.map((item, index) => {
        // Handle different possible database structures
        const itemName = item.ingredient_id?.ingredient_name || "";

        const unitPrice = item.price;

        const quantity = item.quantity;

        const lineTotal = item.lineprice;

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${itemName}</td>
                <td>Rs. ${formatCurrency(unitPrice)}</td>
                <td>${quantity}</td>
                <td>Rs. ${formatCurrency(lineTotal)}</td>
            </tr>
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