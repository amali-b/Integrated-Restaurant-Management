//browser load event handler
//aathule thyena logic  runs wenne entire page (DOM + all external resources) fully load unata passe
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();

    //call refresh table function
    refreshSupplierPaymentTable();
});


// define function for filter grn by supplier
const filtergrnsBySupplier = () => {
    // supplier kenek select krelada kyl check krenewa
    if (SelectSupplier.value != "") {
        // filteringredientsbySupplier function eken ena data innerform eka refresh weddi makenewa.. e nisa methanadi api eka aye aregnna one
        grns = getServiceRequest("/grn/listbysupplierdueamount?supplierid=" + JSON.parse(SelectSupplier.value).id);
        console.log("Selected Supplier" + JSON.parse(SelectSupplier.value).id);
        fillDropdown(SelectGrn, "Select Grn.!", grns, "grnnumber");
        SelectGrn.disabled = false;
    } else {
        fillDropdown(SelectGrn, "Select Supplier First.!", [], "");
        SelectGrn.disabled = true;
    }
};

/* const filterAvailableGRN = (suppliersGrn, supplierPayments) => { 
    const balanceZeroGrns = supplierPayments.map(item => {
        if (item.balnaceAmount == 0) {
            item.grn_id.grncode
        }
    }); //GRN 001 GRN 002 == BALANCE 0

    // Filter quotations to only include those that have at least one item not in the purchase request
    const availableGRNs = quotations.filter(quotation => {
        // Check if this quotation has at least one item that's not already in the purchase request
        const hasAvailableGrns = suppliersGrn.some(grn =>
            !balanceZeroGrns.includes(grn.grncode)
        );
        return hasAvailableGrns;
    });

    console.log("Available quotations after filtering:", availableGRNs);
    return availableGRNs;
}; */


//define function for refresh form
const refreshForm = () => {
    formSupplierPayment.reset();

    //define new object
    supplierPayment = new Object();

    btnsubmit.style.display = "inline"; // display submit button
    btnclr.style.display = "inline"; // display clear button

    // enable disabled input fields
    SelectSupplier.disabled = "";
    SelectGrn.value = "";
    SelectGrn.disabled = true;

    // enable paid amount field when form refresh
    txtPaidAmount.value = "";
    txtPaidAmount.disabled = false;

    // enable payment mothod select field when form refresh
    selectPaymentMethod.value = "";
    selectPaymentMethod.disabled = false;

    // enable transfer id field when form refresh
    txtTransferID.value = "";
    txtTransferID.disabled = false;

    // enable transfer date time field when form refresh
    dateTimeTransfer.value = "";
    dateTimeTransfer.disabled = false;

    // enable cheque number field when form refresh
    txtCheckno.value = "";
    txtCheckno.disabled = false;

    // enable cheque date field when form refresh
    dateCheckDate.value = "";
    dateCheckDate.disabled = false;

    // request supplier all data
    const suppliers = getServiceRequest("/supplier/alldata");
    fillDropdown(SelectSupplier, "Select Supplier.!", suppliers, "supplier_name");

    // request grn all data
    /* const grns = getServiceRequest("/grn/alldata");
    fillDropdown(SelectGrn, "Select GRN.!", grns, "grnnumber"); */

    // request payment method all data
    const supplierPaymentMethods = getServiceRequest("/paymentmethod/alldata");
    fillDropdown(selectPaymentMethod, "Select Method.!", supplierPaymentMethods, "method");

    //set default color and reset input fields
    setDefault([SelectSupplier, SelectGrn, txtTotalAmount, selectPaymentMethod, txtCheckno,
        dateCheckDate, txtTransferID, dateTimeTransfer, txtDueAmount, txtPaidAmount,
        txtBalanceAmount]);

    /* ################## TRANFER MIN MAX DATE TIME ################# */

    // set max value for Transfer date time field [yyyy-mm-dd T0000:0000]
    let currentDate = new Date(); //current date object ekak hdagnnw 

    let currentMonth = currentDate.getMonth() + 1; // [0-11]
    if (currentMonth < 10) { currentMonth = '0' + currentMonth; }

    let currentDay = currentDate.getDate(); // [1-31]
    if (currentDay < 10) { currentDay = '0' + currentDay; }

    let currentHours = currentDate.getHours();// [0-23]
    if (currentHours < 10) currentHours = '0' + currentHours;

    let currentMinutes = currentDate.getMinutes();// [0-59]
    if (currentMinutes < 10) currentMinutes = '0' + currentMinutes;

    // Set the maximum datetime for the transfer date/time to the current datetime
    // date/time eka future ewa select kranna ba
    dateTimeTransfer.max = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay + " T " + currentHours + ":" + currentMinutes;

    // set min value for Transfer date time field [yyyy-mm-dd T0000:0000]
    currentDate.setDate(currentDate.getDate() - 7); //current date ekata dawas 7kata kalin

    let mincurrentMonth = currentDate.getMonth() + 1; // [0-11]
    if (mincurrentMonth < 10) { mincurrentMonth = '0' + mincurrentMonth; }

    let mincurrentDay = currentDate.getDate(); // [1-31]
    if (mincurrentDay < 10) { mincurrentDay = '0' + mincurrentDay; }

    let minCurrentHours = currentDate.getHours();// [0-23]
    if (minCurrentHours < 10) minCurrentHours = '0' + minCurrentHours;

    let minCurrentMinutes = currentDate.getMinutes();// [0-59]
    if (minCurrentMinutes < 10) minCurrentMinutes = '0' + minCurrentMinutes;

    dateTimeTransfer.min = currentDate.getFullYear() + "-" + mincurrentMonth + "-" + mincurrentDay + "T" + minCurrentHours + ":" + minCurrentHours;

    // set date range for payment date & check date
    // check date eke min = today, max date = today + 90
    formatDateRange("", dateCheckDate, 7, 90);
    //formatDateRange = (minInputElement, maxInputElement, minrange, maxrange)
}

