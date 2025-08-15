//browser load event handler
//aathule thyena logic  runs wenne entire page (DOM + all external resources) fully load unata passe
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshOrderPaymentTable();
});

//define function for refresh form
const refreshForm = () => {
    formOrderPayment.reset();

    //define new object
    orderPayment = new Object();
    // define new array for orderpayments has many orders
    orderPayment.paymentOrders = new Array();

    btnsubmit.style.display = "inline"; // display submit button
    btnclr.style.display = "inline";

    // enable disabled input fields
    SelectOrderId.disabled = false;
    selectPaymentMethod.disabled = false;
    txtPaidAmount.disabled = false;

    // disable input fields when form refresh
    txtBalanceAmount.value = "";
    txtBalanceAmount.disabled = true;
    txtTotalAmount.disabled = true;

    // request Orders by status == ready
    const orders = getServiceRequest("/order/bytypetakeaway");
    fillDropdown(SelectOrderId, "Select Order.!", orders, "ordercode");

    /* const supplierOrders = getServiceRequest("/order/bystatus?orderstatus_id=" + 3);
    fillDropdownTwo(SelectOrderId, "Select Customer Order.!", supplierOrders, "ordercode", "customer_id.custname") */

    // request payment method all data
    const orderPaymentMethods = getServiceRequest("/orderPaymentmethod/alldata");
    fillDropdown(selectPaymentMethod, "Select Method.!", orderPaymentMethods, "method");

    //set default color and reset input fields
    setDefault([SelectOrderId, selectPaymentMethod, txtTotalAmount, txtPaidAmount, txtBalanceAmount]);
}

// select grn field eke onchange ekedi trigger wenw
SelectOrderId.addEventListener("change", () => {
    let order = JSON.parse(SelectOrderId.value);
    console.log("Order ID" + SelectOrderId.value);

    // Parse amounts as numbers (not strings) and rounded to 2 decimal places
    txtTotalAmount.value = parseFloat(order.netamount).toFixed(2);
    orderPayment.totalamount = txtTotalAmount.value;
    txtTotalAmount.style.border = "2px solid green"; // Set border to green
    txtTotalAmount.disabled = true; // Disable the input field
});

selectPaymentMethod.addEventListener("change", () => {
    let method = JSON.parse(selectPaymentMethod.value);
    console.log("mehtod" + selectPaymentMethod.value);

    if (method.id == 1) {
        txtPaidAmount.value = txtTotalAmount.value;
        orderPayment.paidamount = txtPaidAmount.value;
        txtPaidAmount.style.border = "2px solid green"; // Set border to green
        txtPaidAmount.disabled = true; // Disable the input field

        calculateBalanceAmount();
    }
})

//create refresh table function
const refreshOrderPaymentTable = () => {
    let orderpayments = getServiceRequest("/orderpayment/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: getCustID, dataType: "function" },
        { property: getCustOrdersID, dataType: "function" },
        { property: "code", dataType: "string" },
        { property: getPaymentmethod, dataType: "function" },
        { property: "totalamount", dataType: "decimal" },
        { property: "paidamount", dataType: "decimal" },
        { property: "balanceamount", dataType: "decimal" }
    ];

    //call fill data into table
    fillTableFour(tBodyOrderPayment, orderpayments, columns, orderPaymentFormRefill, true);
    $('#tableOrderPayment').DataTable();
}

//define function for get Order name
const getCustID = (dataOb) => {
    return dataOb.customer_id?.reg_no ?? "-";
}

//define function for get Order name
const getCustOrdersID = (dataOb) => {
    let orderCode = "";
    dataOb.paymentOrders.forEach((payOrder, index) => {
        //index ekath ekka length eka check krenewa
        if (dataOb.paymentOrders.length - 1 == index) {
            orderCode = orderCode + payOrder.ordercode;
        } else {
            //index eka length ekt samana naththan coma eka danna 
            orderCode = orderCode + payOrder.ordercode + ", ";
        }
    });
    return orderCode;
}

//define function for get Ingredients list
const getPaymentmethod = (dataOb) => {
    return dataOb.orderpaymentmethod_id.method;
}

