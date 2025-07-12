//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshGrnTable();
});

//define function for refresh form
const refreshForm = () => {
    formGrn.reset();
    // btnsubmit.disabled = false;
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";
    btnclr.style.display = "inline";

    selectPurchaseOrder.disabled = "";
    txtTotalAmount.value = "";
    txtTotalAmount.disabled = "disabled";
    txtDiscount.value = "";
    txtDiscount.disabled = "";
    txtNetamount.value = "";
    txtNetamount.disabled = "disabled";
    SelectStatus.disabled = "disabled";

    //define new object
    grn = new Object();
    grn.grnHasIngredientList = new Array();

    const supplierOrders = getServiceRequest("/supplierorder/alldata");
    fillDropdownTwo(selectPurchaseOrder, "Select Purchase Order.!", supplierOrders, "ordercode", "supplier_id.supplier_name")
    // fillDropdown(selectPurchaseOrder, "Select Purchase Order.!", supplierOrders, "ordercode");

    const grnstatuses = getServiceRequest("/grnstatus/alldata");
    fillDropdown(SelectStatus, "Select Status.!", grnstatuses, "status");

    setDefault([selectPurchaseOrder, txtSupplierInvoice, dateReceived, txtReceivedBy, txtTotalAmount, txtDiscount, txtNetamount, SelectStatus, txtNote]);

    // status eka form eka open weddima active wdyt select wenna
    SelectStatus.value = JSON.stringify(grnstatuses[0]);//select value eka string wenna one nisa object eka string baweta convert krenw
    // supplierStatuses list eken aregnna nisa aniwaryen object ekata value eka set kala yuthui
    grn.grnstatus_id = grnstatuses[0];
    SelectStatus.style.border = "2px solid green";

    refreshInnerFormandTable();

    // set date range for payment date & check date
    //formatDateRange = (minInputElement, maxInputElement, minrange, maxrange)
    formatDateRange(dateReceived, "", 7, "");
}

const calculateNetAmount = () => {
    // reset discount
    txtDiscount.value = "";
    grn.discountamount = 0;

    /* ### Generate Net Amount ### */
    let totalamount = parseFloat(txtTotalAmount.value) || 0;
    let discountamount = parseFloat(txtDiscount.value) || 0;
    let netamount = totalamount - discountamount;
    // Update net amount input
    txtNetamount.value = netamount.toFixed(2);
    // Store in grn object
    grn.netamount = txtNetamount.value;
    txtNetamount.style.border = "2px solid green";
}

/* ############################## INNER FORM FUNCTIONS ################################# */

// define function for check ingredients existance
const checkIngredientExt = () => {
    //dropdown eken select krena value eka aregnnewa object ekak lesa convert krela 
    let Selectedingredient = JSON.parse(SelectIngredints.value);
    // grnHasIngredientList list eke purchace order item ekin eka search krela eke id eka selected ingredient eke id ekata samana wenewanm index eka return krenw
    let extIndex = grn.grnHasIngredientList.map(item => item.ingredient_id.id).indexOf(Selectedingredient.id);
    // index eka -1 ta wada wadinm,
    if (extIndex > -1) {
        // ema selected ingredient eka already list eke thyena item ekak
        window.alert("selected ingredient already existed.!");
        refreshInnerFormandTable();
    } else { //list eke naththan
        // price eka input box eke show krnw
        txtPrice.value = parseFloat(Selectedingredient.purchase_price).toFixed(2); //ingredient entity eken Selectedingredient eke purchase_price eka gnnewa
        grnHasIngredient.price = parseFloat(txtPrice.value).toFixed(2);
        txtPrice.style.border = "2px solid green";
    }
}

// define function for filter ingredients by Supplier
const filteringredientsbySupplierOrder = () => {
    let ingredients = getServiceRequest("/ingredient/listbysupplierOrder?supplierorderid=" + JSON.parse(selectPurchaseOrder.value).id);
    fillDropdownTwo(SelectIngredints, "Select Ingredients", ingredients, "ingredient_name", "unittype_id.name");
    SelectIngredints.disabled = false;
}

