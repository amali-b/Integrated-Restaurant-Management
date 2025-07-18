//browser load event handler
window.addEventListener("load", () => {
    //call refresh function
    const designations = getServiceRequest("/designation/alldata");

    const employeeStatuses = getServiceRequest("employeestatus/alldata");

    fillDropdown(selectDesignation, "Select Designation", designations, "name");
    fillDropdown(selectStatus, "Select Status", employeeStatuses, "status");

    // when change type generate reports
    selectStatus.addEventListener("change", () => {
        generateReport();
    })

    selectDesignation.addEventListener("change", () => {
        generateReport();
    })
});

// define fucntion to generate report
const generateReport = () => {
    // generate Table
    let datalist = getServiceRequest("/reportUser/bydesignationstatus?designation_id=" + selectDesignation.value + "&employeestatus_id=" + selectStatus.value);
    // let datalist = getServiceRequest("/reportUser/bydesignationstatus?designation=Manager&status=Working");


    // define new array for datalist
    let reportDataList = new Array();

    // datalist eke ena data array eke each index ekin eka aran object welata dagnnewa
    for (const index in datalist) {
        // define new object
        let object = new Object();
        // hadagaththa object ekata datalist eken ena data array dagnnewa
        object.employee_name = datalist[index][0]; //datalist eke ena eka array ekakin ena palaweni insex eka
        object.user_name = datalist[index][1];
        object.email = datalist[index][2];
        object.designations = datalist[index][3];
        object.status = datalist[index][4];

        // push objects in to defined array --> (reportDataList)
        // hdagaththta object tika push krenewa
        reportDataList.push(object);
    }

    let columns = [
        { property: "employee_name", dataType: "string" },
        { property: "user_name", dataType: "string" },
        { property: "email", dataType: "string" },
        { property: "designations", dataType: "string" },
        { property: "status", dataType: "string" }
    ];

    //call fill data into table
    fillReportTable(tHeadUserReport, tBodyUserReport, reportDataList, columns);
}



//function define for print Supplier Order record
const printTable = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    let newWindow = window.open();

    const currentDateTime = new Date().toLocaleString();
    const printView = `
        <html>
        <head>
            <title>Payment Report Management | BIT 2025</title>
            <link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">
            <style>
                body {
                    padding: 30px;
                    font-family: Arial, sans-serif;
                    margin : 20px;
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
                <h1>Payment Report</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
            </div>
            <div class="row">
            <div class="col-1"></div>
                <div class="col">
                    ${tableUserReport.outerHTML}
                </div>
                <div class="col-1"></div>    
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
}