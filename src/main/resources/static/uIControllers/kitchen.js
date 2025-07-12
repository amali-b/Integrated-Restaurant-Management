//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshOrderTable();
});

const fillKitchenTable = (tBodyId, datalist, columnList) => {

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

        orderStatuses = getServiceRequest("/orderStatus/alldata");
        orderStatuses.forEach((orderStatus, index) => {
            let inputCheck = document.createElement("input");
            inputCheck.type = "radio";
            inputCheck.id = orderStatus.id;
            inputCheck.className = "btn-check";
            inputCheck.name = "button_status";
            inputCheck.setAttribute("autocomplete", "off");
            inputCheck.value = orderStatus.id;

            if (dataOb.button_status == orderStatus.status) {
                inputCheck.checked = true;
            }

            let newLabel = document.createElement("label");
            newLabel.className = "btn btn-sm btn-outline-success me-2";
            newLabel.innerText = orderStatus.status;
            newLabel.setAttribute("for", orderStatus.id);
            tdButtons.appendChild(newLabel);

            /* let inProgressButton = document.createElement("label");
            inProgressButton.className = "btn btn-sm btn-outline-warning me-2";
            inProgressButton.innerText = "In-Progres";
            inProgressButton.setAttribute("for", 2);
            tdButtons.appendChild(inProgressButton);

            let readyButton = document.createElement("label");
            readyButton.className = "btn btn-sm btn-outline-success me-2";
            readyButton.innerText = "Ready";
            readyButton.setAttribute("for", 3);
            tdButtons.appendChild(readyButton);

            let completeButton = document.createElement("label");
            completeButton.className = "btn btn-sm btn-outline-success me-2";
            completeButton.innerText = "Completed";
            completeButton.setAttribute("for", 4);
            tdButtons.appendChild(completeButton);

            let cancelButton = document.createElement("label");
            cancelButton.className = "btn btn-sm btn-outline-danger me-2";
            cancelButton.innerText = "Cancel";
            cancelButton.setAttribute("for", 5);
            tdButtons.appendChild(completeButton); */

            tr.appendChild(tdButtons);
            tBodyId.appendChild(tr);
        });
    });
};


//create refresh table function
const refreshOrderTable = () => {

    let orders = getServiceRequest("/order/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "ordercode", dataType: "string" },
        { property: getOrderedItems, dataType: "function" },
        { property: getOrderType, dataType: "function" },
    ];

    //call fill data into table
    fillKitchenTable(tBodyKitchen, orders, columns);
    $('#tableKitchen').DataTable();
}

//define function for get Ingredients list
const getOrderedItems = (dataOb) => {
    /* if (dataOb.submenu_id != null) {
        return dataOb.submenu_id.name;
    }

    if (dataOb.menuitems_id != null) {
        return dataOb.menuitems_id.name;
    } */

    // return dataOb.submenu_id.name + dataOb.menuitems_id.name;
    return "items";
}

/* //define function for get  order status
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
} */

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