//onkeyup ekedi wada krenewa (adala html input field eka athule function eka call kranne one)
SelectGrn.addEventListener("change", () => {
    let grn = JSON.parse(SelectGrn.value);
    console.log("GRN" + SelectGrn.value);

    // Parse amounts as numbers (not strings) and rounded to 2 decimal places
    txtTotalAmount.value = parseFloat(grn.netamount).toFixed(2);
    txtTotalAmount.style.border = "2px solid green";        // Set border to green
    txtTotalAmount.disabled = true; // Disable the input field

    /* ### Calculate the due amount ### */
    let netamount = parseFloat(grn.netamount).toFixed(2);
    console.log("netamount : " + netamount);

    let payamount = grn.paidamount;
    console.log("payamount : " + payamount);

    if (payamount != null) {
        payamount = parseFloat(grn.paidamount).toFixed(2);
    } else {
        payamount = 0.00;
    }
    //  net amount - paid amount, rounded to 2 decimal places
    let dueamount = (netamount - payamount);
    txtDueAmount.value = (dueamount).toFixed(2);
    txtDueAmount.style.border = "2px solid green"; // Set border to green
    txtDueAmount.disabled = true; // Disable the input field

    // Assign the calculated total amount to the supplierPayment object for backend submission
    supplierPayment.grnamount = txtDueAmount.value;
});

//create refresh table function
const refreshSupplierPaymentTable = () => {

    let supplierpayments = getServiceRequest("/supplierpayment/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "paymentnumber", dataType: "string" },
        { property: getSupplierName, dataType: "function" },
        { property: getGrnNO, dataType: "function" },
        { property: getPaymentmethod, dataType: "function" },
        { property: "grnamount", dataType: "decimal" },
        { property: "paidamount", dataType: "decimal" },
        { property: "balanceamount", dataType: "decimal" }
    ];

    //call fill data into table
    fillTableFour(tBodySupplierPayment, supplierpayments, columns, supplierPaymentFormRefill, true);
    $('#tableSupplierPayment').DataTable();
}

//define function for get supplier name
const getSupplierName = (dataOb) => {
    return dataOb.supplier_id.supplier_name;
}
//define function for get grn number
const getGrnNO = (dataOb) => {
    return dataOb.grn_id.grnnumber;
}

//define function for get Ingredients list
const getPaymentmethod = (dataOb) => {
    return dataOb.paymentmethod_id.method;
}

// user paid amount field eke change ekak kraddi trigger wenewa
txtPaidAmount.addEventListener("input", () => {
    // Convert totalamount value to a float number, or default to 0 if empty/invalid
    let grnamount = parseFloat(txtDueAmount.value) || 0;

    // Convert payment amount input value to a float number, or default to 0 if empty/invalid
    let paidamount = parseFloat(txtPaidAmount.value) || 0;

    if (paidamount > grnamount) {
        Swal.fire({
            title: "Invalid Payment Amount!",
            text: "Payment amount cannot exceed the total amount.",
            icon: "error",
            width: "20em",
            showConfirmButton: false,
            timer: 2000
        });

        // Reset to the maximum allowed value
        txtPaidAmount.value = grnamount.toFixed(2);
    }
    calculateBalanceAmount();
});