//define function for refresh inner form
const refreshInnerFormandTable = () => {
    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnInnerSubmit.style.display = "inline";
    btnInnerUpdate.style.display = "none";
    btnInnerClr.style.display = "inline";

    //define new object
    grnHasIngredient = new Object();

    let ingredients = [];
    if (selectPurchaseOrder.value == "") {
        fillDropdown(SelectIngredints, "Select Purchase Order First.!", [], "");
        SelectIngredints.disabled = true;
    } else {
        // filteringredientsbySupplier function eken ena data innerform eka refresh weddi makenewa.. e nisa methanadi api eka aye aregnna one
        ingredients = getServiceRequest("/ingredient/listbysupplierOrder?supplierorderid=" + JSON.parse(selectPurchaseOrder.value).id);
        fillDropdownTwo(SelectIngredints, "Select Ingredients", ingredients, "ingredient_name", "unittype_id.name");
        SelectIngredints.disabled = false;
    }

    txtPrice.value = "";
    txtPrice.disabled = "disabled";
    txtBatchnumber.value = "";
    dateExpire.value = "";
    dateMade.value = "";
    txtQuantity.value = "";
    txtLinePrice.value = "";
    txtLinePrice.disabled = "disabled";


    // set date range for manufacture date & expire date
    formatDateRange(dateMade, dateExpire, 7, 14);
    //formatDateRange = (minInputElement, maxInputElement, minrange, maxrange)

    setDefault([SelectIngredints, txtPrice, txtBatchnumber, dateExpire, dateMade, txtQuantity, txtLinePrice]);

    //define function for refresh inner table
    let columns = [
        { property: getIngredientName, dataType: "function" },
        { property: "batchnumber", dataType: "string" },
        { property: "price", dataType: "decimal" },
        { property: "quantity", dataType: "decimal" },
        { property: "lineprice", dataType: "decimal" },
    ];

    //call fill data into table
    fillInnerTable(tBodyGrnhasIngredient, grn.grnHasIngredientList, columns, grnIngredientFormRefill, grnIngredientDelete, true);

    // grnHasIngredientList ekata data ekathu unoth line price wela ekathuwa gnna puluwn
    let totalamount = 0.00;
    for (const ghi of grn.grnHasIngredientList) {
        totalamount = parseFloat(totalamount) + parseFloat(ghi.lineprice);
    }
    if (totalamount > 0.00) {
        txtTotalAmount.value = totalamount.toFixed(2);
        grn.totalamount = txtTotalAmount.value;
        txtTotalAmount.style.border = "2px solid green";
    }

    let column = [{ property: "lineprice", dataType: "decimal" }];
    fillInnerTableFooter(tfootGrnhasIngredient, grn.grnHasIngredientList, column, columns.length);

    calculateNetAmount();
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
        grnHasIngredient.lineprice = lineprice;

        // total eke value eka txtLinePrice input field eke decimal point 2kakin show krenewa
        txtLinePrice.value = parseFloat(lineprice).toFixed(2);
        txtLinePrice.style.border = "2px solid green";
    } else {
        grnHasIngredient.quantity = null;
        grnHasIngredient.lineprice = null;

        txtQuantity.style.border = "2px solid red";
        txtLinePrice.style.border = "solid 1px #ced4da";
        txtLinePrice.value = "";
    }
}

const grnIngredientFormRefill = (ob, index) => {
    innerFormindex = index;
    // btnInnerUpdate.style.display = "none"; wdyt gnnth puluwn
    btnInnerUpdate.style.display = "none";
    btnInnerSubmit.style.display = "none";
    btnInnerClr.style.display = "none";

    grnHasIngredient = JSON.parse(JSON.stringify(ob));
    oldgrnHasIngredient = JSON.parse(JSON.stringify(ob));

    SelectIngredints.disabled = true;
    SelectIngredints.value = JSON.stringify(ob.ingredient_id);
    txtBatchnumber.value = ob.batchnumber;
    txtPrice.value = ob.price;
    txtQuantity.value = ob.quantity;
    txtLinePrice.value = parseFloat(ob.lineprice).toFixed(2);
}

