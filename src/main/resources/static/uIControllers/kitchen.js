//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshOrderTable();
});

const fillKitchenTable = (tBodyId, datalist, columnList, inProgressFunction, readyFunction) => {

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
            // console.log("edit");
            inProgressFunction(dataOb, index);
        }

        let readyButton = document.createElement("button");
        readyButton.className = "btn btn-sm btn-outline-success me-2"
        // readyButton.innerHTML = "<i class='fa-solid fa-bowl-rice'></i><br>Ready";
        readyButton.innerText = "Redy to Serve";
        tdButtons.appendChild(readyButton);
        readyButton.onclick = () => {
            // console.log("Print");
            readyFunction(dataOb, index);
        }

        tr.appendChild(tdButtons);
        tBodyId.appendChild(tr);
    });
}


//create refresh table function
const refreshOrderTable = () => {
    // let orders = getServiceRequest("/order/alldata");
    // get orders by status id where id = 1
    let orderbyStatuses = getServiceRequest("/order/bystatus?orderstatus_id=" + 1);

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
    fillKitchenTable(tBodyKitchen, orderbyStatuses, columns, buttonInProgress, buttonComplete);
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
    if (dataOb.kitchenstatus_id.id != null) {
        // Pending
        if (dataOb.kitchenstatus_id.id == 1) {
            return "<button class='btn btn-sm btn-outline-warning text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
        }
        // In-Progress
        if (dataOb.kitchenstatus_id.id == 2) {
            return "<button class='btn btn-sm btn-outline-warning text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
        }
        // Ready
        if (dataOb.kitchenstatus_id.id == 3) {
            return "<button class='btn btn-sm btn-outline-success text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
        }
        if (dataOb.kitchenstatus_id.id == 4) {
            return "<button class='btn btn-sm btn-outline-danger text-center'>" + dataOb.kitchenstatus_id.status + "</button>";
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

// define function for Inner form table
//modify column eke dropdown ehekat button danewa
const fillInfoTable = (InnertBody, datalist, columnList) => {

    InnertBody.innerHTML = "";

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
            if (columnOb.dataType == "decimal") {
                //object eke value eka decimal point dekakin table eke show kregnna property eka float ekak baweta convert krenw
                td.innerText = parseFloat(dataOb[columnOb.property]).toFixed(2);
            }
            tr.appendChild(td);
        });

        InnertBody.appendChild(tr);
    });

};