// define function for automatically calculate balance amount
const calculateBalanceAmount = () => {
    let payamount = parseFloat(txtPaidAmount.value);
    let total = parseFloat(txtTotalAmount.value);
    // generate balance amount
    let balanceamount = parseFloat(payamount - total).toFixed(2);

    // Set balance amount to input field
    txtBalanceAmount.value = balanceamount;
    txtBalanceAmount.style.border = "2px solid green";

    // set updated balanceamount in Orderpaymnet table
    orderPayment.balanceamount = balanceamount;
    orderPayment.paidamount = (payamount).toFixed(2);
};

//define Form edit function
const orderPaymentFormRefill = (ob) => {
    console.log(ob);
    $('#modalOrderPayment').modal('show');
    btnsubmit.style.display = "none";
    btnclr.style.display = "none";

    orderPayment = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldorderPayment = JSON.parse(JSON.stringify(ob));

    // set values to input fields
    SelectOrderId.disabled = true;
    SelectOrderId.value = JSON.stringify(ob.order_id);
    selectPaymentMethod.disabled = true;
    selectPaymentMethod.value = JSON.stringify(ob.orderpaymentmethod_id);
    txtTotalAmount.value = ob.totalamount;
    txtPaidAmount.value = ob.paidamount;
    txtPaidAmount.disabled = true;
    txtBalanceAmount.value = ob.balanceamount ? ob.balanceamount : "";
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    /* if (orderPayment.order_id == null) {
        SelectOrderId.style.border = "2px solid red";
        errors = errors + "Please Select Order First.! \n";
    } */
    if (orderPayment.orderpaymentmethod_id == null) {
        selectPaymentMethod.style.border = "2px solid red";
        errors = errors + "Please Select Payment Method.! \n";
    }
    if (orderPayment.paidamount == null) {
        txtPaidAmount.style.border = "2px solid red";
        errors = errors + "Please Select Payment Date.! \n";
    }
    return errors;
}

//define function for submit button
const buttonOrderPaymentSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following Order Payment for Order ID:";
    obName = "";
    text = ", Payment Method : " + orderPayment.orderpaymentmethod_id.method
        + ", Total Amount : " + orderPayment.totalamount
        + ", Paid Amount : " + orderPayment.paidamount
        + ", Balanced Amount : " + orderPayment.balanceamount;
    let submitResponse = ['/orderpayment/insert', "POST", orderPayment];
    swalSubmit(errors, title, obName, text, submitResponse, modalOrderPayment);
}

//define function for clear Order Payment form
const buttonOrderPaymentClear = () => {
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

//define function for modal close and refresh form
const buttonModalClose = () => {
    Swal.fire({
        title: "Are you Sure to Close Order Payment Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
            $('#modalOrderPayment').modal('hide');
            refreshOrderPaymentTable();
        }
    });
}

//function define for print Order Payment record
const orderPaymentPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodyOrderPayment, rowIndex, "White");

    let newWindow = window.open();
    const currentDateTime = new Date().toLocaleString();
    const printView = `
        <html>
        <head>
            <title>Order Payment Management | 2025</title>
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
                <h1>Order Payment Details</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
            </div>
            <table class="table table-bordered table-striped">
                <tr>
                    <th>Payment Code</th>
                    <td>${ob.paymentnumber}</td>
                </tr>
                <tr>
                    <th>Order Payment Date</th>
                      <td>${generateOrdersID(ob)}</td>
                </tr>
                <tr>
                    <th>User</th>
                    <td>${ob.addeduser.username}</td>
                </tr>
                <tr>
                    <th>Order Code</th>
                    <td>${ob.order_id.ordercode}</td>
                </tr>
                <tr>
                    <th>Payment Method</th>
                    <td>${ob.orderpaymentmethod_id.method}</td>
                </tr>
                <tr>
                    <th>Total Amount</th>
                    <td>LKR ${parseFloat(ob.totalamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Paid Amount</th>
                    <td>LKR ${parseFloat(ob.paidamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Balance Amount</th>
                    <td>LKR ${parseFloat(ob.balanceamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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

//define function for get Order name
const generateOrdersID = (ob) => {
    let orderCode = "";
    ob.paymentOrders.forEach((payOrder, index) => {
        //index ekath ekka length eka check krenewa
        if (ob.paymentOrders.length - 1 == index) {
            orderCode = orderCode + payOrder.ordercode;
        } else {
            //index eka length ekt samana naththan coma eka danna 
            orderCode = orderCode + payOrder.ordercode + ", ";
        }
    });
    return orderCode;
}