const grnIngredientDelete = (ob, index) => {
    grnHasIngredient = ob;
    Swal.fire({
        title: "Are you sure to Delete Seleted Grn Ingredient Details.?",
        text: "Ingredient : " + ob.ingredient_id.ingredient_name
            + ",  Batchnumber : " + ob.batchnumber
            + ",  Qauntity : " + ob.quantity
            + ",  Line Price : " + ob.lineprice,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = grn.grnHasIngredientList.map(grnIngredient => grnIngredient.ingredient_id.id).indexOf(ob.ingredient_id.id);
            if (extIndex != -1) {
                grn.grnHasIngredientList.splice(extIndex, 1);
            }
            Swal.fire({
                title: "Deleted Successfully.!",
                text: "Grn Ingredient has Deleted.",
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

const buttonGrnIngredientSubmit = () => {
    console.log(grnHasIngredient);
    //check if there are any errors
    if (grnHasIngredient.quantity != null || grnHasIngredient.quantity > 0) {
        Swal.fire({
            title: "Are you sure to Submit Following Details.?",
            text: "Ingredient : " + grnHasIngredient.ingredient_id.ingredient_name
                + ", Quantity : " + grnHasIngredient.quantity,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                // main eke thyena list ekta inner object eka push krenewa
                grn.grnHasIngredientList.push(grnHasIngredient);
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

checkInnerFormUpdate = () => {
    let updates = "";

    if (grnHasIngredient != null && oldgrnHasIngredient != null) {
        if (grn.receivedby != oldgrn.receivedby) {
            updates = updates + "Receiver has updated from " + oldgrn.receivedby + " \n";
        }
        if (grnHasIngredient.batchnumber != oldgrnHasIngredient.batchnumber) {
            updates = updates + "Batch Number has updated from " + oldgrnHasIngredient.batchnumbert + " \n";
        }
        if (grnHasIngredient.manufacturedate != oldgrnHasIngredient.manufacturedate) {
            updates = updates + "Manufacture Date has updated from " + oldgrnHasIngredient.manufacturedate + " \n";
        }
        if (grnHasIngredient.expiredate != oldgrnHasIngredient.expiredate) {
            updates = updates + "Expire Date has updated from " + oldgrnHasIngredient.expiredate + " \n";
        }
        if (grnHasIngredient.quantity != oldgrnHasIngredient.quantity) {
            updates = updates + "Status has updated from " + oldgrnHasIngredient.quantity + " \n";
        }
    }
    return updates;
}

const buttonGrnIngredientUpdate = () => {
    console.log(grnHasIngredient);
    let errors = checkInnerFormError();
    if (errors == "") {
        //check updates
        let updates = checkInnerFormUpdate();
        if (updates) {
            Swal.fire({
                title: "Are you sure you want to update following changes.?",
                text: "Quantity has updated from " + oldgrnHasIngredient.quantity,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Update!"
            }).then((result) => {
                if (result.isConfirmed) {
                    // main eke thyena list ekta inner object eka push krenewa
                    supplierorder.grnHasIngredientList[innerFormindex] = grnHasIngredient;
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
    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

/* ############################## MAIN FORM FUNCTIONS ################################# */

//create refresh table function
const refreshGrnTable = () => {

    const grns = getServiceRequest("/grn/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    const columns = [
        { property: "grnnumber", dataType: "string" },
        { property: getSupplierOrderCode, dataType: "function" },
        { property: "supplierinvoiceno", dataType: "string" },
        { property: "dateofreceived", dataType: "string" },
        { property: "receivedby", dataType: "string" },
        { property: "totalamount", dataType: "decimal" },
        { property: "discountamount", dataType: "decimal" },
        { property: "netamount", dataType: "decimal" },
        { property: getGrnStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodyGrn, grns, columns, GrnFormRefill, true);
    $('#tableGrn').DataTable();
}

//define function for get supplier order status
const getGrnStatus = (dataOb) => {
    if (dataOb.grnstatus_id.status == "Received") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.grnstatus_id.status + "</p>";
    }
    if (dataOb.grnstatus_id.status == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.grnstatus_id.status + "</p>";
    }
    return dataOb.grnstatus_id.status;
}

//define function for get supplier name
const getSupplierOrderCode = (dataOb) => {
    return dataOb.supplierorder_id.ordercode;
}

//define function for get Ingredients list
const getIngredients = (dataOb) => {
    return dataOb.ingredient_id;
}

//define Form edit function
const GrnFormRefill = (ob, rowIndex) => {
    $('#modalGrn').modal('show');
    btnsubmit.style.display = "none";
    btnupdate.style.display = "none";
    btnclr.style.display = "none";

    grn = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldgrn = JSON.parse(JSON.stringify(ob));

    selectPurchaseOrder.disabled = "disabled";
    selectPurchaseOrder.value = JSON.stringify(grn.supplierorder_id);
    txtSupplierInvoice.value = ob.supplierinvoiceno;
    dateReceived.value = ob.dateofreceived;
    txtReceivedBy.value = ob.receivedby;
    txtTotalAmount.value = ob.totalamount;
    txtDiscount.disabled = true;
    txtDiscount.value = ob.discountamount;
    txtNetamount.value = ob.netamount;
    SelectStatus.disabled = true;
    SelectStatus.value = JSON.stringify(ob.grnstatus_id);

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
    if (grn.supplierorder_id == null) {
        selectPurchaseOrder.style.border = "2px solid red";
        errors = errors + "Please Select Purchase Order First.! \n";
    }
    if (grn.supplierinvoiceno == null) {
        txtSupplierInvoice.style.border = "2px solid red";
        errors = errors + "Please Enter Supplier Invoice Number.! \n";
    }
    if (grn.dateofreceived == null) {
        dateReceived.style.border = "2px solid red";
        errors = errors + "Please Select Date of Received.! \n";
    }
    if (grn.receivedby == null) {
        txtReceivedBy.style.border = "2px solid red";
        errors = errors + "Please Enter Goods Receiver.! \n";
    }
    if (grn.grnHasIngredientList.length == 0) {
        errors = errors + "Please Select Grn Ingredients First.! \n";
    }
    if (grn.totalamount == null) {
        txtTotalAmount.style.border = "2px solid red";
        errors = errors + "Please Enter valid Total Amount.! \n";
    }
    if (grn.netamount == null) {
        txtNetamount.style.border = "2px solid red";
    }
    if (grn.grnstatus_id == null) {
        SelectStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    return errors;
}

//define function for check for updates 
const checkFormUpdate = () => {
    let updates = "";

    if (grn != null && oldgrn != null) {
        if (grn.supplierinvoiceno != oldgrn.supplierinvoiceno) {
            updates = updates + "Supplier Invoice Number has updated from " + oldgrn.supplierinvoiceno + " \n";
        }
        if (grn.dateofreceived != oldgrn.dateofreceived) {
            updates = updates + "Received Date has updated from " + oldgrn.dateofreceived + " \n";
        }
        if (grn.receivedby != oldgrn.receivedby) {
            updates = updates + "Receiver has updated from " + oldgrn.receivedby + " \n";
        }
        if (grn.totalamount != oldgrn.totalamount) {
            updates = updates + "Total Amount has updated from " + oldgrn.totalamount + " \n";
        }
        if (grn.discountamount != oldgrn.discountamount) {
            updates = updates + "Discount Amount has updated from " + oldgrn.discountamount + " \n";
        }
        if (grn.netamount != oldgrn.netamount) {
            updates = updates + "Net Amount has updated from " + oldgrn.netamount + " \n";
        }
        if (grn.grnstatus_id.status != oldgrn.grnstatus_id.status) {
            updates = updates + "Status has updated from " + oldgrn.grnstatus_id.status + " \n";
        }
    }
    return updates;
}

//define function for submit button
const buttonGrnSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following GRN.?";
    obName = "";
    text = "Purchase Order No. : " + grn.supplierorder_id.ordercode
        + ", Received Date : " + grn.dateofreceived
        + ", Received By : " + grn.receivedby
        + ", Supplier Invoice No. : " + grn.supplierinvoiceno
        + ", Net Amount : " + grn.netamount;
    let submitResponse = getHTTPServiceRequest('/grn/insert', "POST", grn);
    swalSubmit(errors, title, obName, text, submitResponse, modalGrn);
}

//define function for update button
const buttonGrnUpdate = () => {
    //check if there are any errors
    let errors = checkFormError();
    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();
        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = getHTTPServiceRequest('/grn/update', "PUT", grn);
        swalUpdate(updates, title, text, updateResponse, modalGrn);
    } else {
        Swal.fire({
            title: "Failed to Update.! Form has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

//function define for delete Supplier Order record
const GrnDelete = (ob, rowIndex) => {
    supplier = ob;
    title = "Are you sure to Delete Selected GRN";
    obName = "";
    text = "Purchase Order No. : " + grn.supplierorder_id.ordercode
        + ", Received Date : " + grn.dateofreceived
        + ", Received By : " + grn.receivedby
        + ", Supplier Invoice No. : " + grn.supplierinvoiceno;
    let deleteResponse = getHTTPServiceRequest('/grn/delete', "DELETE", grn);
    message = "GRN has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalGrn, message);
}

//define function for clear Supplier Order form
const buttonGrnClear = () => {
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
        title: "Are you Sure to Close GRN Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
            $('#modalGrn').modal('hide');
            refreshGrnTable();
        }
    });
}

//function define for print Supplier Order record
const GrnPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodyGrn, rowIndex, "White");
    let newWindow = window.open();
    const currentDateTime = new Date().toLocaleString();

    const printView = `
        <html>
        <head>
            <title>GRN Management | 2025</title>
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
                <h1>Good Receive Note</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
            </div>
            <table class="table table-bordered table-striped">
                <tr>
                    <th>GRN Number</th>
                    <td>${ob.grnnumber}</td>
                </tr>
                <tr>
                    <th>Purchase Order Number</th>
                    <td>${ob.supplierorder_id.ordercode}</td>
                </tr>
                <tr>
                    <th>Received Ingredients</th>
                    <td>${ob.grnHasIngredient.ingredient_id.ingredient_name}</td>
                </tr>
                <tr>
                    <th>Supplier Invoice Number</th>
                    <td>${ob.supplierinvoiceno}</td>
                </tr>
                <tr>
                    <th>Received Date</th>
                    <td>${ob.dateofreceived}</td>
                </tr>
                <tr>
                    <th>Received By</th>
                    <td>${ob.receivedby}</td>
                </tr>
                <tr>
                    <th>Total Amount</th>
                    <td>LKR ${parseFloat(ob.totalamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Discounted Amount</th>
                    <td>LKR ${parseFloat(ob.discountamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Net Amount</th>
                    <td>LKR ${parseFloat(ob.netamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>${ob.grnstatus_id.status}</td>
                </tr>
            </table>
            <div class="footer">
                &copy; 2025 BIT Project. All rights reserved.
            </div>
        </body>
        </html>
    `;
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
}