// define function for automatically calculate balance amount
const calculateBalanceAmount = () => {

    let dueamount = parseFloat(txtDueAmount.value) || 0;
    let payamount = parseFloat(txtPaidAmount.value) || 0;
    // generate balance amount
    let balanceamount = parseFloat(dueamount - payamount).toFixed(2);

    // Set balance amount to input field
    txtBalanceAmount.value = balanceamount;
    txtBalanceAmount.style.border = "2px solid green";

    // set updated balanceamount in supplierpaymnet table
    supplierPayment.balanceamount = balanceamount;
};


/* ############### PAYMENT METHOD WORKS ################ */
// user form eken payment method(Bank Transfer / Cheque) eka select kalama method ekata adala input field display krenewa

// Get Payment Method element by ID
const selectPaymentMethodElement = document.querySelector("#selectPaymentMethod");

// Add event listener, user kenek change ekak kalama
selectPaymentMethodElement.addEventListener("change", () => {

    // selected option eke text eka aregena whitespace ain krela lowercase welata convert krenewa
    const paymentmethod = selectPaymentMethodElement.options[selectPaymentMethodElement.selectedIndex].text.trim().toLowerCase();

    // Highlight the dropdown border in green to show user interaction
    selectPaymentMethodElement.style.border = "2px solid green";

    // method eka bank transfer wena input field wela ids aran group kregnnewa
    const transferFieldGroup = ["colTxtTransferid", "colTxtTransferdatetime"];
    // method eka cheque wena input field wela ids aran group kregnnewa
    const chequeFieldGroup = ["colTxtCheckno", "colTxtCheckdate"];

    // Selected method ekata anuwa input field eka display kregnnawa
    if (paymentmethod === "bank transfer") {
        // Show transfer fields and hide cheque fields
        transferFieldGroup.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
        chequeFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));

    } else if (paymentmethod === "cheque") {
        // Show cheque fields and hide transfer fields
        chequeFieldGroup.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
        transferFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));

    } else {
        // For any other payment method, hide both cheque and transfer related fields
        chequeFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));
        transferFieldGroup.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    }
});


//define Form edit function
const supplierPaymentFormRefill = (ob) => {
    console.log(ob);

    $('#modalSupplierPayment').modal('show');
    btnsubmit.style.display = "none";
    btnclr.style.display = "none";

    supplierPayment = JSON.parse(JSON.stringify(ob)); //pass wenne object nisa property value pair ekak enne.. object eken value eka allagnne json.stringify walin
    oldsupplierPayment = JSON.parse(JSON.stringify(ob));

    // set values to input fields
    SelectSupplier.disabled = true;
    SelectSupplier.value = JSON.stringify(ob.supplier_id);
    SelectGrn.disabled = true;
    SelectGrn.value = JSON.stringify(ob.grn_id.grnnumber);
    txtTotalAmount.value = ob.grn_id.netamount;

    selectPaymentMethod.value = JSON.stringify(ob.paymentmethod_id);
    selectPaymentMethod.disabled = true;

    // selected payment method eke text eka aregnnewa
    const paymentmethod = selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text;
    if (paymentmethod == "Bank Transfer") {
        txtTransferID.classList.remove("d-none");
        txtTransferID.value = ob.transferid || "";
        txtTransferID.disabled = true;

        dateTimeTransfer.classList.remove("d-none");
        dateTimeTransfer.value = ob.transferdatetime || "";
        dateTimeTransfer.disabled = true;
    }
    if (paymentmethod == "Cheque") {
        txtCheckno.classList.remove("d-none");
        txtCheckno.value = ob.checknumber || "";
        txtCheckno.disabled = true;

        dateCheckDate.classList.remove("d-none");
        dateCheckDate.value = ob.checkdate || "";
        dateCheckDate.disabled = true;
    }
    txtDueAmount.value = ob.grnamount;

    txtPaidAmount.value = ob.paidamount ? ob.paidamount : "";
    txtPaidAmount.disabled = true;

    txtBalanceAmount.value = ob.balanceamount;
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (supplierPayment.supplier_id == null) {
        SelectSupplier.style.border = "2px solid red";
        errors = errors + "Please Select Supplier First.! \n";
    }
    if (supplierPayment.grn_id == null) {
        SelectGrn.style.border = "2px solid red";
        errors = errors + "Please Select Grn Number.! \n";
    }
    if (supplierPayment.grnamount == null) {
        txtDueAmount.style.border = "2px solid red";
        errors = errors + "Please Enter valid Amount.! \n";
    }
    if (supplierPayment.paidamount == null) {
        txtPaidAmount.style.border = "2px solid red";
        errors = errors + "Please Enter valid Paid Amount.! \n";
    }
    if (supplierPayment.paymentmethod_id == null) {
        selectPaymentMethod.style.border = "2px solid red";
        errors = errors + "Please Select Payment Method.! \n";
    }

    if (supplierPayment.paymentmethod_id.method === "Bank Transfer") {
        if (supplierPayment.transferid == null || supplierPayment.transferid.trim() === "") {
            txtTransferID.style.border = "2px solid red";
            errors = errors + "Please Enter Transfer Id.! \n";
        }
        if (supplierPayment.transferdatetime == null) {
            dateTimeTransfer.style.border = "2px solid red";
            errors = errors + "Please Select Transfer Date & Time.! \n";
        }
    } else {
        if (supplierPayment.checknumber == null || supplierPayment.checknumber.trim() === "") {
            txtCheckno.style.border = "2px solid red";
            errors = errors + "Please Enter Cheque Number.! \n";
        }
        if (supplierPayment.checkdate == null) {
            dateCheckDate.style.border = "2px solid red";
            errors = errors + "Please Select Cheque Date.! \n";
        }
    }
    return errors;
}