const buttonInProgress = (dataOb, rowIndex) => {
    $('#modalKitchen').modal('show');

    // Extract items from the orderHasSubmenu table
    const submenuItems = dataOb.orderHasSubmenuList;

    //define function for refresh inner table
    let columnSubmenu = [
        { property: getSubmenuName, dataType: "function" },
        { property: "quantity", dataType: "string" }
    ];
    //call fill data into table
    fillInfoTable(tBodyKitchenSubmenus, submenuItems, columnSubmenu);

    // Extract items from the orderHasMenuitem table
    const menuItems = dataOb.orderHasMenuitemList;

    //define function for refresh inner table
    let columns = [
        { property: getMenuName, dataType: "function" },
        { property: "quantity", dataType: "string" }
    ];
    //call fill data into table
    fillInfoTable(tBodyKitchenMenus, menuItems, columns);

    console.log(dataOb);

    // create ingredient list
    let ingredientList = [];

    // Calculate total quantiy from submenu items
    for (const ositem of dataOb.orderHasSubmenuList) {
        // submenuHasIngredientList list eke item ekin eka search krela eke id eka orderHasSubmenuList eke ingredient eke id ekata samana wenewanm index eka return krenw
        for (const submenuIng of ositem.submenu_id.submenuHasIngredientList) {
            let extIngredient = ingredientList.map(item => item.ingredient_id.id).indexOf(submenuIng.ingredient_id.id);
            if (extIngredient > -1) {
                ingredientList[extIngredient].required_qty = parseFloat(ingredientList[extIngredient].required_qty) + (parseFloat(submenuIng.quantity) * parseFloat(ositem.quantity))
            } else {
                let orderHasIng = new Object();
                orderHasIng.required_qty = (parseFloat(submenuIng.quantity) * parseFloat(ositem.quantity));
                orderHasIng.available_qty = 0;
                orderHasIng.ingredient_id = submenuIng.ingredient_id;
                ingredientList.push(orderHasIng);
            }
        }
    }

    for (const mitem of dataOb.orderHasMenuitemList) {
        for (const ositem of mitem.menuitems_id.menuHasSubmenusList) {
            // submenuHasIngredientList list eke item ekin eka search krela eke id eka selected ingredient eke id ekata samana wenewanm index eka return krenw
            for (const submenuIng of ositem.submenu_id.submenuHasIngredientList) {
                let extIngredient = ingredientList.map(item => item.ingredient_id.id).indexOf(submenuIng.ingredient_id.id);
                if (extIngredient > -1) {
                    ingredientList[extIngredient].required_qty = parseFloat(ingredientList[extIngredient].required_qty) + (parseFloat(submenuIng.quantity) * parseFloat(ositem.quantity))
                } else {
                    let orderHasIng = new Object();
                    orderHasIng.required_qty = (parseFloat(submenuIng.quantity) * parseFloat(ositem.quantity));
                    orderHasIng.available_qty = 0;
                    orderHasIng.ingredient_id = submenuIng.ingredient_id;
                    ingredientList.push(orderHasIng);
                }
            }
        }
    }

    console.log(ingredientList);

    // Extract items from the orderHasMenuitem table
    for (const itemIng of ingredientList) {
        const availableInventory = getServiceRequest("/inventory/byingredient/" + itemIng.ingredient_id.id);
        let total_ava_qty = 0;
        for (const invItem of availableInventory) {
            total_ava_qty = parseFloat(total_ava_qty) + parseFloat(invItem.availablequantity);
        }
        itemIng.available_qty = total_ava_qty;
    }

    //define function for refresh inner table
    let columnIngredients = [
        { property: getInventoryName, dataType: "function" },
        { property: "required_qty", dataType: "string" },
        { property: "available_qty", dataType: "string" },
    ];

    //call fill data into table
    fillInfoTable(tBodyInventory, ingredientList, columnIngredients);
    for (const itemIng of ingredientList) {
        if (itemIng.required_qty > itemIng.available_qty) {
            // Find the matching row and color it
            let row = document.querySelector("tr[data-ingredient='" + itemIng.ingredient_id.ingredient_name + "']");
            if (row) {
                row.style.backgroundColor = "#f8d7da";
                row.style.color = "#721c24";
            }
        } else if ((itemIng.available_qty - itemIng.required_qty) < 10) {
            // Low stock warning
            let row = document.querySelector("tr[data-ingredient='" + itemIng.ingredient_id.ingredient_name + "']");
            if (row) {
                row.classList.add("background-color", "#fff3cd");
                row.classList.add("color", "#856404");
            }
        }
    }
    order = dataOb;
    order.orderHasIngredientList = ingredientList;
    $('#tableInventory').DataTable();
}

const getSubmenuName = (dataOb) => {
    return dataOb.submenu_id.name;
}

const getMenuName = (dataOb) => {
    return dataOb.menuitems_id.name;
};

const getInventoryName = (dataOb) => {
    return dataOb.ingredient_id.ingredient_name + "( " + dataOb.ingredient_id.measuring_unit + dataOb.ingredient_id.unittype_id.name + " )";
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
            $('#modalKitchen').modal('hide');

            refreshOrderTable();
        }
    });
}

const itemsPrint = (orderData, rowIndex) => {
    console.log("Printing order:", orderData, rowIndex);

    const currentDateTime = new Date().toLocaleString();
    // Create and configure the print window
    const printWindow = window.open();

    // Print eke content eka generate krena function eka cll krenewa
    const printContent = `
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

    // Write content and handle printing
    printWindow.document.writeln(printContent);

    // Wait for content to load, then print
    setInterval(() => {
        //window eka load wena eka naweththenewa
        newWindow.stop();
        //print option eka open wenna
        newWindow.print();
        //print model eke close eka click kalama tab ekath close wenw
        newWindow.close();
    }, 300);
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

