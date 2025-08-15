//browser load event handler
window.addEventListener("load", () => {

    //call refresh form
    refreshGarbageRemoveForm();

    //call refresh Table
    refreshGarbageRemovetable();
});

//define refresh form function
const refreshGarbageRemoveForm = () => {
    formGarbageRemove.reset();
    btnsubmit.style.display = "inline";
    btnclr.style.display = "inline";

    //define Item Object
    garbageremove = new Object();

    const ingredients = getServiceRequest("/ingredient/alldata");
    fillDropdown(SelectIngredints, "Select Ingredient.!", ingredients, "ingredient_name");

    setDefault([SelectIngredints, txtQuantity, txtRemovedReason]);
}

//table ekema modify column eke buttons danewa
const fillTable = (tableBody, datalist, columnList, editFunction) => {
    tableBody.innerHTML = "";

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

        //html eke call krepu function welata data parse kranna methana dataOb, Index parse krenewa
        tr.onclick = () => {
            window['editob'] = dataOb;
            window['editrowno'] = index;
            activeTableRow(tBodyDineinTables, index, "Cornsilk");
            editFunction(dataOb, index);
        }

        tableBody.appendChild(tr);
    });
};

//define refresh table function
const refreshGarbageRemovetable = () => {
    let garbageRemoves = getServiceRequest("/garbageremove/alldata");

    let columns = [
        { property: getIngredient, dataType: "function" },
        { property: "quantity", dataType: "function" },
        { property: "reason", dataType: "string" },
        { property: getDate, dataType: "function" }
    ];

    //call fill data into table

    fillTable(tBodyGarbageRemove, garbageRemoves, columns);
    $('#tableGarbageRemove').DataTable();
}

const getIngredient = (dataOb) => {
    return dataOb.ingredient_id.ingredient_name;
}

const getDate = (dataOb) => {
    return dataOb.addeddatetime;
}

//define Form edit function
const tablesFormRefill = (ob, rowIndex) => {
    btnsubmit.style.display = "none";
    btnclr.style.display = "none";

    garbageremove = JSON.parse(JSON.stringify(ob));
    oldgarbageremove = JSON.parse(JSON.stringify(ob));

    SelectIngredints.value = JSON.stringify(ob.ingredient_id);
    SelectIngredints.disabled = true;

    txtQuantity.value = ob.quantity;
    txtQuantity.disabled = true;

    txtRemovedReason.value = ob.reason;
    txtRemovedReason.disabled = true;
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (garbageremove.ingredient_id == null) {
        SelectIngredints.style.border = "2px solid red";
        errors = errors + "Please Select Ingredient First.! \n";
    }
    if (garbageremove.quantity == null) {
        txtQuantity.style.border = "2px solid red";
        errors = errors + "Please Enter quantity.! \n";
    }
    if (garbageremove.reason == null) {
        txtRemovedReason.style.border = "2px solid red";
        errors = errors + "Please Enter reason for removal.! \n";
    }
    return errors;
}

//define function for submit button
const buttonGarbageremoveSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following Garbage Remove for ";
    obName = garbageremove.ingredient_id.ingredient_name;
    text = "Quantity : " + garbageremove.quantity
        + ", Reason : " + garbageremove.reason;
    let submitResponse = ['/garbageremove/insert', "POST", garbageremove];
    swalSubmit(errors, title, obName, text, submitResponse, "");
}

//define function for clear/reset button
const buttonFormClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshGarbageRemoveForm();
        }
    });
}