//define function for submit button
const buttonSupplierPaymentSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following Supplier Payment";
    obName = "";
    text = "Supplier : " + supplierPayment.supplier_id.supplier_name
        + ", GRN : " + supplierPayment.grn_id.grnnumber
        + ", GRN Amount : " + supplierPayment.grnamount
        + ", Paid Amount : " + supplierPayment.paidamount
        + ", Balanced Amount : " + supplierPayment.balanceamount
        + ",  Payment Method : " + supplierPayment.paymentmethod_id.method;
    let submitResponse = ['/supplierpayment/insert', "POST", supplierPayment];
    swalSubmit(errors, title, obName, text, submitResponse, modalSupplierPayment);
}

//function define for delete Supplier Payment record
/* const supplierPaymentDelete = (ob, rowIndex) => {
    supplier = ob;
    title = "Are you sure to Delete Selected Purchase Payment";
    obName = "";
    text = "Supplier : " + supplierPayment.supplier_id.supplier_name
        + ", Required Date : " + supplierPayment.daterequired
        + ", Total Amount : " + supplierPayment.totalamount;
    let deleteResponse = getHTTPServiceRequest('/supplierpayment/delete', "DELETE", supplierPayment);
    message = "Purchase Payment has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalSupplierPayment, message);
}
 */

//define function for clear Supplier Payment form
const buttonSupplierPaymentClear = () => {
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
        title: "Are you Sure to Close Supplier Payment Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
            $('#modalSupplierPayment').modal('hide');
            refreshSupplierPaymentTable();
        }
    });
}

//function define for print Supplier Payment record
const SupplierPaymentPrint = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    activeTableRow(tBodySupplierPayment, rowIndex, "White");

    let newWindow = window.open();
    const currentDateTime = new Date().toLocaleString();
    const printView = `
        <html>
        <head>
            <title>Supplier Payment Management | 2025</title>
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
                <h1>Supplier Payment Details</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
            </div>
            <table class="table table-bordered table-striped">
                <tr>
                    <th>Payment Code</th>
                    <td>${ob.paymentnumber}</td>
                </tr>
                <tr>
                    <th>Supplier Name</th>
                    <td>${ob.supplier_id.supplier_name}</td>
                </tr>
                <tr>
                    <th>GRN Number</th>
                    <td>${ob.grnnumber}</td>
                </tr>
                <tr>
                    <th>Total Amount</th>
                    <td>LKR ${parseFloat(ob.grnamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Paid Amount</th>
                    <td>LKR ${parseFloat(ob.paidamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Balance Amount</th>
                    <td>LKR ${parseFloat(ob.balanceamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <th>Payment Method</th>
                    <td>${ob.paymentmethod_id.method}</td>
                </tr>
                <tr>
                    <th>Cheque Number</th>
                    <td>${ob.checknumber ? ob.checknumber : " - "}</td>
                </tr>
                <tr>
                    <th>Cheque Date</th>
                    <td>${ob.checkdate ? ob.checkdate : " - "}</td>
                </tr>
                <tr>
                    <th>Transfer ID</th>
                    <td>${ob.transferid ? ob.transferid : " - "}</td>
                </tr>
                <tr>
                    <th>Transfered Date and Time</th>
                    <td>${ob.transferdatetime ? ob.transferdatetime : " - "}</td>
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