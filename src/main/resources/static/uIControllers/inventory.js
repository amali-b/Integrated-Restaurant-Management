//browser load event handler
window.addEventListener("load", () => {

    //call refresh Table
    refreshInventorytable();
});

//define refresh table function
const refreshInventorytable = () => {
    let inventories = getServiceRequest("/inventory/alldata");

    // Format date fields to remove the time part
    //forEach() eken inventories array eke hama item ehektm ynewa
    inventories.forEach(item => {
        //call formatDate function and return date like "25-Apr-2025" else return empty string.
        item.expiredate = formatDate(item.expiredate, "dd-mmm-yyyy");       // or "mmm-d-yyyy"
        item.manufacturedate = formatDate(item.manufacturedate, "dd-mmm-yyyy"); // or "mmm-d-yyyy"
    });
    /* inventories = inventories.map(item => ({
        ...item,
        expiredate: formatDate(item.expiredate, "dd-mmm-yyyy"),   // or "mmm-d-yyyy"
        manufacturedate: formatDate(item.manufacturedate, "dd-mmm-yyyy") // or "mmm-d-yyyy"
    })); */

    let columns = [
        { property: getInventoryName, dataType: "function" },
        { property: "availablequantity", dataType: "string" },
        { property: "totalquantity", dataType: "string" },
        { property: "expiredate", dataType: "string" },
        { property: "manufacturedate", dataType: "string" },
        { property: "batchnumber", dataType: "string" },
        { property: getInventoryStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodyInventory, inventories, columns, true);
    $('#tableInventory').DataTable();
}

const getInventoryName = (dataOb) => {
    return dataOb.ingredient_id.ingredient_name;
}

const getInventoryStatus = (dataOb) => {
    if (dataOb.inventorystatus_id.status == "Available") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.inventorystatus_id.status + "</p>";
    }
    if (dataOb.inventorystatus_id.status == "Not-Available") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.inventorystatus_id.status + "</p>";
    }
    if (dataOb.inventorystatus_id.status == "Deleted") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.inventorystatus_id.status + "</p>";
    }
    return dataOb.inventorystatus_id.status;
}
