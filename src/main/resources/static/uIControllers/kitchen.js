//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshOrderTable();
});

const fillKitchenTable = (tBodyId, datalist, columnList, inProgressFunction, completeFunction) => {

    tBodyId.innerHTML = "";

    datalist.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt((index) + 1);
        tr.appendChild(tdIndex);

        columnList.forEach(columnOb => {
            let td = document.createElement("td");

            if (columnOb.dataType == "string") {
                //dataOb kyela datalist eke eka object ekak aran ekata property eke nama dila access krenewa.. [columnOb.property] me wdyta dala thyenne string ekaka dataOb.property wdyt gnna ba.
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            tr.appendChild(td);
        });

        let tdButtons = document.createElement("td");

        let inProgressButton = document.createElement("button");
        inProgressButton.className = "btn btn-sm btn-outline-warning me-2"
        inProgressButton.innerHTML = "<i class='fa-solid fa-fire-burner icon'></i><br> In-Progress";
        // inProgressButton.innerText = "Edit";
        tdButtons.appendChild(inProgressButton);
        inProgressButton.onclick = () => {
            console.log("edit");
            inProgressFunction(dataOb, index);
        }

        let completeButton = document.createElement("button");
        completeButton.className = "btn btn-sm btn-outline-success me-2"
        completeButton.innerHTML = "<i class='fa-solid fa-bowl-rice'></i><br> Complete";
        // completeButton.innerText = "Print";
        tdButtons.appendChild(completeButton);
        completeButton.onclick = () => {
            console.log("Print");
            completeFunction(dataOb, index);
        }

        tr.appendChild(tdButtons);
        tBodyId.appendChild(tr);
    });
}


//create refresh table function
const refreshOrderTable = () => {

    // 
    let orders = getServiceRequest("/order/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "ordercode", dataType: "string" },
        { property: getOrderType, dataType: "function" },
        { property: getOrderStatus, dataType: "function" },
        { property: getKitchenStatus, dataType: "function" },
    ];

    //call fill data into table
    fillKitchenTable(tBodyKitchen, orders, columns, buttonInProgress, buttonComplete);
    $('#tableKitchen').DataTable();
}

//define function for get  order status
const getOrderStatus = (dataOb) => {
    if (dataOb.orderstatus_id.status == "New") {
        return "<button class='btn btn-sm btn-outline-info text-center'>" + dataOb.orderstatus_id.status + "</button>";
    }
    if (dataOb.orderstatus_id.status == "In-Progress") {
        return "<button class='btn btn-sm btn-outline-warning text-center'>" + dataOb.orderstatus_id.status + "</button>";
    }
    if (dataOb.orderstatus_id.status == "Ready") {
        return "<button class='btn btn-sm btn-outline-success text-center'>" + dataOb.orderstatus_id.status + "</button>";
    }
    if (dataOb.orderstatus_id.status == "Canceled") {
        return "<button class='btn btn-sm btn-outline-warning text-center'>" + dataOb.orderstatus_id.status + "</button>";
    }
    if (dataOb.orderstatus_id.status == "Removed") {
        return "<button class='btn btn-sm btn-outline-danger text-center'>" + dataOb.orderstatus_id.status + "</button>";
    }
    return dataOb.orderstatus_id.status;
}

//define function for get  order status
const getKitchenStatus = (dataOb) => {
    if (dataOb.kitchenstatus_id.status != null) {
        if (dataOb.kitchenstatus_id.status == "Pending") {
            return "<button class='btn btn-sm btn-outline-warning text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
        }
        if (dataOb.kitchenstatus_id.status == "In-Progress") {
            return "<button class='btn btn-sm btn-outline-warning text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
        }
        if (dataOb.kitchenstatus_id.status == "Completed") {
            return "<button class='btn btn-sm btn-outline-success text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
        }
        if (dataOb.kitchenstatus_id.status == "Canceled") {
            return "<button class='btn btn-sm btn-outline-warning text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
        }
    } else {
        return "-";
    }
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


//define function for get Ingredients list
const buttonComplete = (dataOb) => {
    dataOb.orderstatus_id.id = 4;
    refreshOrderTable();
}

const buttonInProgress = (dataOb, rowIndex) => {
    $('#modalKitchen').modal('show');

    // Extract items from the correct association names
    const submenuItems = dataOb.orderHasSubmenuList || [];
    const menuItems = dataOb.orderHasMenuitemList || [];
    // Merge both arrays into a single items array
    const allItems = [...submenuItems, ...menuItems];

    let columns = [
        { property: getItemname, dataType: "function" },
        { property: "quantity", dataType: "string" },
    ];

    //call fill data into table
    fillInnerTable(tBodyKitchenItems, allItems, columns, "", "", false);

}

const getItemname = () => {
    return allItems.map((item, index) => {
        console.log(` Processing item ${index + 1}: `, item);

        // Handle different item types and database structures
        let itemName;

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
    });
};

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
            $('#modalKitchen').modal('hide');

            refreshOrderTable();
        }
    });
}




/* *
 * Generates a compact items table for the modal
 * @param {Object} orderData - The order data
 * @returns {string} - HTML table string
 */
const generateModalItemsTable = (dataOb) => {

    // Extract items from the correct association names
    const submenuItems = dataOb.orderHasSubmenuList || [];
    const menuItems = dataOb.orderHasMenuitemList || [];

    // Merge both arrays into a single items array
    const allItems = [...submenuItems, ...menuItems];

    let tableHTML = `
        <table class="table table-sm table-striped">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>QUantity</th>
                </tr>
            </thead>
            <tbody>
    `;

    allItems.forEach(item => {
        let itemName, quantity;

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

        quantity = item.quantity;

        tableHTML += `
            <tr>
                <td>${itemName}</td>
                <td>${quantity}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    return tableHTML;
};


window.confirmPrint = () => {
    if (window.printConfirmCallback) {
        window.printConfirmCallback();
    }
    window.closePrintModal();
};

// Print eke content eka generate krena function eka define krenewa
// @param {Object} order - order object eke thama all order details thyenne
const generateOrderPrintHTML = (dataOb) => {
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
    </head>
    <body>
        <div class="header">
                <img src="images/bando1.png" alt="Logo">
                <h1>Ordered Items</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
        </div>

        <div class="items-section">
            <h3> Order Items</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateItemRows(dataOb)}
                </tbody>
                </tbody>
            </table>
        </div>

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
const generateItemRows = (dataOb) => {
    // Extract items from the correct association names
    const submenuItems = dataOb.orderHasSubmenuList || [];
    const menuItems = dataOb.orderHasMenuitemList || [];

    // Merge both arrays into a single items array
    const allItems = [...submenuItems, ...menuItems];

    console.log(" Found items:", allItems);

    return allItems.map((item, index) => {
        console.log(` Processing item ${index + 1}: `, item);

        // Handle different item types and database structures
        let itemName, quantity;

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

        quantity = item.quantity;

        console.log(`Extracted data - Name: ${itemName},Qty: ${quantity} `);

        return `
            < tr >
                <td>${index + 1}</td>
                <td>${itemName}</td>
                <td>${quantity}</td>
            </tr >
    `;
    }).join('');
};