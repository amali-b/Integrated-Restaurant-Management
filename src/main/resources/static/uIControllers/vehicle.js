//browser load event handler
window.addEventListener("load", () => {

    //call refresh form
    refreshForm();
    //call refresh Table
    refreshVehicleTable();
});

//define function for refresh form
const refreshForm = () => {
    formVehicle.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    //define new object
    vehicle = new Object();

    const vehicleStatuses = getServiceRequest("/vehiclestatus/alldata");
    fillDropdown(vehicleStatus, "Select Status!", vehicleStatuses, "status");

    vehicleName.value = "";
    vehicleName.disabled = false;
    vehicleNo.value = "";
    vehicleNo.disabled = false;


    setDefault([vehicleName, vehicleNo, vehicleStatus]);
}

//table ekema modify column eke buttons danewa
const fillTable = (vehicleTableBody, datalist, columnList, editFunction, deleteFunction, buttonVisibility = true) => {
    vehicleTableBody.innerHTML = "";

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

        let tdButton = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-outline-danger"
        deleteButton.innerHTML = "<i class='fa fa-trash'></i>";
        // deleteButton.innerText = "Delete";
        tdButton.appendChild(deleteButton);
        deleteButton.onclick = () => {
            console.log("Delete");
            deleteFunction(dataOb, index);
        }
        tr.appendChild(tdButton);

        //buttonVisibility eken button tika table eke penawd ndda kyl blagnna
        if (buttonVisibility) {
            //html eke call krepu function welata data parse kranna methana dataOb, Index parse krenewa
            tr.onclick = () => {
                window['editob'] = dataOb;
                window['editrowno'] = index;
                activeTableRow(vehicleTableBody, index, "Cornsilk");
                editFunction(dataOb, index);
            }
            tdButton.appendChild(deleteButton);
        }
        vehicleTableBody.appendChild(tr);
    });
};

//create refresh vehicle function
const refreshVehicleTable = () => {
    const vehicles = getServiceRequest("/vehicle/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "name", dataType: "string" },
        { property: "vehiclenumber", dataType: "string" },
        { property: getVehicleStatus, dataType: "function" }
    ];

    //call fill data into vehicle
    fillTable(vehicleTableBody, vehicles, columns, vehiclesFormRefill, vehicleDelete, true);
    $('#tableVehicle').DataTable();
}

//define Form for get vehicle status
const getVehicleStatus = (dataOb) => {
    return dataOb.vehiclestatus_id.status;
}

//define Form edit function
const vehiclesFormRefill = (ob, rowIndex) => {
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    vehicle = JSON.parse(JSON.stringify(ob));
    oldvehicle = JSON.parse(JSON.stringify(ob));

    vehicleName.value = ob.name;
    vehicleName.disabled = true;
    vehicleNo.value = ob.vehiclenumber;
    vehicleNo.disabled = true;
    vehicleStatus.value = JSON.stringify(ob.vehiclestatus_id);
}

// define function for update vehicle details
const buttonVehicleUpdate = () => {
    //check errors
    if (vehicle.vehiclestatus_id != null) {
        //check updates
        let updates = "";
        if (vehicle.vehiclestatus_id != oldvehicle.vehiclestatus_id) {
            updates = "Vehicle Status has updated From : " + oldvehicle.vehiclestatus_id.status + " TO : " + vehicle.vehiclestatus_id.status;
        }
        let title = "Are you sure to update following updates.?";
        let text = updates;
        let updateResponse = ['/vehicle/update', "PUT", vehicle];
        swalUpdate(updates, title, text, updateResponse, "");
    } else {
        Swal.fire({
            title: "Failed to Update.! Form has following errors :",
            text: "Please Select Status!",
            icon: "error"
        });
    }
}

// define function for add vehicle record
const buttonVehicleSubmit = () => {
    //check if there are any errors
    let errors = "";
    if (vehicle.name == null) {
        countSeat.style.border = "2px solid red";
        errors = "Please Enter Seat Count.!";
    }
    if (vehicle.vehiclenumber == null) {
        countSeat.style.border = "2px solid red";
        errors = errors + "Please Enter Seat Count.!";
    }
    if (vehicle.vehiclestatus_id == null) {
        countSeat.style.border = "2px solid red";
        errors = errors + "Please Enter Seat Count.!";
    }
    title = "Are you sure to Submit following Table";
    obName = vehicle.name;
    text = "Vehicle Number : " + vehicle.vehiclenumber;
    let submitResponse = ['/vehicle/insert', "POST", vehicle];
    swalSubmit(errors, title, obName, text, submitResponse, "");
}

// define function delete vehicle record
const vehicleDelete = (ob, index) => {
    vehicle = ob;
    title = "Are you sure to Delete Selected Vehicle";
    obName = ob.name;
    text = "Vehicle Number : " + ob.vehiclenumber;
    let deleteResponse = ['/vehicle/delete', "DELETE", vehicle];
    message = "Vehicle has Deleted.";
    swalDelete(title, obName, text, deleteResponse, "", message);
}

// define function clear vehicle form
const buttonVehicleClear = () => {
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




